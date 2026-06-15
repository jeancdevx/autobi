import { pool } from '../config'

const CARROCERIAS = [
  {
    tipo: 'Convertible',
    descripcion: 'Vehículo descapotable con techo retráctil manual o eléctrico',
    puertas: 2,
    pasajeros: 2,
    uso: 'Deportivo'
  },
  {
    tipo: 'Coupé',
    descripcion: 'Vehículo de 2 puertas con diseño deportivo y techo fijo',
    puertas: 2,
    pasajeros: 4,
    uso: 'Deportivo'
  },
  {
    tipo: 'Hatchback',
    descripcion: 'Compacto con puerta trasera que incluye la luneta',
    puertas: 4,
    pasajeros: 5,
    uso: 'Urbano'
  },
  {
    tipo: 'Otro',
    descripcion: 'Carrocería especial o no clasificada en categorías estándar',
    puertas: 4,
    pasajeros: 4,
    uso: 'General'
  },
  {
    tipo: 'Pickup',
    descripcion: 'Camioneta con cabina y plataforma de carga abierta',
    puertas: 4,
    pasajeros: 5,
    uso: 'Utilitario'
  },
  {
    tipo: 'SUV',
    descripcion: 'Vehículo utilitario deportivo de tracción elevada',
    puertas: 4,
    pasajeros: 5,
    uso: 'Familiar'
  },
  {
    tipo: 'Sedán',
    descripcion: 'Automóvil de 3 volúmenes y 4 puertas de uso general',
    puertas: 4,
    pasajeros: 5,
    uso: 'Familiar'
  },
  {
    tipo: 'Van/Minivan',
    descripcion: 'Furgoneta familiar de alta capacidad de pasajeros',
    puertas: 4,
    pasajeros: 7,
    uso: 'Familiar'
  },
  {
    tipo: 'Wagon',
    descripcion: 'Familiar con carrocería extendida y maletero integrado',
    puertas: 4,
    pasajeros: 5,
    uso: 'Familiar'
  }
]

// Exportado para d_vehiculo.seed.ts
export const CARROCERIA_ID_MAP: Record<string, number> = Object.fromEntries(
  CARROCERIAS.map((c, i) => [c.tipo, i + 1])
)

export const seedCarroceria = async (): Promise<void> => {
  const conn = await pool.getConnection()

  try {
    console.log('🌱 Seeding d_carroceria...')
    const rows = CARROCERIAS.map((c, i) => [
      i + 1,
      c.tipo,
      c.descripcion,
      c.puertas,
      c.pasajeros,
      c.uso
    ])
    await conn.query(
      `INSERT INTO d_carroceria
       (carroceria_id, tipo_carroceria, descripcion,
        num_puertas, capacidad_pasajeros, uso_principal)
       VALUES ?`,
      [rows]
    )
    console.log(`✅ d_carroceria: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_carroceria:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  seedCarroceria()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
