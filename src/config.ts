import * as dotenv from 'dotenv'
import { createPool, type Pool } from 'mysql2/promise'

dotenv.config({ path: '.env' })

export const pool: Pool = createPool({
  host: process.env.MYSQL_HOST ?? 'localhost',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_STAR_SCHEMA,
  waitForConnections: true,
  connectionLimit: 10
})
