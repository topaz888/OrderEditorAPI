// Load environment variables from a .env file.
require('dotenv').config();

// Import the Shopify API library.
const Shopify = require('shopify-api-node');

// Initialize a new Shopify instance with credentials from environment variables.
const shopify = new Shopify({
    shopName: process.env.SHOP_NAME, // The shop name.
    apiKey: process.env.API_KEY, // API key for authentication.
    password: process.env.ADMIN_TOKEN // API secret for authentication.
});

// Function to create a new product in the Shopify store.
async function createProduct(productData){
    try {
        const product = await shopify.product.create(productData); // Creating the product.
        return product; // Return the created product.
    } catch(error) {
        console.error(error); // Log any errors encountered.
    }
}

// Function to retrieve a list of locations from the Shopify store.
async function getLocations(){
    try {
        const locations = await shopify.location.list(); // Getting the list of locations.
        return locations; // Return the list of locations.
    } catch(error) {
        console.error(error); // Log any errors encountered.
    }
}

// Function to update the stock of a product in a specific location.
async function updateStock(location_id, inventory_item_id, available){
    try {
        const updatedProduct = await shopify.inventoryLevel.set({
            location_id, inventory_item_id, available // Setting new inventory levels.
        });
        return updatedProduct; // Return the updated product.
    } catch(error) {
        console.error('error:', error); // Log any errors encountered.
    }
}

// Function to get details of a specific product by its ID.
async function getProduct(productId){
    try {
        const product = await shopify.product.get(productId); // Fetching the product.
        return product; // Return the fetched product.
    } catch(error) {
        console.error(error); // Log any errors encountered.
    }
}

// Function to get all products from the Shopify store.
async function getAllProducts(){
    try {
        const products = await shopify.product.list(); // Fetching the list of all products.
        return products; // Return the list of products.
    } catch(error) {
        console.error(error); // Log any errors encountered.
    }
}

// Self-invoking async function to execute Shopify API calls.
(async()=>{
    // Example calls to the functions defined above.
    // Uncomment to use and replace placeholders with actual values.

    // Create a new product.
    const product = await createProduct({title:'video',body_html:'<h1>WOOOW</h1>',variants:[{price:'9.99'}]});
    console.log(product);

    // Get all locations.
    // const locations = await getLocations();
    // console.log(locations);

    // Get a specific product.
    // const product = await getProduct(product_id);
    // console.log(product);

    // Update stock for a product.
    // const location_id = 42738679852;
    // const product_id = 7274294902828;
    // const inventory_item_id = 44453061099564;
    // const productStock = await updateStock(location_id, inventory_item_id, 1000);
    // console.log(productStock);

    // Get all products.
    // const products = await getAllProducts();
    // console.log(products);
    
})()
