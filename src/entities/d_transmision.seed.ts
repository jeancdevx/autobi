import { pool } from '../config'

const TRANSMISIONES = [
  {
    id: 1,
    tipo: 'Automática',
    descripcion:
      'Cambios automáticos sin embrague manual, mayor comodidad en ciudad',
    velocidades: '6-10',
    consumo: 'Estándar'
  },
  {
    id: 2,
    tipo: 'Manual',
    descripcion: 'Requiere operación del embrague, mayor control en carretera',
    velocidades: '5-6',
    consumo: 'Ligeramente menor'
  }
]

// Exportado para d_vehiculo.seed.ts
export const TRANSMISION_ID_MAP: Record<string, number> = {
  Automática: 1,
  Manual: 2
}

export const seedTransmision = async (): Promise<void> => {
  const conn = await pool.getConnection()

  try {
    console.log('🌱 Seeding d_transmision...')
    const rows = TRANSMISIONES.map(t => [
      t.id,
      t.tipo,
      t.descripcion,
      t.velocidades,
      t.consumo
    ])
    await conn.query(
      `INSERT INTO d_transmision
       (transmision_id, tipo_transmision, descripcion,
        velocidades_tipicas, consumo_relativo)
       VALUES ?`,
      [rows]
    )
    console.log(`✅ d_transmision: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_transmision:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  seedTransmision()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
