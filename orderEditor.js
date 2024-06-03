// Load environment variables from a .env file.
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

// Import the Shopify API library.
import Shopify from 'shopify-api-node';

// Initialize a new Shopify instance with credentials from environment variables.
const shopify = new Shopify({
    shopName: process.env.SHOP_NAME, // The shop name.
    apiKey: process.env.API_KEY, // API key for authentication.
    password: process.env.ADMIN_TOKEN, // API secret for authentication.
    timeout: process.env.TIMEOUT | 100, // Set timeout to 100ms
});

async function createDraftOrder(_draftOrder){
    try {
        const draftOrder = await shopify.draftOrder.create(_draftOrder); // Creating the product.
        return draftOrder; // Return the created product.
    } catch(error) {
        console.error(error); // Log any errors encountered.
    }
}

async function cancelOrder(_order){
    try{
        const order = await shopify.order.cancel(_order);
        return order;
    } catch(error) {
        console.error("cancelOrder: " + error)
        return error
    }
}


// Self-invoking async function to execute Shopify API calls.
async function sendAMockOrder(){
    // Create a new draftOrder.
    const draftOrder = await createDraftOrder({line_items:[{variant_id: 44388641079457,quantity:1}]});
    console.log(draftOrder);
}

async function cancelMockOrder(){
    // Create a new draftOrder.
    const order = await cancelOrder(6107465613473);
    console.log(order);
}


export { sendAMockOrder, cancelMockOrder, cancelOrder }