// Load environment variables from a .env file.
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

// Import the Shopify API library.
import Shopify from 'shopify-api-node';

// Initialize a new Shopify instance with credentials from environment variables.
export const shopify = new Shopify({
    shopName: process.env.SHOP_NAME, // The shop name.
    apiKey: process.env.API_KEY, // API key for authentication.
    password: process.env.ADMIN_TOKEN, // API secret for authentication.
    timeout: process.env.TIMEOUT | 300, // Set timeout to 100ms
});