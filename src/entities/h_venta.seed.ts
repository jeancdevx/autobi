import * as fs from 'fs'
import * as path from 'path'

import Papa from 'papaparse'

import { pool } from '../config'
import { getCondicionId } from './d_condicion.seed'
import { getRangoPrecioId } from './d_rango_precio.seed'
import { UBICACION_ID_MAP } from './d_ubicacion.seed'
import {
  normBody,
  normColor,
  normInterior,
  normMake,
  normTrans,
  seedVehiculo,
  VEHICULO_ID_MAP
} from './d_vehiculo.seed'

const VALID_STATES = new Set([
  'al',
  'az',
  'ca',
  'co',
  'fl',
  'ga',
  'hi',
  'il',
  'in',
  'la',
  'ma',
  'md',
  'mi',
  'mn',
  'mo',
  'ms',
  'nc',
  'ne',
  'nj',
  'nm',
  'nv',
  'ny',
  'oh',
  'ok',
  'or',
  'pa',
  'pr',
  'sc',
  'tn',
  'tx',
  'ut',
  'va',
  'wa',
  'wi'
])
const ESTADO_IDS = [1, 1, 1, 2, 3, 4, 5] // Completada con mayor peso

const parseFecha = (raw: string): string => {
  try {
    const p = raw.trim().split(' ')
    if (p.length >= 4) {
      const d = new Date(`${p[2]} ${p[1]} ${p[3]}`)
      if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
    }
  } catch {
    /* fallback */
  }
  return '2014-06-15'
}

const fechaToTiempoId = (fecha: string): number => {
  const base = new Date('2014-01-01').getTime()
  const curr = new Date(fecha).getTime()
  return Math.max(1, Math.min(Math.floor((curr - base) / 86400000) + 1, 730))
}

const randInt = (a: number, b: number): number => {
  return Math.floor(Math.random() * (b - a + 1)) + a
}

type RawRow = {
  year: string
  make: string
  model: string
  trim: string
  body: string
  transmission: string
  color: string
  interior: string
  vin: string
  state: string
  condition: string
  odometer: string
  mmr: string
  sellingprice: string
  saledate: string
  seller: string
}

export const seedHVenta = async (
  sellerIdMap: Record<string, number>
): Promise<void> => {
  const conn = await pool.getConnection()

  try {
    console.log('🌱 Seeding h_venta...')

    const csvPath = path.resolve(process.cwd(), 'car_prices.csv')
    if (!fs.existsSync(csvPath))
      throw new Error(`No se encontró car_prices.csv en: ${csvPath}`)

    const parsed = Papa.parse<RawRow>(fs.readFileSync(csvPath, 'utf-8'), {
      header: true,
      skipEmptyLines: true
    })

    const valid = parsed.data.filter(
      r => r.vin && r.sellingprice && VALID_STATES.has(r.state?.toLowerCase())
    )
    const step = Math.floor(valid.length / 5000)
    const sample = valid.filter((_, i) => i % step === 0).slice(0, 5000)

    const rows: [
      string,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      string
    ][] = []

    for (const row of sample) {
      const make = normMake(row.make)
      const model = (row.model ?? '').trim()
      const trim_ = (row.trim ?? 'Base').trim() || 'Base'
      const body = normBody(row.body)
      const trans = normTrans(row.transmission)
      const color = normColor(row.color)
      const interior = normInterior(row.interior)
      const year = parseInt(row.year) || 2014
      const state = row.state?.toLowerCase()

      const key = `${make}|${model}|${trim_}|${body}|${trans}|${color}|${interior}|${year}`
      const vehiculoId = VEHICULO_ID_MAP.get(key) ?? 1
      const fecha = parseFecha(row.saledate ?? '')
      const tiempoId = fechaToTiempoId(fecha)
      const ubicId = UBICACION_ID_MAP[state] ?? 1
      const concId = sellerIdMap[row.seller?.trim()] ?? randInt(1, 150)
      const clienteId = randInt(1, 500)
      const empleadoId = randInt(1, 150)
      const estadoId = ESTADO_IDS[randInt(0, ESTADO_IDS.length - 1)]

      const mmr = parseFloat(row.mmr) || 0
      const precio = parseFloat(row.sellingprice) || 0
      const odo = (parseFloat(row.odometer) || 0) * 1.60934
      const cond = parseFloat(row.condition) || 30
      const condId = getCondicionId(cond)
      const rangoId = getRangoPrecioId(precio)
      const comision = parseFloat((precio * 0.025).toFixed(2))
      const diff = parseFloat((precio - mmr).toFixed(2))

      rows.push([
        row.vin.trim(),
        vehiculoId,
        tiempoId,
        ubicId,
        concId,
        clienteId,
        empleadoId,
        estadoId,
        condId,
        rangoId,
        parseFloat(mmr.toFixed(2)),
        parseFloat(precio.toFixed(2)),
        parseFloat(odo.toFixed(2)),
        parseFloat(cond.toFixed(1)),
        comision,
        diff,
        fecha
      ])
    }

    const BATCH = 250
    for (let i = 0; i < rows.length; i += BATCH) {
      await conn.query(
        `INSERT INTO h_venta
         (vin, vehiculo_id, tiempo_id, ubicacion_id, concesionaria_id,
          cliente_id, empleado_id, estado_venta_id, condicion_id, rango_precio_id,
          precio_mercado_mmr, precio_venta, odometro_km, condicion_vehiculo,
          comision_usd, diferencia_vs_mercado, fecha_venta)
         VALUES ?`,
        [rows.slice(i, i + BATCH)]
      )
      process.stdout.write(
        `\r  → ${Math.min(i + BATCH, rows.length)} / ${rows.length}`
      )
    }
    console.log(`\n✅ h_venta: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en h_venta:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  ;(async (): Promise<void> => {
    await seedVehiculo()
    const { seedConcesionaria, SELLER_ID_MAP } =
      await import('./d_concesionaria.seed')
    await seedConcesionaria()
    await seedHVenta(SELLER_ID_MAP)
    process.exit(0)
  })().catch(() => process.exit(1))
}
