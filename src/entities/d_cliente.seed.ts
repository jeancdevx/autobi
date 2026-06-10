import { pool } from '../config'

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
  'Diego',
  'Alejandra',
  'Fernando',
  'Monica',
  'Oscar',
  'Claudia',
  'Alberto',
  'Rosa',
  'Héctor',
  'Diana',
  'Raúl',
  'Natalia',
  'Ernesto',
  'Verónica',
  'Gustavo',
  'Silvia'
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
  'Johnson',
  'Smith',
  'Brown',
  'Davis',
  'Miller',
  'Anderson',
  'Taylor',
  'Thomas',
  'Jackson',
  'White',
  'Harris',
  'Martin',
  'Thompson',
  'Moore'
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

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function padTwo(n: number): string {
  return String(n).padStart(2, '0')
}

export async function seedCliente(): Promise<void> {
  const conn = await pool.getConnection()
  try {
    console.log('🌱 Seeding d_cliente...')

    const rows: [number, string, string, string, string, string, string][] = []

    for (let i = 1; i <= 500; i++) {
      const nombre = `${rand(NOMBRES)} ${rand(APELLIDOS)}`
      const doc = String(randInt(10000000, 99999999))
      const tel = `+1 ${randInt(200, 999)}-${randInt(100, 999)}-${randInt(1000, 9999)}`
      const ano = randInt(2010, 2014)
      const mes = randInt(1, 12)
      const dia = randInt(1, 28)
      const fecha = `${ano}-${padTwo(mes)}-${padTwo(dia)}`

      rows.push([i, nombre, rand(TIPOS), doc, tel, rand(REFS), fecha])
    }

    await conn.query(
      `INSERT INTO d_cliente
       (cliente_id, nombre_completo_cliente, tipo_cliente,
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
