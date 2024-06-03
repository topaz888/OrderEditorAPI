import { sendAMockOrder, cancelOrder } from './orderEditor.js';
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

app.post('/cancelOrder', async (req, res) => {
        const orderId = req.body.key;
        try{
            const response = await cancelOrder(orderId)
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

