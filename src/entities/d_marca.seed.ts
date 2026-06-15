import { pool } from '../config'

const MARCAS = [
  { nombre: 'Acura', pais: 'Japón', segmento: 'Premium', anio: 1986 },
  { nombre: 'Audi', pais: 'Alemania', segmento: 'Premium', anio: 1909 },
  { nombre: 'BMW', pais: 'Alemania', segmento: 'Premium', anio: 1916 },
  { nombre: 'Buick', pais: 'EE.UU.', segmento: 'Premium', anio: 1903 },
  { nombre: 'Cadillac', pais: 'EE.UU.', segmento: 'Premium', anio: 1902 },
  { nombre: 'Chevrolet', pais: 'EE.UU.', segmento: 'Masivo', anio: 1911 },
  { nombre: 'Chrysler', pais: 'EE.UU.', segmento: 'Masivo', anio: 1925 },
  { nombre: 'Dodge', pais: 'EE.UU.', segmento: 'Masivo', anio: 1900 },
  { nombre: 'Ford', pais: 'EE.UU.', segmento: 'Masivo', anio: 1903 },
  { nombre: 'GMC', pais: 'EE.UU.', segmento: 'Masivo', anio: 1912 },
  { nombre: 'Honda', pais: 'Japón', segmento: 'Masivo', anio: 1948 },
  { nombre: 'Hyundai', pais: 'Corea del Sur', segmento: 'Masivo', anio: 1967 },
  { nombre: 'Infiniti', pais: 'Japón', segmento: 'Premium', anio: 1989 },
  { nombre: 'Jaguar', pais: 'Reino Unido', segmento: 'Lujo', anio: 1922 },
  { nombre: 'Jeep', pais: 'EE.UU.', segmento: 'Masivo', anio: 1941 },
  { nombre: 'Kia', pais: 'Corea del Sur', segmento: 'Económico', anio: 1944 },
  {
    nombre: 'Land Rover',
    pais: 'Reino Unido',
    segmento: 'Premium',
    anio: 1948
  },
  { nombre: 'Lexus', pais: 'Japón', segmento: 'Premium', anio: 1989 },
  { nombre: 'Lincoln', pais: 'EE.UU.', segmento: 'Premium', anio: 1917 },
  { nombre: 'Maserati', pais: 'Italia', segmento: 'Lujo', anio: 1914 },
  { nombre: 'Mazda', pais: 'Japón', segmento: 'Masivo', anio: 1920 },
  {
    nombre: 'Mercedes-Benz',
    pais: 'Alemania',
    segmento: 'Premium',
    anio: 1926
  },
  { nombre: 'Mercury', pais: 'EE.UU.', segmento: 'Masivo', anio: 1938 },
  { nombre: 'Mitsubishi', pais: 'Japón', segmento: 'Masivo', anio: 1917 },
  { nombre: 'Nissan', pais: 'Japón', segmento: 'Masivo', anio: 1933 },
  { nombre: 'Oldsmobile', pais: 'EE.UU.', segmento: 'Masivo', anio: 1897 },
  { nombre: 'Otro', pais: 'Desconocido', segmento: 'Otro', anio: 2000 },
  { nombre: 'Plymouth', pais: 'EE.UU.', segmento: 'Masivo', anio: 1928 },
  { nombre: 'Pontiac', pais: 'EE.UU.', segmento: 'Masivo', anio: 1926 },
  { nombre: 'Porsche', pais: 'Alemania', segmento: 'Lujo', anio: 1931 },
  { nombre: 'Smart', pais: 'Alemania', segmento: 'Económico', anio: 1994 },
  { nombre: 'Subaru', pais: 'Japón', segmento: 'Masivo', anio: 1953 },
  { nombre: 'Suzuki', pais: 'Japón', segmento: 'Económico', anio: 1909 },
  { nombre: 'Toyota', pais: 'Japón', segmento: 'Masivo', anio: 1937 },
  { nombre: 'Volkswagen', pais: 'Alemania', segmento: 'Masivo', anio: 1937 },
  { nombre: 'Volvo', pais: 'Suecia', segmento: 'Premium', anio: 1927 }
]

// Exportado para que d_vehiculo.seed.ts pueda mapear marca → marca_id
export const MARCA_ID_MAP: Record<string, number> = Object.fromEntries(
  MARCAS.map((m, i) => [m.nombre, i + 1])
)

export const seedMarca = async (): Promise<void> => {
  const conn = await pool.getConnection()

  try {
    console.log('🌱 Seeding d_marca...')
    const rows = MARCAS.map((m, i) => [
      i + 1,
      m.nombre,
      m.pais,
      m.segmento,
      m.anio,
      'Sí'
    ])
    await conn.query(
      `INSERT INTO d_marca
       (marca_id, nombre_marca, pais_origen, segmento, anio_fundacion, activa)
       VALUES ?`,
      [rows]
    )
    console.log(`✅ d_marca: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_marca:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  seedMarca()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
