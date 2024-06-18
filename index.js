import { cancelOrder, viewOrder } from './orderEditor.js';
import { authenticateToken, createTokens, createAccessToken, verifyRefreshToken } from './authorization.js'
import { OrderLineItemsCancel } from './graphql.js'
import { writeToGoogleSheet } from './googleApi.js'
import { syncToDatabase } from './database.js'
import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import { google } from 'googleapis';

dotenv.config({ path: './.env' })

const app = express();
const PORT = process.env.PORT;
const IP = process.env.IP

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// app.post('/data', async (req, res) => {
//     res.status(500).json({ error: 'Internal server error' });
// });

// app.post('/cancelOrder', authenticateToken,async (req, res) => {
//         const orderId = req.body.key;
//         if (!orderId) {
//             return res.status(400).json({ error: 'Order ID is required' });
//           }
//         try{
//             const order = await viewOrder(orderId)
//             if (order.customer.id !== req.user.customerId) {
//                 return res.status(403).json({ error: 'Customer ID does not match order' });
//             }
//             await cancelOrder(orderId)
//             res.status(200).json({ message: `Order ${orderId} cancelled` });
//         } catch (error) {
//             if (error.code === 'ETIMEDOUT') {
//                 res.status(500).json({ error: 'Request timed out' });
//             } else {
//                 console.error('Error cancelling order:', error);
//                 res.status(500).json({ error: 'Internal server error' });
//             }
//         }
// });

app.post('/updateOrder', authenticateToken,async (req, res) => {
    const orderId = req.body.key;
    // console.log("orderId: " + orderId)
    const lineItemId = req.body.itemId;
    // console.log("lineItemId: "+lineItemId)
    if (!orderId || !lineItemId) {
        return res.status(400).json({ error: 'Order ID is required' });
    }

    try{
        // console.log(orderId)
        // console.log(lineItemId)
        const response = await OrderLineItemsCancel(orderId, lineItemId)
        // await writeToGoogleSheet(response)
        await syncToDatabase(response)
        res.status(200).json({ message: `Order ${orderId} cancelled` });
        
        // setTimeout(async () => {
        // }, 100);

    } catch (error) {
        if (error.code === 'ETIMEDOUT') {
            res.status(500).json({ error: 'Request timed out' });
        } else {
            console.error('Error cancelling order:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.post('/viewOrder', authenticateToken, async (req, res) => {
    const orderId = req.body.key;
    try{
        const order = await viewOrder(orderId)
        const response = order.line_items.map(item => ({
            id: item.id,
            fulfillable_quantity: item.fulfillable_quantity
        }))
        res.status(200).json({ line_items: response });
    } catch (error) {
        if (error.code === 'ETIMEDOUT') {
            res.status(500).json({ error: 'Request timed out' });
        } else {
            console.error('Error cancelling order:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});


// Route to refresh access token
app.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    const tokens = await verifyRefreshToken(refreshToken)
    res.status(200).json(tokens);
});

app.post('/generateToken', async (req, res) => {
    const { customerId } = req.body;
  
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    try{
        const token = await createTokens(customerId)
        res.status(200).json(token);
    } catch (error) {
        if (error.code === 'ETIMEDOUT') {
            res.status(500).json({ error: 'Request timed out' });
        } else {
            console.error('Error cancelling order:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
  });

//   const auth = new google.auth.GoogleAuth({
//     keyFile: 'shopify-refund-sheet-1334f9a7ad95.json', // Replace with the path to your service account key file
//     scopes: 'https://www.googleapis.com/auth/spreadsheets',
//   });
  
//   const sheets = google.sheets({ version: 'v4', auth });
  
//   const spreadsheetId = '1jxXALr1VSyp6FxDswU6vyFVX-DfKJU6u5MYviG7OVCM';
  
//   // Endpoint to get metadata from Google Sheets
//   app.get('/get-sheet-metadata', async (req, res) => {
//     try {
//       const authClient = await auth.getClient();
//       google.options({ auth: authClient });
  
//       const metaData = await sheets.spreadsheets.values.get({
//         spreadsheetId: spreadsheetId,
//         range: 'Sheet1!A1:D1'
//       });
  
//       res.status(200).send(metaData.data);
//     } catch (error) {
//       console.error('Error getting metadata from Google Sheets:', error);
//       res.status(500).send(error);
//     }
//   });


  app.get('/', (req, res) => {
    res.send('Valencia theater seating');
  });

// Catch-all route for undefined routes
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, IP, () => {
    console.log(`Server is listening on port ${PORT}`);
});