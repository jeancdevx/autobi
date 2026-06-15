import { pool } from '../config'

const ESTADOS = [
  { id: 1, descripcion: 'Completada', tipo: 'Final' },
  { id: 2, descripcion: 'Pendiente de Pago', tipo: 'Intermedio' },
  { id: 3, descripcion: 'Cancelada', tipo: 'Final' },
  { id: 4, descripcion: 'En Proceso', tipo: 'Intermedio' },
  { id: 5, descripcion: 'Devuelta', tipo: 'Final' }
]

export const seedEstadoVenta = async (): Promise<void> => {
  const conn = await pool.getConnection()

  try {
    console.log('🌱 Seeding d_estado_venta...')

    const rows = ESTADOS.map(e => [e.id, e.descripcion, e.tipo])

    await conn.query(
      `INSERT INTO d_estado_venta
       (estado_venta_id, descripcion_estado, tipo_estado)
       VALUES ?`,
      [rows]
    )

    console.log(`✅ d_estado_venta: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_estado_venta:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  seedEstadoVenta()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
