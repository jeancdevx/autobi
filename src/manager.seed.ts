import { pool } from './config'
import { seedCliente } from './entities/d_cliente.seed'
import {
  seedConcesionaria,
  SELLER_ID_MAP
} from './entities/d_concesionaria.seed'
import { seedEmpleado } from './entities/d_empleado.seed'
import { seedEstadoVenta } from './entities/d_estado_venta.seed'
import { seedTiempo } from './entities/d_tiempo.seed'
import { seedUbicacion } from './entities/d_ubicacion.seed'
import { seedVehiculo } from './entities/d_vehiculo.seed'
import { seedHVenta } from './entities/h_venta.seed'

async function runAll(): Promise<void> {
  console.log('╔══════════════════════════════════════════════════╗')
  console.log('║   AutoBI — Seeder completo del modelo estrella   ║')
  console.log('╚══════════════════════════════════════════════════╝\n')

  const start = Date.now()

  try {
    // 1. Dimensiones simples (sin dependencias del CSV)
    await seedTiempo()
    await seedCliente()
    await seedUbicacion()
    await seedEmpleado()
    await seedEstadoVenta()

    // 2. Dimensiones que requieren el CSV
    await seedConcesionaria() // construye SELLER_ID_MAP
    await seedVehiculo() // construye VEHICULO_ID_MAP

    // 3. Tabla de hechos (depende de todos los mapas anteriores)
    await seedHVenta(SELLER_ID_MAP)

    const elapsed = ((Date.now() - start) / 1000).toFixed(1)
    console.log(`\n╔══════════════════════════════════════════════════╗`)
    console.log(`║  ✅ Seeding completado en ${elapsed}s                `)
    console.log(`╚══════════════════════════════════════════════════╝`)
  } catch (err) {
    console.error('\n❌ Seeding falló:', err)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runAll()
