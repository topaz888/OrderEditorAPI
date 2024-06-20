import mysql from 'mysql2/promise';
import fs  from 'fs';

// Function to sync data to PostgreSQL
async function getLookUpTable(order_number) {
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
                SELECT Status, ETA
                FROM eta_lookup
                WHERE sap_order = ?
                LIMIT 10
            `;
        const [rows, fields] = await client.executeQuery(query, [order_number]);
        return rows
    } catch (err) {
        console.error('Error connecting to the database', err);
    } finally {
        await client.end();
    }
  }

  export { getLookUpTable }