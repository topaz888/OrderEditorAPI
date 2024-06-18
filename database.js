import pkg from 'pg';
const { Client } = pkg;


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
    const client = new Client({
      user: process.env.DATABASE_USER,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_DATABASE,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      ssl: {
        rejectUnauthorized: false,  // For development, you can set this to false; for production, use proper SSL certificate validation
      }
    });
  
    await client.connect();
    const data = serializeDataBaseData(_response)
    // await client.query('TRUNCATE googlesheet_database');
    // await client.query('CREATE TABLE googleSheet_database(id serial not null primary key, order_number varchar(255) NOT NULL, order_id varchar(255) NOT NULL, customer_name varchar(255) NOT NULL, customer_email varchar(255), customer_phone varchar(255), total_outstanding varchar(255), created_at varchar(255))');
    const insertQuery = 'INSERT INTO googleSheet_database (order_number, order_id, customer_name, customer_email, customer_phone, total_outstanding, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    for (let row of data.slice(1)) {  // Skip header row
      await client.query(insertQuery, row);
    }
    await client.end();
  }

  export { syncToDatabase }