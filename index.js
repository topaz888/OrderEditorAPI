import { cancelOrder, viewOrder } from './orderEditor.js';
import { authenticateToken, createToken } from './authorization.js'
import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';

dotenv.config({ path: './.env' })

const app = express();
const PORT = process.env.PORT;
const IP = process.env.IP

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/data', async (req, res) => {
    res.status(500).json({ error: 'Internal server error' });
});

app.post('/cancelOrder', authenticateToken,async (req, res) => {
        const orderId = req.body.key;
        console.log(req.body.key)
        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
          }
        try{
            const order = await viewOrder(orderId)
            if (order.customer.id !== req.user.customerId) {
                return res.status(403).json({ error: 'Customer ID does not match order' });
            }
            await cancelOrder(orderId)
            res.status(200).json({ message: `Order ${orderId} cancelled` });
        } catch (error) {
            if (error.code === 'ETIMEDOUT') {
                res.status(500).json({ error: 'Request timed out' });
            } else {
                console.error('Error cancelling order:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
});

app.post('/updateOrder', authenticateToken,async (req, res) => {
    const orderId = req.body.key;
    const lineItemId = req.body.itemId;
    console.log(req.body.key)
    if (!orderId || !lineItemId) {
        return res.status(400).json({ error: 'Order ID is required' });
      }
    try{
        const order = await viewOrder(orderId)
        if (order.customer.id !== req.user.customerId) {
            return res.status(403).json({ error: 'Customer ID does not match order' });
        }
        await removeItemFromOrder(orderId, lineItemId)
        res.status(200).json({ message: `Order ${orderId} cancelled` });
    } catch (error) {
        if (error.code === 'ETIMEDOUT') {
            res.status(500).json({ error: 'Request timed out' });
        } else {
            console.error('Error cancelling order:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.post('/viewOrder', async (req, res) => {
    const orderId = req.body.key;
    try{
        const response = await viewOrder(orderId)
        res.status(200).json({ message: `Order ${orderId} viewed \n ${response}` });
    } catch (error) {
        if (error.code === 'ETIMEDOUT') {
            res.status(500).json({ error: 'Request timed out' });
        } else {
            console.error('Error cancelling order:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.get('/', (req, res) => {
    res.send('Valencia theater seating');
});

app.post('/generateToken', async (req, res) => {
    const { customerId } = req.body;
    console.log( customerId )
  
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    try{
        const token = await createToken(customerId)
        res.status(200).json({ message: `${token}` });
    } catch (error) {
        if (error.code === 'ETIMEDOUT') {
            res.status(500).json({ error: 'Request timed out' });
        } else {
            console.error('Error cancelling order:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
  });


// Catch-all route for undefined routes
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, IP, () => {
    console.log(`Server is listening on port ${PORT}`);
});

