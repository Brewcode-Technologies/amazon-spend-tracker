import { parseTransactions } from './src/utils/amazonParser.js';

const csvData = `Order Date,Order ID,Title,Category,ASIN/ISBN,UNSPSC Code,Website,Release Date,Condition,Seller,Seller Credentials,List Price Per Unit,Purchase Price Per Unit,Quantity,Payment Instrument Type,Purchase Order Number,PO Line Number,Ordering Customer Email,Shipment Date,Shipping Address Name,Shipping Address Street 1,Shipping Address Street 2,Shipping Address City,Shipping Address State,Shipping Address Zip,Order Status,Carrier Name & Tracking Number,Item Subtotal,Item Subtotal Tax,Item Total,Tax Exemption Applied,Tax Exemption Type,Exemption Opt-Out,Buyer Name,Currency,Group Name,
2025-01-01,111-2222222-3333333,Test Item 1,Category,ASIN123,,"Amazon.in",,New,"Seller 1",,,,,Credit Card,,,,2025-01-02,Laxman,,,,,,Shipped,,1000.00,0.00,1000.00,,,,Laxman,INR,,
2025-01-05,444-5555555-6666666,Test Item 2,Category,ASIN456,,"Amazon.in",,New,"Seller 2",,,,,Credit Card,,,,2025-01-06,Laxman,,,,,,Shipped,,500.50,0.00,500.50,,,,Laxman,,,
`;

console.log("Parsing CSV Data...");
const transactions = parseTransactions(csvData);

if (transactions.length === 0) {
    console.error("FAIL: No transactions found.");
} else {
    console.log(`SUCCESS: Found ${transactions.length} transactions.`);
    
    transactions.forEach((t, i) => {
        console.log(`Msg ${i}: Order=${t.order}, Amount=${t.amount}, Currency='${t.currency}', Type=${t.type}`);
    });

    if (transactions[0].amount === 1000 && transactions[1].amount === 500.5) {
        console.log("CSV Verification: PASS");
    } else {
        console.log("CSV Verification: FAIL");
    }
}
