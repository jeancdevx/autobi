import { pool } from '../config'

const RANGOS = [
  {
    id: 1,
    etiq: 'Económico',
    min: 0,
    max: 4999,
    desc: 'Hasta $4,999 – vehículos de bajo costo o alta depreciación'
  },
  {
    id: 2,
    etiq: 'Accesible',
    min: 5000,
    max: 14999,
    desc: '$5,000–$14,999 – segmento de entrada más popular'
  },
  {
    id: 3,
    etiq: 'Intermedio',
    min: 15000,
    max: 29999,
    desc: '$15,000–$29,999 – segmento medio estándar'
  },
  {
    id: 4,
    etiq: 'Premium',
    min: 30000,
    max: 59999,
    desc: '$30,000–$59,999 – vehículos de gama alta'
  },
  {
    id: 5,
    etiq: 'Lujo',
    min: 60000,
    max: 999999,
    desc: '$60,000+ – lujo y coleccionables'
  }
]

// Exportado para h_venta.seed.ts
export const getRangoPrecioId = (precio: number): number => {
  if (precio < 5000) return 1
  if (precio < 15000) return 2
  if (precio < 30000) return 3
  if (precio < 60000) return 4
  return 5
}

export const seedRangoPrecio = async (): Promise<void> => {
  const conn = await pool.getConnection()

  try {
    console.log('🌱 Seeding d_rango_precio...')
    const rows = RANGOS.map(r => [r.id, r.etiq, r.min, r.max, r.desc])
    await conn.query(
      `INSERT INTO d_rango_precio
       (rango_precio_id, etiqueta, precio_min, precio_max, descripcion)
       VALUES ?`,
      [rows]
    )
    console.log(`✅ d_rango_precio: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_rango_precio:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  seedRangoPrecio()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
