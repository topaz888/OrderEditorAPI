import { syncLookUpTable } from './lookup.js'
// Load environment variables from a .env file.
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

const table = await syncLookUpTable()
console.log(table[0])