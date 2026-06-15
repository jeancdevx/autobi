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
  'Alberto'
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
  'Ramos'
]
const CARGOS = [
  'Asesor Comercial',
  'Ejecutivo de Ventas',
  'Gerente de Ventas',
  'Vendedor Senior',
  'Vendedor Junior'
]
const METAS = [5, 8, 10, 12, 15]

const rand = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)]
}
const randInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
const randFloat = (min: number, max: number, decimals = 2): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

// Exportado para que h_venta pueda calcular comisiones
export const EMPLEADO_COMISIONES: number[] = []

export const seedEmpleado = async (): Promise<void> => {
  const conn = await pool.getConnection()

  try {
    console.log('🌱 Seeding d_empleado...')

    const rows: [number, string, string, string, number, number, number][] = []

    for (let i = 1; i <= 150; i++) {
      const nombre = `${rand(NOMBRES)} ${rand(APELLIDOS)}`
      const email = `vendedor${i}@autobi.com`
      const cargo = rand(CARGOS)
      const exp = randInt(1, 20)
      const meta = rand(METAS)
      const comision = randFloat(1.5, 4.5)
      EMPLEADO_COMISIONES.push(comision)
      rows.push([i, nombre, email, cargo, exp, meta, comision])
    }

    await conn.query(
      `INSERT INTO d_empleado
       (empleado_id, nombre_completo_empleado, email_empleado,
        cargo, anios_experiencia, meta_mensual_unidades, comision_porcentaje)
       VALUES ?`,
      [rows]
    )

    console.log(`✅ d_empleado: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_empleado:', err)
    throw err
  } finally {
    conn.release()
  }
}

if (require.main === module) {
  seedEmpleado()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
