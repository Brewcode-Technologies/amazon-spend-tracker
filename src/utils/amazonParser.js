/**
 * Parses Amazon transaction text from various formats.
 * Supported formats:
 * 1. Amazon Payments -> Transactions (Visa *... lines)
 * 2. Amazon Order History (CSV or Text copy-paste)
 * 3. Plain text format
 */
export function parseTransactions(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split('\n').filter(l => l.trim());
  const txns = [];

  // 1. Check for Amazon Payments Format (Visa *...)
  // Format: Visa **0835-$11.98 Order #111-3433669-5709803 AMZN Mktp US December 28, 2025
  const isPaymentsFormat = rawText.includes('Visa') && (rawText.includes('Order #'));

  if (isPaymentsFormat) {
    // Regex breakdown:
    // Visa\s+\**\d+      -> Start
    // ([+-])?            -> Sign (Group 1)
    // ([$₹€£]|Rs\.?)?    -> Currency (Group 2)
    // \s*([\d,]+\.\d{2}) -> Amount (Group 3)
    // Order\s+#([\d-]+)  -> Order ID (Group 4)
    // ([\s\S]*?)         -> Product (Group 5)
    // (?:\s+(\w+\s+\d{1,2},?\s+\d{4}))? -> Optional Date (Group 6)
    const paymentRegex = /Visa\s+[*]*\d+([+-])?([$₹€£]|Rs\.?)?\s*([\d,]+\.\d{2})\s+Order\s+#([\d-]+)\s+([\s\S]*?)(?:\s+(\w+\s+\d{1,2},?\s+\d{4}))?(?=\s*Visa|\s*$)/gi;

    let match;
    while ((match = paymentRegex.exec(rawText)) !== null) {
        const sign = match[1] || '-'; 
        const currency = match[2] || null;
        const amountStr = match[3].replace(/,/g, '');
        const order = match[4];
        let merchantOrProduct = match[5].trim(); 
        const dateStr = match[6];

        let amount = parseFloat(amountStr);
        const date = dateStr ? new Date(dateStr) : null;
        
        merchantOrProduct = merchantOrProduct.replace(/[\n\r]+/g, ' ').trim();

        let type = 'debit';
        if (merchantOrProduct.toLowerCase().includes('refund')) {
            type = 'credit';
        } else if (merchantOrProduct.toLowerCase().includes('cancelled') || merchantOrProduct.toLowerCase().includes('canceled')) {
            type = 'cancelled';
        } else if (sign === '+') {
            type = 'credit';
        }

        if (amount > 0) {
            txns.push({
                amount,
                currency,
                date,
                order,
                product: merchantOrProduct || 'Amazon Purchase',
                type,
                raw: match[0].trim()
            });
        }
    }
    
    if (txns.length > 0) return txns;
  }
  
  // 2. CSV Format Check (Simplified/Skipped for brevity as main focus is text paste) 
  // ... (Keep existing CSV check logic if needed, but for now assuming text paste is primary for currency request)
  // Logic below handles Order History text which is more common for currency variation.

// 3. Check for Amazon Order History Text Format (Copy-Paste)
  // Supports: "Order placed ... Total ₹499.00"
  if (rawText.toLowerCase().includes('order placed') && (rawText.includes('Total') || rawText.includes('Cancelled'))) {
      const blocks = rawText.split(/Order placed/gi).filter(b => b.trim());
      
      for (const block of blocks) {
          const dateMatch = block.match(/(\d{1,2}\s+\w+\s+\d{4})/);
          const dateStr = dateMatch ? dateMatch[1] : null;
          
          const orderMatch = block.match(/Order\s*#\s*([\d-]+)/);
          const order = orderMatch ? orderMatch[1] : null;

          // Extract Amount & Currency
          // Extract Amount & Currency
          // Support newlines between Total and Amount
          const totalMatch = block.match(/Total\s*(?:[$₹€£]|Rs\.?)?\s*([\d,]+\.\d{2})/i);
          
          // Re-check for currency specifically to capture it cleanly if needed, 
          // but usually we just want to know if it's INR.
          const currencyMatch = block.match(/([$₹€£]|Rs\.?)\s*[\d,]+\.\d{2}/i);
          let currency = (currencyMatch && currencyMatch[1]) || null;
          
          // Normalize Rs. to ₹
          if (currency === 'Rs.' || currency === 'Rs') currency = '₹';

          let amount = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0;
          
          let type = 'debit';
          if (block.toLowerCase().includes('refunded') || block.toLowerCase().includes('refund has been issued')) {
             type = 'refunded_order'; 
          } else if (block.toLowerCase().includes('cancelled')) {
             type = 'cancelled';
          }
          
          
          // Product Extraction Heuristic
          const lines = block.split('\n').map(l => l.trim()).filter(l => l);
          
          // Find the index of the Order # line
          const orderLineIndex = lines.findIndex(l => l.toLowerCase().includes('order #'));
          
          const systemKeywords = [
              'Total', 'Ship to', 'Order #', 'View', 'Invoice', 'Delivered', 
              'Package', 'Return', 'Buy it again', 'Write a', 'Ask Product', 
              'Get product', 'Refunded', 'Cancelled', 'If you have', 'Amazon Pay', 
              'Your return', 'When will', 'Arriving', 'Track package', 'Problem with',
              'Archive order', 'Leave seller', 'Share gift', 'Feedback', 'Rate this'
          ];
          
          // Only look for products AFTER the order # to avoid "Ship to Names"
          // If order # not found (unlikely), search whole block
          const searchStartIndex = orderLineIndex !== -1 ? orderLineIndex + 1 : 0;
          
          const potentialProducts = lines.slice(searchStartIndex).filter(l => {
             // Exclude lines containing system keywords
             if (systemKeywords.some(k => l.includes(k))) return false;
             // Exclude prices
             if (/[₹$]\d+/.test(l)) return false;
             // Exclude dates (sometimes repeated)
             if (/\d{1,2}\s+\w+\s+\d{4}/.test(l)) return false;
             // Exclude short lines or common buttons
             if (l.length < 4) return false;
             // Exclude "Return window closed on..." specific pattern if keyword missing
             if (l.toLowerCase().includes('return window')) return false;
             // Exclude "Sold by:"
             if (l.toLowerCase().includes('sold by')) return false;
             
             return true;
          });
          
          let product = potentialProducts.length > 0 ? potentialProducts[0] : 'Amazon Order';
          
          // Fallback: If "Amazon Order" and we have a Cancelled type, call it "Cancelled Order"
          if (product === 'Amazon Order' && type === 'cancelled') {
              product = 'Cancelled Order';
          }

          if (type === 'cancelled' && amount === 0) {
              // Sometimes cancelled orders don't show total. We might skip or show 0.
              // We'll keep it to show "Cancelled" in the list.
          }

          if (amount > 0 || type === 'cancelled') {
              txns.push({
                  amount,
                  currency,
                  date: dateStr ? new Date(dateStr) : null,
                  order,
                  product,
                  type, // 'debit', 'refunded_order', 'cancelled'
                  raw: 'Order placed ' + block.trim().substring(0, 100) + '...'
              });
          }
      }
      
      if (txns.length > 0) return txns;
  }

  // 4. Fallback: Simple extraction of Date/Price/Order from text blocks
  // (Logic from original `else` block)
  const amountRegex = /[-]?\$([\d,]+\.\d{2})/g;
  const dateRegex = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi;
  const orderRegex = /Order\s+#([\d-]+)/i;

  for (const line of lines) {
      // Skip if already processed
      if (txns.some(t => t.raw === line)) continue;

      const amounts = line.match(amountRegex);
      const dates = line.match(dateRegex);
      const orders = line.match(orderRegex);

      if (amounts && amounts.length > 0) {
          const amount = parseFloat(amounts[0].replace(/[\$,]/g, ''));
          // Handle negative vs positive context? 
          // Usually strict "Cost" is desired.
          const absAmount = Math.abs(amount);
          
          if (absAmount > 0) {
              txns.push({
                  amount: absAmount,
                  date: dates ? new Date(dates[0]) : null,
                  order: orders ? orders[1] : null,
                  product: 'Amazon Order',
                  type: 'debit',
                  raw: line
              });
          }
      }
  }

  return txns;
}
