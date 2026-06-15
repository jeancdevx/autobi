import { pool } from '../config'

const CONDICIONES = [
  {
    id: 1,
    min: 1,
    max: 10,
    desc: 'Muy malo – requiere reparación mayor',
    etiq: 'Muy Malo',
    factor: 0.65
  },
  {
    id: 2,
    min: 11,
    max: 20,
    desc: 'Malo – daños visibles significativos',
    etiq: 'Malo',
    factor: 0.78
  },
  {
    id: 3,
    min: 21,
    max: 30,
    desc: 'Regular – desgaste normal de uso',
    etiq: 'Regular',
    factor: 0.9
  },
  {
    id: 4,
    min: 31,
    max: 40,
    desc: 'Bueno – condición por encima del promedio',
    etiq: 'Bueno',
    factor: 1.0
  },
  {
    id: 5,
    min: 41,
    max: 49,
    desc: 'Excelente – casi nuevo o restaurado',
    etiq: 'Excelente',
    factor: 1.12
  }
]

// Exportado para h_venta.seed.ts
export const getCondicionId = (valor: number): number => {
  if (valor <= 10) return 1
  if (valor <= 20) return 2
  if (valor <= 30) return 3
  if (valor <= 40) return 4
  return 5
}

export const seedCondicion = async (): Promise<void> => {
  const conn = await pool.getConnection()

  try {
    console.log('🌱 Seeding d_condicion...')
    const rows = CONDICIONES.map(c => [
      c.id,
      c.min,
      c.max,
      c.desc,
      c.etiq,
      c.factor
    ])
    await conn.query(
      `INSERT INTO d_condicion
       (condicion_id, rango_min, rango_max, descripcion, etiqueta, factor_precio)
       VALUES ?`,
      [rows]
    )
    console.log(`✅ d_condicion: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_condicion:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  seedCondicion()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
