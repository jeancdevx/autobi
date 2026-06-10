import * as fs from 'fs'
import * as path from 'path'

import Papa from 'papaparse'

import { pool } from '../config'

// Mapas de normalización
const MAKE_MAP: Record<string, string> = {
  acura: 'Acura',
  audi: 'Audi',
  bmw: 'BMW',
  buick: 'Buick',
  cadillac: 'Cadillac',
  'chev truck': 'Chevrolet',
  chevrolet: 'Chevrolet',
  chrysler: 'Chrysler',
  dodge: 'Dodge',
  'dodge tk': 'Dodge',
  ford: 'Ford',
  'ford tk': 'Ford',
  'ford truck': 'Ford',
  gmc: 'GMC',
  'gmc truck': 'GMC',
  honda: 'Honda',
  hyundai: 'Hyundai',
  'hyundai tk': 'Hyundai',
  jeep: 'Jeep',
  kia: 'Kia',
  'land rover': 'Land Rover',
  landrover: 'Land Rover',
  lexus: 'Lexus',
  lincoln: 'Lincoln',
  maserati: 'Maserati',
  mazda: 'Mazda',
  'mazda tk': 'Mazda',
  mercedes: 'Mercedes-Benz',
  'mercedes-b': 'Mercedes-Benz',
  mercury: 'Mercury',
  mitsubishi: 'Mitsubishi',
  nissan: 'Nissan',
  oldsmobile: 'Oldsmobile',
  plymouth: 'Plymouth',
  pontiac: 'Pontiac',
  porsche: 'Porsche',
  smart: 'Smart',
  subaru: 'Subaru',
  suzuki: 'Suzuki',
  toyota: 'Toyota',
  volkswagen: 'Volkswagen',
  vw: 'Volkswagen',
  volvo: 'Volvo'
}

const PAIS_ORIGEN: Record<string, string> = {
  Acura: 'Japón',
  Audi: 'Alemania',
  BMW: 'Alemania',
  Buick: 'EE.UU.',
  Cadillac: 'EE.UU.',
  Chevrolet: 'EE.UU.',
  Chrysler: 'EE.UU.',
  Dodge: 'EE.UU.',
  Ford: 'EE.UU.',
  GMC: 'EE.UU.',
  Honda: 'Japón',
  Hyundai: 'Corea del Sur',
  Infiniti: 'Japón',
  Jaguar: 'Reino Unido',
  Jeep: 'EE.UU.',
  Kia: 'Corea del Sur',
  'Land Rover': 'Reino Unido',
  Lexus: 'Japón',
  Lincoln: 'EE.UU.',
  Maserati: 'Italia',
  Mazda: 'Japón',
  'Mercedes-Benz': 'Alemania',
  Mercury: 'EE.UU.',
  Mitsubishi: 'Japón',
  Nissan: 'Japón',
  Oldsmobile: 'EE.UU.',
  Plymouth: 'EE.UU.',
  Pontiac: 'EE.UU.',
  Porsche: 'Alemania',
  Smart: 'Alemania',
  Subaru: 'Japón',
  Suzuki: 'Japón',
  Toyota: 'Japón',
  Volkswagen: 'Alemania',
  Volvo: 'Suecia',
  Default: 'EE.UU.'
}

const SEGMENTO: Record<string, string> = {
  Acura: 'Premium',
  Audi: 'Premium',
  BMW: 'Premium',
  Buick: 'Premium',
  Cadillac: 'Premium',
  Chevrolet: 'Masivo',
  Chrysler: 'Masivo',
  Dodge: 'Masivo',
  Ford: 'Masivo',
  GMC: 'Masivo',
  Honda: 'Masivo',
  Hyundai: 'Masivo',
  Infiniti: 'Premium',
  Jaguar: 'Lujo',
  Jeep: 'Masivo',
  Kia: 'Económico',
  'Land Rover': 'Premium',
  Lexus: 'Premium',
  Lincoln: 'Premium',
  Maserati: 'Lujo',
  Mazda: 'Masivo',
  'Mercedes-Benz': 'Premium',
  Mercury: 'Masivo',
  Mitsubishi: 'Masivo',
  Nissan: 'Masivo',
  Oldsmobile: 'Masivo',
  Plymouth: 'Masivo',
  Pontiac: 'Masivo',
  Porsche: 'Lujo',
  Smart: 'Económico',
  Subaru: 'Masivo',
  Suzuki: 'Económico',
  Toyota: 'Masivo',
  Volkswagen: 'Masivo',
  Volvo: 'Premium',
  Default: 'Masivo'
}

const DESC_CARROCERIA: Record<string, string> = {
  SUV: 'Vehículo utilitario deportivo, alto y espacioso',
  Sedán: 'Sedán de 4 puertas, uso familiar o ejecutivo',
  Coupé: 'Cupé de 2 puertas, diseño deportivo',
  Hatchback: 'Hatchback con maletero integrado al habitáculo',
  Wagon: 'Familiar/station wagon, maletero amplio',
  Convertible: 'Descapotable, techo retráctil',
  'Van/Minivan': 'Minivan o furgoneta familiar, alta capacidad',
  Pickup: 'Camioneta con plataforma de carga abierta',
  Otro: 'Otro tipo de carrocería'
}

const VALID_COLORS = new Set([
  'white',
  'gray',
  'black',
  'red',
  'silver',
  'blue',
  'brown',
  'beige',
  'purple',
  'burgundy',
  'gold',
  'green',
  'off-white',
  'orange',
  'charcoal',
  'yellow',
  'pink',
  'turquoise',
  'lime'
])
const VALID_INTERIORS = new Set([
  'beige',
  'black',
  'blue',
  'brown',
  'burgundy',
  'gold',
  'gray',
  'green',
  'off-white',
  'orange',
  'purple',
  'red',
  'silver',
  'tan',
  'white',
  'yellow'
])

export function normMake(raw: string): string {
  return MAKE_MAP[raw?.toLowerCase()?.trim()] ?? 'Otro'
}
export function normBody(raw: string): string {
  const b = raw?.toLowerCase() ?? ''
  if (b.includes('suv')) return 'SUV'
  if (b.includes('sedan')) return 'Sedán'
  if (b.includes('coupe') || b.includes('koup')) return 'Coupé'
  if (b.includes('hatchback')) return 'Hatchback'
  if (b.includes('wagon')) return 'Wagon'
  if (b.includes('convertible')) return 'Convertible'
  if (b.includes('van') || b.includes('minivan')) return 'Van/Minivan'
  if (
    b.includes('cab') ||
    b.includes('crew') ||
    b.includes('double') ||
    b.includes('quad')
  )
    return 'Pickup'
  return 'Otro'
}
export function normTrans(raw: string): string {
  const t = raw?.toLowerCase() ?? ''
  if (t === 'manual') return 'Manual'
  return 'Automática'
}
export function normColor(raw: string): string {
  return VALID_COLORS.has(raw?.toLowerCase()) ? capitalize(raw) : 'Otro'
}
export function normInterior(raw: string): string {
  return VALID_INTERIORS.has(raw?.toLowerCase()) ? capitalize(raw) : 'Otro'
}
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

// Exportado para que h_venta pueda resolver vehiculo_id
export const VEHICULO_ID_MAP: Map<string, number> = new Map()

type RawRow = {
  year: string
  make: string
  model: string
  trim: string
  body: string
  transmission: string
  color: string
  interior: string
}

export async function seedVehiculo(): Promise<void> {
  const conn = await pool.getConnection()
  try {
    console.log('🌱 Seeding d_vehiculo (esto puede tardar un momento)...')

    const csvPath = path.resolve(process.cwd(), 'car_prices.csv')
    if (!fs.existsSync(csvPath)) {
      throw new Error(`No se encontró car_prices.csv en: ${csvPath}`)
    }

    const content = fs.readFileSync(csvPath, 'utf-8')
    const parsed = Papa.parse<RawRow>(content, {
      header: true,
      skipEmptyLines: true
    })

    // Deduplicar combinaciones únicas
    const seen = new Map<string, number>()
    const rows: [
      number,
      string,
      string,
      string,
      string,
      string,
      number,
      string,
      string,
      string,
      string,
      string
    ][] = []
    let id = 1

    for (const row of parsed.data) {
      const make = normMake(row.make)
      const model = (row.model ?? '').trim()
      const trim_ = (row.trim ?? 'Base').trim() || 'Base'
      const body = normBody(row.body)
      const trans = normTrans(row.transmission)
      const color = normColor(row.color)
      const interior = normInterior(row.interior)
      const year = parseInt(row.year) || 2014

      if (!make || !model) continue

      const key = `${make}|${model}|${trim_}|${body}|${trans}|${color}|${interior}|${year}`
      if (seen.has(key)) {
        VEHICULO_ID_MAP.set(key, seen.get(key)!)
        continue
      }

      seen.set(key, id)
      VEHICULO_ID_MAP.set(key, id)

      rows.push([
        id++,
        make,
        PAIS_ORIGEN[make] ?? 'EE.UU.',
        SEGMENTO[make] ?? 'Masivo',
        model,
        trim_,
        year,
        body,
        DESC_CARROCERIA[body] ?? 'Sin descripción',
        trans,
        color,
        interior
      ])
    }

    // Insertar en lotes de 500 para no saturar MySQL
    const BATCH = 500
    for (let i = 0; i < rows.length; i += BATCH) {
      const chunk = rows.slice(i, i + BATCH)
      await conn.query(
        `INSERT INTO d_vehiculo
         (vehiculo_id, marca, pais_origen_marca, segmento_marca,
          modelo, version_trim, anio_fabricacion,
          tipo_carroceria, descripcion_carroceria,
          tipo_transmision, color_exterior, color_interior)
         VALUES ?`,
        [chunk]
      )
      process.stdout.write(
        `\r  → ${Math.min(i + BATCH, rows.length)} / ${rows.length}`
      )
    }

    console.log(`\n✅ d_vehiculo: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_vehiculo:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  seedVehiculo()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
