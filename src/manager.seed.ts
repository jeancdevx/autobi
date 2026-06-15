import { pool } from './config'
import { seedCarroceria } from './entities/d_carroceria.seed'
import { seedCliente } from './entities/d_cliente.seed'
import { seedColor } from './entities/d_color.seed'
import {
  seedConcesionaria,
  SELLER_ID_MAP
} from './entities/d_concesionaria.seed'
import { seedCondicion } from './entities/d_condicion.seed'
import { seedEmpleado } from './entities/d_empleado.seed'
import { seedEstadoVenta } from './entities/d_estado_venta.seed'
import { seedMarca } from './entities/d_marca.seed'
import { seedRangoPrecio } from './entities/d_rango_precio.seed'
import { seedTiempo } from './entities/d_tiempo.seed'
import { seedTipoCliente } from './entities/d_tipo_cliente.seed'
import { seedTransmision } from './entities/d_transmision.seed'
import { seedUbicacion } from './entities/d_ubicacion.seed'
import { seedVehiculo } from './entities/d_vehiculo.seed'
import { seedHVenta } from './entities/h_venta.seed'

const runAll = async (): Promise<void> => {
  console.log('╔══════════════════════════════════════════════════════╗')
  console.log('║   AutoBI — Seeder completo del modelo (15 tablas)   ║')
  console.log('╚══════════════════════════════════════════════════════╝\n')

  const start = Date.now()

  try {
    console.log('── Paso 1/4: Tablas snowflake ──────────────────────────')
    await seedMarca()
    await seedCarroceria()
    await seedTransmision()
    await seedColor()
    await seedTipoCliente()

    console.log('\n── Paso 2/4: Dimensiones directas ─────────────────────')
    await seedTiempo()
    await seedUbicacion()
    await seedEmpleado()
    await seedEstadoVenta()
    await seedCondicion()
    await seedRangoPrecio()

    console.log('\n── Paso 3/4: Dimensiones con FK al CSV ─────────────────')
    await seedConcesionaria() // construye SELLER_ID_MAP
    await seedCliente() // usa TIPO_CLIENTE_ID_MAP
    await seedVehiculo() // usa MARCA/CARROCERIA/TRANSMISION/COLOR ID MAPs

    console.log('\n── Paso 4/4: Tabla de hechos ───────────────────────────')
    await seedHVenta(SELLER_ID_MAP)

    const seg = ((Date.now() - start) / 1000).toFixed(1)
    console.log(`\n╔══════════════════════════════════════════════════════╗`)
    console.log(`║  ✅ Completado en ${seg}s — 15 tablas pobladas         `)
    console.log(`╚══════════════════════════════════════════════════════╝`)
  } catch (err) {
    console.error('\n❌ Seeding falló:', err)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runAll()
