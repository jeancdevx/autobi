import * as dotenv from 'dotenv'
import { createConnection } from 'mysql2/promise'

dotenv.config({ path: '.env' })

const cleanDatabase = async (): Promise<void> => {
  const connection = await createConnection({
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  })

  try {
    const db = process.env.MYSQL_STAR_SCHEMA
    console.log(`🗑️  Eliminando base de datos '${db}'...`)
    await connection.query(`DROP DATABASE IF EXISTS \`${db}\``)
    await connection.query(`CREATE DATABASE \`${db}\``)
    console.log(`✅ Base de datos '${db}' recreada limpia`)
  } finally {
    await connection.end()
  }
}

cleanDatabase()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
