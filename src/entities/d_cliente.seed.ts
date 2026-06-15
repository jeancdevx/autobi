import { pool } from '../config'
import { TIPO_CLIENTE_ID_MAP } from './d_tipo_cliente.seed'

const NOMBRES = [
  'Carlos',
  'María',
  'José',
  'Ana',
  'Luis',
  'Laura',
  'Miguel',
  'Sofía',
  'Jorge',
  'Isabel',
  'Pedro',
  'Elena',
  'Pablo',
  'Valentina',
  'Roberto',
  'Carmen',
  'Daniel',
  'Lucía',
  'Andrés',
  'Patricia',
  'Ricardo',
  'Fernanda',
  'Sergio',
  'Gabriela',
  'Diego'
]
const APELLIDOS = [
  'García',
  'Rodríguez',
  'López',
  'Martínez',
  'Sánchez',
  'González',
  'Pérez',
  'Torres',
  'Hernández',
  'Flores',
  'Ramírez',
  'Cruz',
  'Reyes',
  'Morales',
  'Jiménez',
  'Álvarez',
  'Romero',
  'Vargas',
  'Castillo',
  'Ramos',
  'Wilson',
  'Smith'
]
const TIPOS = ['Particular', 'Empresa', 'Flotilla', 'Arrendamiento']
const REFS = [
  'Publicidad Web',
  'Referido',
  'Visita Directa',
  'Redes Sociales',
  'Llamada',
  'Feria Automotriz'
]

const rand = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)]
}
const randInt = (a: number, b: number): number => {
  return Math.floor(Math.random() * (b - a + 1)) + a
}
const pad = (n: number): string => {
  return String(n).padStart(2, '0')
}

export const seedCliente = async (): Promise<void> => {
  const conn = await pool.getConnection()
  try {
    console.log('🌱 Seeding d_cliente...')

    const rows: [
      number,
      string,
      string,
      number,
      string,
      string,
      string,
      string
    ][] = []

    for (let i = 1; i <= 500; i++) {
      const tipo = rand(TIPOS)
      const tipoId = TIPO_CLIENTE_ID_MAP[tipo] ?? 1
      const nombre = `${rand(NOMBRES)} ${rand(APELLIDOS)}`
      const doc = String(randInt(10000000, 99999999))
      const tel = `+1 ${randInt(200, 999)}-${randInt(100, 999)}-${randInt(1000, 9999)}`
      const fecha = `${randInt(2010, 2014)}-${pad(randInt(1, 12))}-${pad(randInt(1, 28))}`
      rows.push([i, nombre, tipo, tipoId, doc, tel, rand(REFS), fecha])
    }

    await conn.query(
      `INSERT INTO d_cliente
       (cliente_id, nombre_completo_cliente, tipo_cliente, tipo_cliente_id,
        documento_identidad, telefono, referido_por, fecha_primer_compra)
       VALUES ?`,
      [rows]
    )
    console.log(`✅ d_cliente: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_cliente:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  seedCliente()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
