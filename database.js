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
            `${new Date(new Date().toLocaleString('en', {timeZone: 'America/New_York'}))}`
        ]
    ]
    return appendValue
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
        const insertQuery =  `INSERT INTO googleSheet_database (order_number, order_id, customer_name, customer_email, customer_phone, total_outstanding, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
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

  export { syncToDatabase }