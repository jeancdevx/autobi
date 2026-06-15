import { pool } from '../config'

export const UBICACIONES = [
  { codigo: 'AL', nombre: 'Alabama', region: 'Sur', pais: 'EE.UU.' },
  { codigo: 'AZ', nombre: 'Arizona', region: 'Oeste', pais: 'EE.UU.' },
  { codigo: 'CA', nombre: 'California', region: 'Oeste', pais: 'EE.UU.' },
  { codigo: 'CO', nombre: 'Colorado', region: 'Oeste', pais: 'EE.UU.' },
  { codigo: 'FL', nombre: 'Florida', region: 'Sur', pais: 'EE.UU.' },
  { codigo: 'GA', nombre: 'Georgia', region: 'Sur', pais: 'EE.UU.' },
  { codigo: 'HI', nombre: 'Hawaii', region: 'Pacífico', pais: 'EE.UU.' },
  { codigo: 'IL', nombre: 'Illinois', region: 'Medio Oeste', pais: 'EE.UU.' },
  { codigo: 'IN', nombre: 'Indiana', region: 'Medio Oeste', pais: 'EE.UU.' },
  { codigo: 'LA', nombre: 'Louisiana', region: 'Sur', pais: 'EE.UU.' },
  { codigo: 'MA', nombre: 'Massachusetts', region: 'Noreste', pais: 'EE.UU.' },
  { codigo: 'MD', nombre: 'Maryland', region: 'Sur', pais: 'EE.UU.' },
  { codigo: 'MI', nombre: 'Michigan', region: 'Medio Oeste', pais: 'EE.UU.' },
  { codigo: 'MN', nombre: 'Minnesota', region: 'Medio Oeste', pais: 'EE.UU.' },
  { codigo: 'MO', nombre: 'Missouri', region: 'Medio Oeste', pais: 'EE.UU.' },
  { codigo: 'MS', nombre: 'Mississippi', region: 'Sur', pais: 'EE.UU.' },
  { codigo: 'NC', nombre: 'North Carolina', region: 'Sur', pais: 'EE.UU.' },
  { codigo: 'NE', nombre: 'Nebraska', region: 'Medio Oeste', pais: 'EE.UU.' },
  { codigo: 'NJ', nombre: 'New Jersey', region: 'Noreste', pais: 'EE.UU.' },
  { codigo: 'NM', nombre: 'New Mexico', region: 'Oeste', pais: 'EE.UU.' },
  { codigo: 'NV', nombre: 'Nevada', region: 'Oeste', pais: 'EE.UU.' },
  { codigo: 'NY', nombre: 'New York', region: 'Noreste', pais: 'EE.UU.' },
  { codigo: 'OH', nombre: 'Ohio', region: 'Medio Oeste', pais: 'EE.UU.' },
  { codigo: 'OK', nombre: 'Oklahoma', region: 'Sur', pais: 'EE.UU.' },
  { codigo: 'OR', nombre: 'Oregon', region: 'Oeste', pais: 'EE.UU.' },
  { codigo: 'PA', nombre: 'Pennsylvania', region: 'Noreste', pais: 'EE.UU.' },
  { codigo: 'PR', nombre: 'Puerto Rico', region: 'Caribe', pais: 'EE.UU.' },
  { codigo: 'SC', nombre: 'South Carolina', region: 'Sur', pais: 'EE.UU.' },
  { codigo: 'TN', nombre: 'Tennessee', region: 'Sur', pais: 'EE.UU.' },
  { codigo: 'TX', nombre: 'Texas', region: 'Sur', pais: 'EE.UU.' },
  { codigo: 'UT', nombre: 'Utah', region: 'Oeste', pais: 'EE.UU.' },
  { codigo: 'VA', nombre: 'Virginia', region: 'Sur', pais: 'EE.UU.' },
  { codigo: 'WA', nombre: 'Washington', region: 'Oeste', pais: 'EE.UU.' },
  { codigo: 'WI', nombre: 'Wisconsin', region: 'Medio Oeste', pais: 'EE.UU.' }
]

// Mapa para usar en h_venta.seed.ts: código lowercase → ubicacion_id
export const UBICACION_ID_MAP: Record<string, number> = Object.fromEntries(
  UBICACIONES.map((u, i) => [u.codigo.toLowerCase(), i + 1])
)

export const seedUbicacion = async (): Promise<void> => {
  const conn = await pool.getConnection()

  try {
    console.log('🌱 Seeding d_ubicacion...')

    const rows = UBICACIONES.map((u, i) => [
      i + 1,
      u.codigo,
      u.nombre,
      u.region,
      u.pais
    ])

    await conn.query(
      `INSERT INTO d_ubicacion
       (ubicacion_id, codigo_estado, nombre_estado, region, pais)
       VALUES ?`,
      [rows]
    )

    console.log(`✅ d_ubicacion: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_ubicacion:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  seedUbicacion()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
