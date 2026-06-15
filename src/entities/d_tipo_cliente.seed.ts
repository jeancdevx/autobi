import { pool } from '../config'

const TIPOS = [
  {
    id: 1,
    nombre: 'Particular',
    descripcion: 'Persona natural que compra para uso propio',
    descuento: 0.0,
    ruc: 'No'
  },
  {
    id: 2,
    nombre: 'Empresa',
    descripcion: 'Empresa que adquiere para uso corporativo individual',
    descuento: 2.5,
    ruc: 'Sí'
  },
  {
    id: 3,
    nombre: 'Flotilla',
    descripcion: 'Empresa que adquiere múltiples unidades para flota',
    descuento: 5.0,
    ruc: 'Sí'
  },
  {
    id: 4,
    nombre: 'Arrendamiento',
    descripcion: 'Compra con contrato de arrendamiento financiero',
    descuento: 3.0,
    ruc: 'Sí'
  }
]

// Exportado para d_cliente.seed.ts
export const TIPO_CLIENTE_ID_MAP: Record<string, number> = Object.fromEntries(
  TIPOS.map(t => [t.nombre, t.id])
)

export const seedTipoCliente = async (): Promise<void> => {
  const conn = await pool.getConnection()

  try {
    console.log('🌱 Seeding d_tipo_cliente...')
    const rows = TIPOS.map(t => [
      t.id,
      t.nombre,
      t.descripcion,
      t.descuento,
      t.ruc
    ])
    await conn.query(
      `INSERT INTO d_tipo_cliente
       (tipo_cliente_id, nombre_tipo, descripcion,
        descuento_base_pct, requiere_ruc)
       VALUES ?`,
      [rows]
    )
    console.log(`✅ d_tipo_cliente: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_tipo_cliente:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  seedTipoCliente()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
