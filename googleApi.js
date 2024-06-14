import { google } from 'googleapis';
import { getOrderForGoogleSheet } from './graphql.js'

const auth = new google.auth.GoogleAuth({
    keyFile: `${ process.env.GOOGLE_APPLICATION_CREDENTIALS }`, // Replace with the path to your service account key file
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });
  
  const sheets = google.sheets({ version: 'v4', auth });
  
  const spreadsheetId = '1jxXALr1VSyp6FxDswU6vyFVX-DfKJU6u5MYviG7OVCM';

  const writeToGoogleSheet = async (_response) => {
    try {
        // console.log(_response)
        // const orderData = await getOrderForGoogleSheet(_orderid)
        const orderData = _response.orderEditCommit
        const authClient = await auth.getClient();
        google.options({ auth: authClient });
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
        // console.log("appendValue: "+ appendValue)
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:G', // Replace with the range you want to write to
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: appendValue,
            },
        });
        return response
      } catch (error) {
        return error;
      }
  }

  export { writeToGoogleSheet }