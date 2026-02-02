import { parseTransactions } from './src/utils/amazonParser.js';

// Header matching standard Amazon layout + User's Data Row
const csvWithHeader = `Website,Order ID,Order Date,Purchase Order Number,Currency,Unit Price,Unit Price Tax,Shipping Charge,Total Discounts,Total Owed,Shipment Item Subtotal,Shipment Item Subtotal Tax,ASIN,Product Condition,Quantity,Payment Instrument Type,Order Status,Shipment Status,Shipment Date,Shipping Option,Shipping Address,Billing Address,Carrier Name & Tracking Number,Product Name,Gift Message,Gift Sender Name,Gift Recipient Contact Details
"Amazon.in","407-3411816-7558768","2025-07-23T16:31:59Z","Not Applicable","INR","1,219.49","219.51","6.1","'-14.39'","1,430.71","1,981.35","356.65","B089QBD333","New","1","Not Available","Closed","Shipped","2025-07-24T05:24:15.525Z","std-in-10k","NAGA RAJENDRA DRONADULA H.No: 11-225, Adarsh Colony CHITKUL Village, Isnapur Hyderabad TELANGANA 502307 India","NAGA RAJENDRA DRONADULA H.No: 11-225, Adarsh Colony CHITKUL Village, Isnapur Hyderabad TELANGANA 502307 India","ATS(362244894532)","Arctic Fox Slope Anti-Theft Backpack (Marble Black) | 23 Ltr Capacity|Water Resistant | Multipurpose Backpack |Rain Cover| Trolley sleeve 15.6 Inches Unisex Laptop Bag with USB Charging Port","Not Available","Not Available","Not Available","Authenticity_2D=AZ:ZUIHTYX5P5G6RB3JOIBO4CSUXM"
`;

// User's Data Row ONLY (Simulating Paste without Header)
const csvRowOnly = `"Amazon.in","407-3411816-7558768","2025-07-23T16:31:59Z","Not Applicable","INR","1,219.49","219.51","6.1","'-14.39'","1,430.71","1,981.35","356.65","B089QBD333","New","1","Not Available","Closed","Shipped","2025-07-24T05:24:15.525Z","std-in-10k","NAGA RAJENDRA DRONADULA H.No: 11-225, Adarsh Colony CHITKUL Village, Isnapur Hyderabad TELANGANA 502307 India","NAGA RAJENDRA DRONADULA H.No: 11-225, Adarsh Colony CHITKUL Village, Isnapur Hyderabad TELANGANA 502307 India","ATS(362244894532)","Arctic Fox Slope Anti-Theft Backpack (Marble Black) | 23 Ltr Capacity|Water Resistant | Multipurpose Backpack |Rain Cover| Trolley sleeve 15.6 Inches Unisex Laptop Bag with USB Charging Port","Not Available","Not Available","Not Available","Authenticity_2D=AZ:ZUIHTYX5P5G6RB3JOIBO4CSUXM"`;

console.log("--- Test 1: CSV With Header ---");
const txns1 = parseTransactions(csvWithHeader);
if (txns1.length > 0) {
    console.log(`PASS: Found ${txns1.length} transactions.`);
    console.log(`Product: ${txns1[0].product}`);
} else {
    console.log("FAIL: No transactions found.");
}

console.log("\n--- Test 2: CSV Row Only (Paste) ---");
const txns2 = parseTransactions(csvRowOnly);
if (txns2.length > 0) {
    console.log(`PASS: Found ${txns2.length} transactions.`);
    console.log(`Product: ${txns2[0].product}`);
} else {
    console.log("FAIL: No transactions found.");
}
