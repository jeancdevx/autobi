import { pool } from '../config'

const COLORES = [
  { nombre: 'Beige', familia: 'Claro', metalico: 'No', rank: 12 },
  { nombre: 'Black', familia: 'Oscuro', metalico: 'No', rank: 2 },
  { nombre: 'Blue', familia: 'Frío', metalico: 'Sí', rank: 5 },
  { nombre: 'Brown', familia: 'Tierra', metalico: 'No', rank: 13 },
  { nombre: 'Burgundy', familia: 'Oscuro', metalico: 'No', rank: 10 },
  { nombre: 'Charcoal', familia: 'Oscuro', metalico: 'Sí', rank: 7 },
  { nombre: 'Gold', familia: 'Cálido', metalico: 'Sí', rank: 14 },
  { nombre: 'Gray', familia: 'Neutro', metalico: 'Sí', rank: 4 },
  { nombre: 'Green', familia: 'Frío', metalico: 'No', rank: 11 },
  { nombre: 'Lime', familia: 'Llamativo', metalico: 'No', rank: 19 },
  { nombre: 'Off-White', familia: 'Claro', metalico: 'No', rank: 9 },
  { nombre: 'Orange', familia: 'Llamativo', metalico: 'No', rank: 17 },
  { nombre: 'Otro', familia: 'Otro', metalico: 'No', rank: 20 },
  { nombre: 'Pink', familia: 'Llamativo', metalico: 'No', rank: 18 },
  { nombre: 'Purple', familia: 'Oscuro', metalico: 'No', rank: 16 },
  { nombre: 'Red', familia: 'Cálido', metalico: 'Sí', rank: 6 },
  { nombre: 'Silver', familia: 'Neutro', metalico: 'Sí', rank: 3 },
  { nombre: 'Turquoise', familia: 'Frío', metalico: 'No', rank: 15 },
  { nombre: 'White', familia: 'Claro', metalico: 'No', rank: 1 },
  { nombre: 'Yellow', familia: 'Llamativo', metalico: 'No', rank: 8 }
]

// Exportado para d_vehiculo.seed.ts
export const COLOR_ID_MAP: Record<string, number> = Object.fromEntries(
  COLORES.map((c, i) => [c.nombre, i + 1])
)

export const seedColor = async (): Promise<void> => {
  const conn = await pool.getConnection()

  try {
    console.log('🌱 Seeding d_color...')
    const rows = COLORES.map((c, i) => [
      i + 1,
      c.nombre,
      c.familia,
      c.metalico,
      c.rank
    ])
    await conn.query(
      `INSERT INTO d_color
       (color_id, nombre_color, familia, es_metalico, popularidad_rank)
       VALUES ?`,
      [rows]
    )
    console.log(`✅ d_color: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_color:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  seedColor()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
