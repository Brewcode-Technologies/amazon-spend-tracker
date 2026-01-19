'use client';

import { useState, useEffect } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { FcDocument, FcUpload, FcLock, FcBarChart, FcPieChart, FcClock, FcNightPortrait, FcEmptyTrash, FcDownload, FcPrint, FcFolder, FcHighPriority, FcMoneyTransfer, FcStatistics } from 'react-icons/fc';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function Home() {
  const [text, setText] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [view, setView] = useState('overview');
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currencyRate, setCurrencyRate] = useState(0.012); // ₹ to $ conversion
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [showPrintView, setShowPrintView] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [dragActive, setDragActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('amazonTransactions');
    const savedText = localStorage.getItem('amazonText');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      const withDates = parsed.map(t => ({
        ...t,
        date: t.date ? new Date(t.date) : null
      }));
      setTransactions(withDates);
    }
    if (savedText) setText(savedText);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('amazonTransactions', JSON.stringify(transactions));
      localStorage.setItem('amazonText', text);
    }
  }, [transactions, text]);

  function parseTransactions(rawText) {
    if (!rawText.trim()) return [];

    const lines = rawText.split('\n').filter(l => l.trim());
    const txns = [];

    // Check if it's CSV format (Indian Amazon export)
    const isCSV = rawText.includes(',') && rawText.toLowerCase().includes('order id');

    if (isCSV) {
      const rows = lines.filter(l => !l.includes('SUBTOTAL') && !l.startsWith('=') && !l.startsWith('"="'));
      const headers = rows[0]?.split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
      
      if (!headers) return [];

      // More flexible header matching for Amazon CSV exports
      const orderIdx = headers.findIndex(h => h.includes('order') && (h.includes('id') || h.includes('number')));
      const dateIdx = headers.findIndex(h => h.includes('date') || h.includes('placed'));
      const priceIdx = headers.findIndex(h => h.includes('price') || h.includes('total') || h.includes('amount') || h.includes('cost'));
      const productIdx = headers.findIndex(h => h.includes('title') || h.includes('product') || h.includes('item') || h.includes('name'));
      
      console.log('CSV Headers found:', headers);
      console.log('Column indices - Order:', orderIdx, 'Date:', dateIdx, 'Price:', priceIdx, 'Product:', productIdx);

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',').map(c => c.trim().replace(/"/g, ''));
        if (row.length < 3) continue;

        const order = orderIdx >= 0 ? row[orderIdx] : `Order-${i}`;
        const dateStr = dateIdx >= 0 ? row[dateIdx] : null;
        const priceStr = priceIdx >= 0 ? row[priceIdx] : row.find(cell => /[₹$]?\d+\.\d{2}/.test(cell));
        let product = productIdx >= 0 ? row[productIdx] : 'Unknown Product';
        
        // If product is empty or "Not Available", try to find it in other columns
        if (!product || product === 'Unknown Product' || product.toLowerCase().includes('not available')) {
          product = row.find(cell => 
            cell.length > 3 && 
            !cell.match(/^\d/) && 
            !cell.includes('₹') && 
            !cell.includes('$') && 
            !cell.toLowerCase().includes('not available') &&
            !cell.match(/^\d{3}-\d{7}-\d{7}$/) && // order number pattern
            !cell.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/) // date pattern
          ) || 'Product Name Not Found';
        }

        console.log('Row data:', { order, dateStr, priceStr, product, fullRow: row });

        if (!priceStr) continue;

        const amount = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
        const date = dateStr ? new Date(dateStr) : null;

        if (amount > 0 && !isNaN(amount)) {
          txns.push({ amount, date, order, product, raw: row.join(', ') });
          console.log('Added transaction:', { amount, date, order, product });
        }
      }
    } else if (rawText.includes('Order placed') && rawText.includes('Total')) {
      // Parse new Amazon order format
      const orderBlocks = rawText.split(/(?=Order placed)/).filter(block => block.trim());
      
      for (const block of orderBlocks) {
        const blockLines = block.split('\n').filter(l => l.trim());
        
        // Extract order number
        const orderMatch = block.match(/Order #\s*([\d-]+)/);
        const order = orderMatch ? orderMatch[1] : null;
        
        // Extract date
        const dateMatch = block.match(/Order placed\s+(\d{1,2}\s+\w+\s+\d{4})/);
        let date = null;
        if (dateMatch) {
          date = new Date(dateMatch[1]);
        }
        
        // Extract total amount
        const totalMatch = block.match(/Total\s*₹([\d,]+\.\d{2})/);
        let amount = 0;
        if (totalMatch) {
          amount = parseFloat(totalMatch[1].replace(/,/g, ''));
        }
        
        // Extract product name - improved approach
        let product = 'Unknown Product';
        const lines = block.split('\n');
        
        // Look for product name - skip system lines and find actual product content
        for (const line of lines) {
          const trimmed = line.trim();
          
          // Skip obvious non-product lines
          if (trimmed.length < 3 || 
              trimmed.includes('Order placed') ||
              trimmed.includes('Total') ||
              trimmed.includes('Ship to') ||
              trimmed.includes('Order #') ||
              trimmed.includes('View order') ||
              trimmed.includes('Invoice') ||
              trimmed.includes('Delivered') ||
              trimmed.includes('Package was') ||
              trimmed.includes('Cancelled') ||
              trimmed.includes('Service cancelled') ||
              trimmed.includes('Replace item') ||
              trimmed.includes('View your item') ||
              trimmed.includes('Track package') ||
              trimmed.includes('Leave') ||
              trimmed.includes('Write a') ||
              trimmed.includes('Buy it again') ||
              trimmed.includes('Return window') ||
              trimmed.includes('Ask Product') ||
              trimmed.includes('Get product') ||
              trimmed.includes('Share gift') ||
              trimmed.includes('If you') ||
              trimmed.includes('Service For') ||
              trimmed.includes('refund will be') ||
              trimmed.includes('business days') ||
              trimmed.includes('Vacuum cleaner Virtual') ||
              trimmed.match(/^\d{1,2}\s+\w+\s+\d{4}$/) ||
              trimmed.includes('₹') ||
              trimmed.includes('Eligible till') ||
              trimmed.includes('NAGA') ||
              trimmed.includes('NIMMAGADDA') ||
              trimmed.includes('DRONADULA') ||
              trimmed.includes('PULLA RAO') ||
              trimmed.toLowerCase().includes('not available')) {
            continue;
          }
          
          // If we get here, this might be a product name
          product = trimmed;
          break;
        }
        
        // If still no product found, try to extract from the raw block more aggressively
        if (product === 'Unknown Product') {
          // Look for any meaningful text that's not a system message
          const productCandidates = lines.filter(line => {
            const trimmed = line.trim();
            return trimmed.length > 5 && 
                   !trimmed.match(/^(Order|Total|Ship|View|Track|Buy|Return|Ask|Get|Share|If|Service|Package|Delivered|Cancelled|Invoice|Leave|Write|Eligible|NAGA|NIMMAGADDA|DRONADULA|PULLA)/i) &&
                   !trimmed.match(/^\d{1,2}\s+\w+\s+\d{4}$/) &&
                   !trimmed.includes('₹') &&
                   !trimmed.toLowerCase().includes('not available');
          });
          
          if (productCandidates.length > 0) {
            product = productCandidates[0].trim();
          }
        }
        
        // Skip cancelled or refunded orders (no actual spending)
        if (block.includes('Cancelled') || block.includes('Refunded')) {
          continue;
        }
        
        if (order && amount > 0 && date) {
          txns.push({ amount, date, order, product, raw: block });
        }
      }
    } else {
      // Parse plain text format (US Amazon format)
      const amountRegex = /-?\$\d+(\.\d{2})?/g;
      const dateRegex = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi;
      const orderRegex = /Order\s+#([\d-]+)/i;

      for (const line of lines) {
        const amounts = line.match(amountRegex);
        const dates = line.match(dateRegex);
        const orders = line.match(orderRegex);

        if (amounts && amounts.length > 0) {
          const amount = Math.abs(parseFloat(amounts[0].replace('$', '')));
          const date = dates ? new Date(dates[0]) : null;
          const order = orders ? orders[1] : null;

          if (amount > 0) {
            txns.push({ amount, date, order, product: 'Unknown Product', raw: line });
          }
        }
      }
    }

    return txns;
  }

  function calculate(rawText) {
    setError('');
    setTransactions([]);

    if (!rawText.trim()) return;

    const txns = parseTransactions(rawText);
    if (txns.length === 0) return;

    // Detect duplicates
    const orderIds = txns.map(t => t.order).filter(Boolean);
    const duplicates = orderIds.filter((id, idx) => orderIds.indexOf(id) !== idx);
    if (duplicates.length > 0) {
      setError(`Warning: ${duplicates.length} duplicate order(s) detected: ${[...new Set(duplicates)].join(', ')}`);
    }

    setTransactions(txns);
    showToast(`${txns.length} transactions loaded successfully!`, 'success');
  }

  function showToast(message, type = 'success') {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  }

  function triggerConfetti() {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }

  function loadSampleData() {
    const sample = `Order placed
18 October 2025
Total
₹658.06
Order # 406-6528028-5234742
Zitmoist - Tube of 50 gm Gel
Delivered 21 October

Order placed
21 September 2025
Total
₹381.00
Order # 403-0897680-7210727
Glambak OC Foaming Face Wash 100ml
Returning to seller

Order placed
21 September 2025
Total
₹424.50
Order # 403-1911236-4277923
Zitmoist - Tube of 50 gm Gel
Refunded`;
    setText(sample);
    calculate(sample);
    showToast('Sample data loaded!', 'info');
  }

  function clearData() {
    setText('');
    setTransactions([]);
    setError('');
    localStorage.removeItem('amazonTransactions');
    localStorage.removeItem('amazonText');
    showToast('All data cleared!', 'info');
  }

  function exportCSV() {
    const headers = ['Order ID', 'Product Name', 'Amount (INR)', 'Amount (USD)', 'Date'];
    const rows = filteredTransactions.map(t => [
      t.order || 'N/A',
      t.product || 'Unknown Product',
      t.amount.toFixed(2),
      (t.amount * currencyRate).toFixed(2),
      t.date ? t.date.toLocaleDateString() : 'N/A'
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amazon-spend-report.csv';
    a.click();
    showToast('CSV file downloaded!', 'success');
  }

  function generatePDF() {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
      showToast('PDF ready to print!', 'success');
    }, 100);
  }

  function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'success');
  }

  function handleFile(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target.result;
        console.log('File content preview:', content.substring(0, 500));
        
        const txns = parseTransactions(content);
        console.log('Parsed transactions:', txns);
        
        if (txns.length > 0) {
          // For CSV files, just add the transactions directly
          setTransactions(prev => [...prev, ...txns]);
          
          // Also update the text area with a formatted version for display
          const formatted = txns.map(t => {
            const dateStr = t.date ? t.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
            return `Order placed ${dateStr}\nTotal\n₹${t.amount.toFixed(2)}\nOrder # ${t.order || 'N/A'}\n${t.product || 'Unknown Product'}`;
          }).join('\n\n');
          
          setText(prev => prev ? prev + '\n\n' + formatted : formatted);
          showToast(`${file.name} uploaded! ${txns.length} transactions found.`, 'success');
        } else {
          showToast(`No valid transactions found in ${file.name}. Check console for details.`, 'error');
        }
      };
      reader.readAsText(file);
    });
    
    e.target.value = ''; // Reset input to allow same file upload
  }

  // Drag and drop handlers
  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target.result;
        const txns = parseTransactions(content);
        
        const formatted = txns.map(t => {
          const dateStr = t.date ? t.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
          return `Order placed ${dateStr} Total ₹${t.amount.toFixed(2)} Order # ${t.order || 'N/A'} ${t.product || 'Unknown Product'}`.trim();
        }).join('\n');
        
        setText(prev => prev ? prev + '\n' + formatted : formatted);
        setTransactions(prev => [...prev, ...txns]);
        showToast(`File dropped! ${txns.length} transactions added.`, 'success');
      };
      reader.readAsText(file);
    }
  }

  // Filter and sort transactions
  const filteredTransactions = transactions.filter(t => {
    if (searchTerm && t.order && !t.order.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (minAmount && t.amount < parseFloat(minAmount)) return false;
    if (maxAmount && t.amount > parseFloat(maxAmount)) return false;
    if (startDate && t.date && t.date < new Date(startDate)) return false;
    if (endDate && t.date && t.date > new Date(endDate)) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') return (b.date || 0) - (a.date || 0);
    if (sortBy === 'date-asc') return (a.date || 0) - (b.date || 0);
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  const total = filteredTransactions.reduce((sum, t) => sum + (t.amount * currencyRate), 0);

  const monthlyData = {};
  const yearlyData = {};
  const monthlyProducts = {};
  const yearlyProducts = {};

  filteredTransactions.forEach(t => {
    if (t.date && t.date instanceof Date && !isNaN(t.date)) {
      const month = t.date.toLocaleString('default', { month: 'short', year: 'numeric' });
      const year = t.date.getFullYear().toString();

      monthlyData[month] = (monthlyData[month] || 0) + (t.amount * currencyRate);
      yearlyData[year] = (yearlyData[year] || 0) + (t.amount * currencyRate);
      
      if (!monthlyProducts[month]) monthlyProducts[month] = [];
      monthlyProducts[month].push(t);
      
      if (!yearlyProducts[year]) yearlyProducts[year] = [];
      yearlyProducts[year].push(t);
    }
  });

  // Analytics
  const avgMonthly = Object.values(monthlyData).length > 0 
    ? Object.values(monthlyData).reduce((a, b) => a + b, 0) / Object.values(monthlyData).length 
    : 0;
  const avgYearly = Object.values(yearlyData).length > 0
    ? Object.values(yearlyData).reduce((a, b) => a + b, 0) / Object.values(yearlyData).length
    : 0;
  const topMonth = Object.entries(monthlyData).sort((a, b) => b[1] - a[1])[0];
  const worstMonth = Object.entries(monthlyData).sort((a, b) => a[1] - b[1])[0];
  const monthlyValues = Object.values(monthlyData);
  const trend = monthlyValues.length > 1
    ? monthlyValues[monthlyValues.length - 1] > monthlyValues[0] ? 'Increasing' : 'Decreasing'
    : 'N/A';
  
  // Quick Stats
  const amounts = filteredTransactions.map(t => t.amount * currencyRate);
  const minTransaction = amounts.length > 0 ? Math.min(...amounts) : 0;
  const maxTransaction = amounts.length > 0 ? Math.max(...amounts) : 0;
  const medianTransaction = amounts.length > 0 ? amounts.sort((a, b) => a - b)[Math.floor(amounts.length / 2)] : 0;
  
  // Recent transactions
  const recentTransactions = [...filteredTransactions].sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 5);
  
  // Comparison Stats
  const monthKeys = Object.keys(monthlyData).sort();
  const currentMonth = monthKeys[monthKeys.length - 1];
  const lastMonth = monthKeys[monthKeys.length - 2];
  const monthOverMonth = lastMonth ? ((monthlyData[currentMonth] - monthlyData[lastMonth]) / monthlyData[lastMonth] * 100) : 0;
  
  const yearKeys = Object.keys(yearlyData).sort();
  const currentYear = yearKeys[yearKeys.length - 1];
  const lastYear = yearKeys[yearKeys.length - 2];
  const yearOverYear = lastYear ? ((yearlyData[currentYear] - yearlyData[lastYear]) / yearlyData[lastYear] * 100) : 0;
  
  // Spending prediction
  const predictedNextMonth = monthlyValues.length > 2 
    ? monthlyValues.slice(-3).reduce((a, b) => a + b, 0) / 3 
    : avgMonthly;
  
  // Spending alert
  const isHighSpending = currentMonth && monthlyData[currentMonth] > avgMonthly * 1.5;
  
  // Budget tracking
  const budgetRemaining = monthlyBudget ? parseFloat(monthlyBudget) - (monthlyData[currentMonth] || 0) : 0;
  const budgetProgress = monthlyBudget ? ((monthlyData[currentMonth] || 0) / parseFloat(monthlyBudget) * 100) : 0;
  
  // Badges
  const badges = [];
  if (total > 1000) badges.push('Big Spender');
  if (worstMonth && monthlyData[worstMonth[0]] < avgMonthly * 0.7) badges.push('Saver of the Month');
  if (filteredTransactions.length > 50) badges.push('Shopping Expert');
  if (trend === 'Decreasing') badges.push('Spending Down');

  const monthlyChartData = {
    labels: Object.keys(monthlyData),
    datasets: [{
      label: 'Monthly Spend ($)',
      data: Object.values(monthlyData),
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
    }],
  };

  const yearlyChartData = {
    labels: Object.keys(yearlyData),
    datasets: [{
      label: 'Yearly Spend ($)',
      data: Object.values(yearlyData),
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
    }],
  };
  
  const pieChartData = {
    labels: Object.keys(monthlyData),
    datasets: [{
      data: Object.values(monthlyData),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(34, 211, 238, 0.8)',
        'rgba(163, 230, 53, 0.8)',
        'rgba(244, 114, 182, 0.8)',
        'rgba(251, 191, 36, 0.8)',
      ],
    }],
  };
  
  const lineChartData = {
    labels: Object.keys(monthlyData),
    datasets: [{
      label: 'Spending Trend',
      data: Object.values(monthlyData),
      borderColor: 'rgba(99, 102, 241, 1)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      fill: true,
    }],
  };
  
  const donutChartData = {
    labels: Object.keys(yearlyData),
    datasets: [{
      data: Object.values(yearlyData),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
    }],
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} px-4 py-10 ${showPrintView ? 'print-view' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .print-view { background: white !important; color: black !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti { position: fixed; width: 10px; height: 10px; animation: confetti 3s ease-out forwards; }
      `}</style>
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg fade-in ${
          toast.type === 'success' ? 'bg-green-600' : 
          toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } text-white font-semibold`}>
          {toast.message}
        </div>
      )}
      
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                backgroundColor: ['#6366f1', '#22c55e', '#eab308', '#ef4444', '#a855f7'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Drag & Drop Overlay */}
      {dragActive && (
        <div className="fixed inset-0 z-50 bg-indigo-600/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-indigo-600 text-white px-8 py-6 rounded-2xl text-2xl font-bold flex items-center gap-3">
            <FcFolder className="text-3xl" /> Drop your file here!
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-between items-center mb-4 no-print">
            <button onClick={() => setDarkMode(!darkMode)} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} flex items-center gap-2`}>
              {darkMode ? <>☀️ Light</> : <><FcNightPortrait /> Dark</>}
            </button>
            <div className="flex gap-2">
              <button onClick={loadSampleData} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm flex items-center gap-2">
                <FcDocument /> Sample Data
              </button>
              <button onClick={clearData} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm flex items-center gap-2" onClick={() => { clearData(); triggerConfetti(); }}>
                <FcEmptyTrash /> Clear All
              </button>
              {filteredTransactions.length > 0 && (
                <>
                  <button onClick={exportCSV} className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm flex items-center gap-2">
                    <FcDownload /> CSV
                  </button>
                  <button onClick={generatePDF} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm flex items-center gap-2">
                    <FcPrint /> PDF
                  </button>
                </>
              )}
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white">Amazon Spend Tracker</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center justify-center gap-2`}>
            <FcLock /> 100% Private • No Login • No API • All Processing Happens in Your Browser
          </p>
          {badges.length > 0 && (
            <div className="flex gap-2 justify-center mt-2">
              {badges.map((badge, i) => (
                <span key={i} className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm">{badge}</span>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 no-print">
          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 space-y-4`}>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FcDocument /> Paste Transactions
            </h2>
            <textarea
              className={`w-full min-h-[180px] p-4 rounded-xl ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-300'} border focus:ring-2 focus:ring-coral-500 outline-none text-sm font-mono`}
              placeholder="Paste Amazon order data...\n\nExample:\nOrder placed\n18 October 2025\nTotal\n₹658.06\nOrder # 406-6528028-5234742\nZitmoist - Tube of 50 gm Gel"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={() => calculate(text)}
              className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 transition font-semibold text-white"
            >
              Calculate Spend ({transactions.length > 0 ? `${transactions.length} found` : 'Paste data'})
            </button>
          </div>

          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 space-y-4`}>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FcUpload /> Upload File(s)
            </h2>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFile}
              multiple
              className={`block w-full text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-400`}
            />
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-2`}>
              <p>✓ Upload Amazon's Retail.orderHistory.csv or TXT file</p>
              <p>✓ Multiple files supported (drag & drop works too)</p>
              <p>✓ Your data never leaves your browser</p>
              <p>✓ Auto-saved to browser storage</p>
              <p className="text-xs text-yellow-400">💡 Check browser console (F12) for parsing details</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div>
                <label className="text-sm font-medium">Currency (₹ to $):</label>
                <input
                  type="number"
                  step="0.001"
                  value={currencyRate}
                  onChange={(e) => setCurrencyRate(parseFloat(e.target.value))}
                  className={`w-full mt-1 p-2 rounded-lg ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-300'} border text-sm`}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Monthly Budget ($):</label>
                <input
                  type="number"
                  placeholder="Optional"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className={`w-full mt-1 p-2 rounded-lg ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-300'} border text-sm`}
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className={`p-4 ${darkMode ? 'bg-red-900/40 border-red-700 text-red-300' : 'bg-red-100 border-red-400 text-red-700'} border rounded-xl flex items-center gap-2`}>
            <FcHighPriority /> {error}
          </div>
        )}

        {transactions.length > 0 && (
          <>
            <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'} border rounded-2xl p-8 text-center fade-in`}>
              <p className="text-green-600 text-sm mb-2 font-medium">Total Amazon Spend</p>
              <div className="flex items-center justify-center gap-4">
                <h2 className="text-6xl font-bold text-green-500">${total.toFixed(2)}</h2>
                <button 
                  onClick={() => copyToClipboard(`$${total.toFixed(2)}`, 'Total amount')}
                  className="p-2 rounded-lg bg-green-600 hover:bg-green-500 transition text-sm text-white"
                  title="Copy total amount"
                >
                  Copy
                </button>
              </div>
              <p className="text-green-600 mt-2 font-medium">{filteredTransactions.length} transactions found</p>
            </div>

            {/* All Products List */}
            <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
              <h3 className="text-2xl font-bold mb-6 text-blue-400">All Products & Spending</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredTransactions.map((t, i) => (
                  <div key={i} className={`p-4 ${darkMode ? 'bg-gray-950 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl hover:shadow-lg transition-all`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-blue-400 mb-2">{t.product || 'Unknown Product'}</h4>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">📦 Order #{t.order || 'N/A'}</p>
                          <p className="text-sm text-gray-400">📅 {t.date ? t.date.toLocaleDateString() : 'No date'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-500">₹{t.amount.toFixed(2)}</p>
                        <p className="text-lg font-semibold text-green-400">${(t.amount * currencyRate).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid md:grid-cols-4 gap-4 fade-in">
              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-4 text-center`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Monthly</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-2xl font-bold text-blue-400">${avgMonthly.toFixed(2)}</p>
                  <button onClick={() => copyToClipboard(`$${avgMonthly.toFixed(2)}`, 'Average monthly')} className="text-xs p-1 rounded hover:bg-gray-700" title="Copy">
                    Copy
                  </button>
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-4 text-center`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Yearly</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-2xl font-bold text-purple-400">${avgYearly.toFixed(2)}</p>
                  <button onClick={() => copyToClipboard(`$${avgYearly.toFixed(2)}`, 'Average yearly')} className="text-xs p-1 rounded hover:bg-gray-700" title="Copy">
                    Copy
                  </button>
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-4 text-center`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Spending Trend</p>
                <p className={`text-2xl font-bold ${trend === 'Increasing' ? 'text-red-400' : 'text-green-400'}`}>{trend}</p>
              </div>
              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-4 text-center`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Top Month</p>
                <p className="text-lg font-bold text-yellow-400">{topMonth ? topMonth[0] : 'N/A'}</p>
                <p className="text-sm text-gray-500">{topMonth ? `$${topMonth[1].toFixed(2)}` : ''}</p>
              </div>
            </div>
            
            {/* Quick Stats & Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FcStatistics /> Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Min Transaction:</span>
                    <span className="font-bold text-green-400">${minTransaction.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Max Transaction:</span>
                    <span className="font-bold text-red-400">${maxTransaction.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Median Transaction:</span>
                    <span className="font-bold text-blue-400">${medianTransaction.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Predicted Next Month:</span>
                    <span className="font-bold text-purple-400">${predictedNextMonth.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FcStatistics /> Comparisons
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Month-over-Month:</span>
                    <span className={`font-bold ${monthOverMonth >= 0 ? 'text-red-400' : 'text-green-400'} flex items-center gap-1`}>
                      {monthOverMonth >= 0 ? '↑' : '↓'} {Math.abs(monthOverMonth).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Year-over-Year:</span>
                    <span className={`font-bold ${yearOverYear >= 0 ? 'text-red-400' : 'text-green-400'} flex items-center gap-1`}>
                      {yearOverYear >= 0 ? '↑' : '↓'} {Math.abs(yearOverYear).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Best Month:</span>
                    <span className="font-bold text-green-400">{worstMonth ? worstMonth[0] : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Worst Month:</span>
                    <span className="font-bold text-yellow-400">{topMonth ? topMonth[0] : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Alerts & Budget */}
            {(isHighSpending || monthlyBudget) && (
              <div className="grid md:grid-cols-2 gap-6">
                {isHighSpending && (
                  <div className="bg-red-900/40 border border-red-700 rounded-xl p-4">
                    <p className="text-red-300 font-semibold flex items-center gap-2">
                      <FcHighPriority /> High Spending Alert!
                    </p>
                    <p className="text-sm text-red-400 mt-1">Current month spending is 50% above average</p>
                  </div>
                )}
                {monthlyBudget && (
                  <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-4`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Budget Progress</p>
                    <div className="flex justify-between mb-2">
                      <span className="font-bold">${(monthlyData[currentMonth] || 0).toFixed(2)} / ${parseFloat(monthlyBudget).toFixed(2)}</span>
                      <span className={`font-bold ${budgetProgress > 100 ? 'text-red-400' : 'text-green-400'}`}>{budgetProgress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className={`h-2 rounded-full ${budgetProgress > 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${Math.min(budgetProgress, 100)}%`}}></div>
                    </div>
                    <p className={`text-sm mt-2 ${budgetRemaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {budgetRemaining >= 0 ? `$${budgetRemaining.toFixed(2)} remaining` : `$${Math.abs(budgetRemaining).toFixed(2)} over budget`}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Recent Transactions */}
            <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FcClock /> Recent Transactions
              </h3>
              <div className="space-y-2">
                {recentTransactions.map((t, i) => (
                  <div key={i} className={`flex justify-between p-3 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} rounded-lg`}>
                    <div>
                      <p className="font-medium">{t.product}</p>
                      <p className="text-sm text-gray-400">Order #{t.order}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t.date ? t.date.toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <span className="font-bold text-green-400">₹{t.amount.toFixed(2)} (${(t.amount * currencyRate).toFixed(2)})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`flex gap-2 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <button
                onClick={() => setView('overview')}
                className={`px-6 py-3 font-semibold transition ${view === 'overview' ? `border-b-2 border-indigo-500 text-indigo-400` : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}`}
              >
                Overview
              </button>
              <button
                onClick={() => setView('monthly')}
                className={`px-6 py-3 font-semibold transition ${view === 'monthly' ? `border-b-2 border-indigo-500 text-indigo-400` : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setView('yearly')}
                className={`px-6 py-3 font-semibold transition ${view === 'yearly' ? `border-b-2 border-indigo-500 text-indigo-400` : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}`}
              >
                Yearly
              </button>
            </div>

            {view === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FcBarChart /> Monthly Bar Chart
                  </h3>
                  {Object.keys(monthlyData).length > 0 ? (
                    <Bar data={monthlyChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                  ) : (
                    <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No date information available</p>
                  )}
                </div>
                <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FcPieChart /> Monthly Pie Chart
                  </h3>
                  {Object.keys(monthlyData).length > 0 ? (
                    <Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                  ) : (
                    <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No date information available</p>
                  )}
                </div>
              </div>
            )}

            {view === 'monthly' && (
              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                <h3 className="text-xl font-semibold mb-4">Monthly Spending</h3>
                {Object.keys(monthlyData).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(monthlyData).map(([month, amount]) => {
                      const maxAmount = Math.max(...Object.values(monthlyData));
                      const percentage = (amount / maxAmount) * 100;
                      return (
                        <div key={month} className={`p-4 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} rounded-xl`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{month}</span>
                            <div className="text-right">
                              <span className="text-green-400 font-bold">${amount.toFixed(2)}</span>
                              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} ml-2`}>({monthlyProducts[month]?.length} orders)</span>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{width: `${percentage}%`}}></div>
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                            {monthlyProducts[month]?.map((t, i) => (
                              <div key={i} className="flex justify-between">
                                <span>• {t.product}</span>
                                <span>₹{t.amount.toFixed(2)} (${(t.amount * currencyRate).toFixed(2)})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No date information found in transactions</p>
                )}
              </div>
            )}

            {view === 'yearly' && (
              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                <h3 className="text-xl font-semibold mb-4">Yearly Spending</h3>
                {Object.keys(yearlyData).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(yearlyData).map(([year, amount]) => {
                      const maxAmount = Math.max(...Object.values(yearlyData));
                      const percentage = (amount / maxAmount) * 100;
                      return (
                        <div key={year} className={`p-4 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} rounded-xl`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{year}</span>
                            <div className="text-right">
                              <span className="text-green-400 font-bold">${amount.toFixed(2)}</span>
                              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} ml-2`}>({yearlyProducts[year]?.length} orders)</span>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{width: `${percentage}%`}}></div>
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1 max-h-60 overflow-y-auto`}>
                            {yearlyProducts[year]?.map((t, i) => (
                              <div key={i} className="flex justify-between">
                                <span>• {t.product}</span>
                                <span>₹{t.amount.toFixed(2)} (${(t.amount * currencyRate).toFixed(2)})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No date information found in transactions</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
