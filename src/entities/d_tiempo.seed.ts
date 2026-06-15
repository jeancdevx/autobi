import { pool } from '../config'

const MESES: Record<number, string> = {
  1: 'Enero',
  2: 'Febrero',
  3: 'Marzo',
  4: 'Abril',
  5: 'Mayo',
  6: 'Junio',
  7: 'Julio',
  8: 'Agosto',
  9: 'Septiembre',
  10: 'Octubre',
  11: 'Noviembre',
  12: 'Diciembre'
}
const DIAS: Record<number, string> = {
  0: 'Lunes',
  1: 'Martes',
  2: 'Miércoles',
  3: 'Jueves',
  4: 'Viernes',
  5: 'Sábado',
  6: 'Domingo'
}
const TRIMESTRE: Record<number, number> = {
  1: 1,
  2: 1,
  3: 1,
  4: 2,
  5: 2,
  6: 2,
  7: 3,
  8: 3,
  9: 3,
  10: 4,
  11: 4,
  12: 4
}

export const seedTiempo = async (): Promise<void> => {
  const conn = await pool.getConnection()

  try {
    console.log('🌱 Seeding d_tiempo...')

    const rows: [
      string,
      number,
      number,
      number,
      string,
      number,
      string,
      number,
      string
    ][] = []
    const start = new Date('2014-01-01')
    const end = new Date('2015-12-31')

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const fecha = d.toISOString().slice(0, 10)
      const ano = d.getFullYear()
      const mes = d.getMonth() + 1
      rows.push([
        fecha,
        ano,
        TRIMESTRE[mes],
        mes,
        MESES[mes],
        d.getDate(),
        DIAS[d.getDay() === 0 ? 6 : d.getDay() - 1],
        getWeekNumber(d),
        d.getDay() === 0 || d.getDay() === 6 ? 'Sí' : 'No'
      ])
    }

    await conn.query(
      `INSERT INTO d_tiempo
       (fecha_completa, ano, trimestre, mes, nombre_mes,
        dia_del_mes, dia_de_la_semana, semana_del_ano, es_fin_de_semana)
       VALUES ?`,
      [rows]
    )

    console.log(`✅ d_tiempo: ${rows.length} registros insertados`)
  } catch (err) {
    console.error('❌ Error en d_tiempo:', err)
    throw err
  } finally {
    conn.release()
  }
}

function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  )
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

if (require.main === module) {
  seedTiempo()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
