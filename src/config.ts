import * as fs from 'fs'
import * as path from 'path'

import * as dotenv from 'dotenv'
import { createPool, type Pool } from 'mysql2/promise'

dotenv.config({ path: '.env' })

const mysqlSsl = process.env.MYSQL_SSL?.trim().toLowerCase()
const sslExplicitlyEnabled = mysqlSsl === 'true' || mysqlSsl === '1'
const sslExplicitlyDisabled = mysqlSsl === 'false' || mysqlSsl === '0'
const useSsl =
  sslExplicitlyEnabled ||
  (!sslExplicitlyDisabled &&
    mysqlSsl === undefined &&
    Boolean(process.env.MYSQL_SSL_CA))

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
