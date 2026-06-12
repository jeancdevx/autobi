import * as fs from 'fs'
import * as path from 'path'

import * as dotenv from 'dotenv'
import { createPool, type Pool } from 'mysql2/promise'

dotenv.config({ path: '.env' })

const useSsl =
  process.env.MYSQL_SSL?.toLowerCase() === 'true' ||
  process.env.MYSQL_SSL?.toLowerCase() === '1' ||
  Boolean(process.env.MYSQL_SSL_CA)

const ssl = useSsl
  ? {
      ca: fs.readFileSync(
        path.resolve(process.env.MYSQL_SSL_CA ?? 'ca.pem'),
        'utf8'
      )
    }
  : undefined

export const pool: Pool = createPool({
  host: process.env.MYSQL_HOST ?? 'localhost',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_STAR_SCHEMA,
  waitForConnections: true,
  connectionLimit: 10,
  ssl
})
