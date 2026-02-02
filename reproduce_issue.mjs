import { parseTransactions } from './src/utils/amazonParser.js';

const userText = `
Orders Buy Again Not Yet Shipped
4 orders placed in 
2025
2025
Order placed
18 October 2025
Total
₹658.06
Ship to
Laxman 
Order # 406-6528028-5234742
View order details  Invoice 
Delivered 21 October
Package was handed to a receptionist
Zitmoist - Tube of 50 gm Gel2
Zitmoist - Tube of 50 gm Gel
Return window closed on 1 November 2025
View your item
Ask Product Question
Order placed
18 October 2025
Order # 406-3591882-9905945
Cancelled
If you have been charged, a refund will be processed and will be available to you in the next 3–5 business days
Amazon Pay balance: Credits
Amazon Pay balance: Credits
Order placed
21 September 2025
Total
₹381.00
Ship to
Laxman 
Order # 403-0897680-7210727
View order details  Invoice 
Glambak OC Foaming Face Wash 100ml
Glambak OC Foaming Face Wash 100ml
Return window closed on 7 October 2025
Buy it again
 
View your item
Write a product review
Order placed
21 September 2025
Total
₹424.50
Ship to
Laxman 
Order # 403-1911236-4277923
View order details  Invoice 
Refunded
Your return is in transit. Your refund has been issued.
When will I get my refund? 
Zitmoist - Tube of 50 gm Gel
Zitmoist - Tube of 50 gm Gel
View your item
View Return/Refund Status
Ask Product Question
`;

console.log("Parsing User Text...");
const transactions = parseTransactions(userText);

if (transactions.length === 0) {
    console.error("FAIL: No transactions found.");
} else {
    console.log(`SUCCESS: Found ${transactions.length} transactions.`);
    
    transactions.forEach((t, i) => {
        console.log(`Msg ${i}: Order=${t.order}, Amount=${t.amount}, Currency='${t.currency}', Type=${t.type}`);
    });
}
