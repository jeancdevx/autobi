import * as fs from 'fs'
import * as path from 'path'

import Papa from 'papaparse'

import { pool } from '../config'

const TIPOS = [
  'Franquicia Oficial',
  'Usados Certificados',
  'Subasta',
  'Arrendamiento',
  'Flotilla Corporativa'
]
const ESTADOS = [
  'CA',
  'TX',
  'FL',
  'NY',
  'PA',
  'IL',
  'OH',
  'GA',
  'NC',
  'MI',
  'NJ',
  'VA',
  'WA',
  'AZ',
  'MA',
  'TN',
  'IN',
  'MO',
  'MD',
  'WI'
]

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function randFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}
function cleanName(name: string): string {
  return name
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100)
}

// Exportado para que h_venta pueda mapear seller → concesionaria_id
export const SELLER_ID_MAP: Record<string, number> = {}

export async function seedConcesionaria(): Promise<void> {
  const conn = await pool.getConnection()
  try {
    console.log('🌱 Seeding d_concesionaria...')

    // Leer CSV y extraer top 150 sellers
    const csvPath = path.resolve(process.cwd(), 'car_prices.csv')
    if (!fs.existsSync(csvPath)) {
      throw new Error(
        `No se encontró car_prices.csv en: ${csvPath}\nColócalo en la raíz del proyecto.`
      )
    }

    const content = fs.readFileSync(csvPath, 'utf-8')
    const parsed = Papa.parse<{ seller: string }>(content, {
      header: true,
      skipEmptyLines: true
    })

    const counts: Record<string, number> = {}
    for (const row of parsed.data) {
      const s = row.seller?.trim()
      if (s) counts[s] = (counts[s] ?? 0) + 1
    }

    const topSellers = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 150)
      .map(([name]) => name)

    const rows: [number, string, string, string, number, number][] = []

    topSellers.forEach((seller, i) => {
      SELLER_ID_MAP[seller] = i + 1
      rows.push([
        i + 1,
        cleanName(seller),
        rand(TIPOS),
        rand(ESTADOS),
        randFloat(3.0, 5.0),
        randInt(1985, 2012)
      ])
    })

    await conn.query(
      `INSERT INTO d_concesionaria
       (concesionaria_id, nombre_concesionaria, tipo_concesionaria,
        estado, calificacion, anio_apertura)
       VALUES ?`,
      [rows]
    )

    console.log(`✅ d_concesionaria: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_concesionaria:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  seedConcesionaria()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
