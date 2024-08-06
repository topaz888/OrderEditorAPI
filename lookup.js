import mysql from 'mysql2/promise';
import fs  from 'fs';

// Function to sync data to PostgreSQL
async function syncLookUpTable() {
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
        const query =  `
                SELECT Shopify_Order, stock_status, ETA_Status
                FROM filter_so_data
                WHERE id = ?
                LIMIT 10
            `;
        const order_number = 1;
        const [rows, fields] = await client.execute(query, [order_number]);
        return [rows, fields]
    } catch (err) {
        console.error('Error connecting to the database', err);
    } finally {
        await client.end();
    }
  }

  export { syncLookUpTable }