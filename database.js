import mysql from 'mysql2/promise';
import fs  from 'fs';

function serializeDataBaseData(_response) { 
    const orderData = _response.orderEditCommit
    const appendValue = [
        [
            `${orderData.order.name}`,
            `${orderData.order.id}`,
            `${orderData.order.customer.displayName}`,
            `${orderData.order.customer.email}`,
            `${orderData.order.customer.phone}`,
            `${orderData.order.totalOutstandingSet.presentmentMoney.amount}`,
            `${new Date().toLocaleString('en', { timeZone: 'America/New_York' })}`,
            `Pending`
        ]
    ]
    return appendValue
}

// Helper function to format date in 'YYYY-MM-DD HH:MM:SS' format
function formatDateForMySQL(date) {
    const d = new Date(date);
    const pad = (num) => (num < 10 ? '0' + num : num);

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// Function to sync data to PostgreSQL
async function syncToDatabase(_response) {
    const client = await mysql.createConnection({
      user: process.env.DATABASE_USER,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_DATABASE,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      ssl: {
        ca: fs.readFileSync(process.env.SSL_CA).toString(),
      }
    });
    try{
        await client.connect();
        const data = serializeDataBaseData(_response)
        const insertQuery =  `INSERT INTO google_refund_sheet (shopify_order_number, shopify_order_id, customer_name, customer_email, customer_phone, total_outstanding, created_at, refund_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        for (let row of data) {
            await client.query(insertQuery, row);
        }
    } catch (err) {
        console.error('Error connecting to the database', err);
    } finally {
        await client.end();
    }
  }

//get database filtered-so-data
// Function to sync data to PostgreSQL
async function syncToDatabase(_response) {
    const client = await mysql.createConnection({
      user: process.env.DATABASE_USER,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_DATABASE,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      ssl: {
        ca: fs.readFileSync(process.env.SSL_CA).toString(),
      }
    });
    try{
        await client.connect();
        const getOrderStatusQuery =  `SELECT Shopify_Order, ETA_status
        `;
        for (let row of data) {
            await client.query(getOrderStatusQuery, row);
        }
    } catch (err) {
        console.error('Error connecting to the database', err);
    } finally {
        await client.end();
    }
}

  export { syncToDatabase }