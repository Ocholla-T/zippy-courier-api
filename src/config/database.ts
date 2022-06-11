import { Pool } from 'pg'
import 'dotenv/config'

export const pool: Pool = new Pool({
  host: 'localhost',
  password: process.env.PASSWORD,
  user: 'postgres',
  database: 'zippy_courier',
  port: 5432,
})
