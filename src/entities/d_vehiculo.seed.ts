import * as fs from 'fs'
import * as path from 'path'

import Papa from 'papaparse'

import { pool } from '../config'
import { CARROCERIA_ID_MAP } from './d_carroceria.seed'
import { COLOR_ID_MAP } from './d_color.seed'
import { MARCA_ID_MAP } from './d_marca.seed'
import { TRANSMISION_ID_MAP } from './d_transmision.seed'

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
  Otro: 'Desconocido',
  Plymouth: 'EE.UU.',
  Pontiac: 'EE.UU.',
  Porsche: 'Alemania',
  Smart: 'Alemania',
  Subaru: 'Japón',
  Suzuki: 'Japón',
  Toyota: 'Japón',
  Volkswagen: 'Alemania',
  Volvo: 'Suecia'
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
  Otro: 'Otro',
  Plymouth: 'Masivo',
  Pontiac: 'Masivo',
  Porsche: 'Lujo',
  Smart: 'Económico',
  Subaru: 'Masivo',
  Suzuki: 'Económico',
  Toyota: 'Masivo',
  Volkswagen: 'Masivo',
  Volvo: 'Premium'
}
const DESC_CARROCERIA: Record<string, string> = {
  SUV: 'Vehículo utilitario deportivo de tracción elevada',
  Sedán: 'Automóvil de 3 volúmenes y 4 puertas de uso general',
  Coupé: 'Vehículo de 2 puertas con diseño deportivo y techo fijo',
  Hatchback: 'Compacto con puerta trasera que incluye la luneta',
  Wagon: 'Familiar con carrocería extendida y maletero integrado',
  Convertible: 'Vehículo descapotable con techo retráctil',
  'Van/Minivan': 'Furgoneta familiar de alta capacidad de pasajeros',
  Pickup: 'Camioneta con cabina y plataforma de carga abierta',
  Otro: 'Carrocería especial no clasificada'
}

export const normMake = (raw: string): string => {
  return MAKE_MAP[raw?.toLowerCase()?.trim()] ?? 'Otro'
}
export const normBody = (raw: string): string => {
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
export const normTrans = (raw: string): string => {
  return raw?.toLowerCase() === 'manual' ? 'Manual' : 'Automática'
}
export const normColor = (raw: string): string => {
  const r = raw?.toLowerCase()
  if (!VALID_COLORS.has(r)) return 'Otro'
  return r.charAt(0).toUpperCase() + r.slice(1)
}
export const normInterior = (raw: string): string => {
  const r = raw?.toLowerCase()
  if (!VALID_INTERIORS.has(r)) return 'Otro'
  return r.charAt(0).toUpperCase() + r.slice(1)
}

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

export const seedVehiculo = async (): Promise<void> => {
  const conn = await pool.getConnection()

  try {
    console.log('🌱 Seeding d_vehiculo (puede tardar un momento)...')

    const csvPath = path.resolve(process.cwd(), 'car_prices.csv')
    if (!fs.existsSync(csvPath))
      throw new Error(`No se encontró car_prices.csv en: ${csvPath}`)

    const content = fs.readFileSync(csvPath, 'utf-8')
    const parsed = Papa.parse<RawRow>(content, {
      header: true,
      skipEmptyLines: true
    })

    const seen = new Map<string, number>()
    const rows: [
      number,
      string,
      number,
      string,
      string,
      string,
      string,
      number,
      string,
      number,
      string,
      string,
      number,
      string,
      number,
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

      const marcaId = MARCA_ID_MAP[make] ?? 27 // fallback = Otro
      const carroId = CARROCERIA_ID_MAP[body] ?? 4 // fallback = Otro
      const transId = TRANSMISION_ID_MAP[trans] ?? 1
      const colorId = COLOR_ID_MAP[color] ?? 13 // fallback = Otro

      rows.push([
        id++,
        make,
        marcaId,
        PAIS_ORIGEN[make] ?? 'EE.UU.',
        SEGMENTO[make] ?? 'Masivo',
        model,
        trim_,
        year,
        body,
        carroId,
        DESC_CARROCERIA[body] ?? 'Sin descripción',
        trans,
        transId,
        color,
        colorId,
        interior
      ])
    }

    const BATCH = 500
    for (let i = 0; i < rows.length; i += BATCH) {
      await conn.query(
        `INSERT INTO d_vehiculo
         (vehiculo_id,
          marca, marca_id, pais_origen_marca, segmento_marca,
          modelo, version_trim, anio_fabricacion,
          tipo_carroceria, carroceria_id, descripcion_carroceria,
          tipo_transmision, transmision_id,
          color_exterior, color_id, color_interior)
         VALUES ?`,
        [rows.slice(i, i + BATCH)]
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
