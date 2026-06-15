import { pool } from './config'

const createSchema = async (): Promise<void> => {
  let conn: Awaited<ReturnType<typeof pool.getConnection>> | undefined

  try {
    conn = await pool.getConnection()
    console.log('🏗️  Creando esquema (15 tablas)...\n')

    await conn.query('SET FOREIGN_KEY_CHECKS = 0')

    // Drop en orden inverso de dependencias
    const drops = [
      'h_venta',
      'd_vehiculo',
      'd_cliente',
      'd_tiempo',
      'd_ubicacion',
      'd_empleado',
      'd_concesionaria',
      'd_estado_venta',
      'd_condicion',
      'd_rango_precio',
      'd_marca',
      'd_carroceria',
      'd_transmision',
      'd_color',
      'd_tipo_cliente'
    ]

    for (const t of drops) await conn.query(`DROP TABLE IF EXISTS ${t}`)

    // ── d_marca ───────────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE d_marca (
        marca_id        INT          PRIMARY KEY,
        nombre_marca    VARCHAR(60)  NOT NULL,
        pais_origen     VARCHAR(40)  NOT NULL,
        segmento        VARCHAR(20)  NOT NULL,
        anio_fundacion  INT          NOT NULL,
        activa          VARCHAR(2)   NOT NULL DEFAULT 'Sí'
      )
    `)
    console.log('  ✓ d_marca')

    // ── d_carroceria ──────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE d_carroceria (
        carroceria_id        INT          PRIMARY KEY,
        tipo_carroceria      VARCHAR(30)  NOT NULL,
        descripcion          VARCHAR(150) NOT NULL,
        num_puertas          INT          NOT NULL,
        capacidad_pasajeros  INT          NOT NULL,
        uso_principal        VARCHAR(20)  NOT NULL
      )
    `)
    console.log('  ✓ d_carroceria')

    // ── d_transmision ─────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE d_transmision (
        transmision_id     INT          PRIMARY KEY,
        tipo_transmision   VARCHAR(15)  NOT NULL,
        descripcion        VARCHAR(150) NOT NULL,
        velocidades_tipicas VARCHAR(10) NOT NULL,
        consumo_relativo   VARCHAR(30)  NOT NULL
      )
    `)
    console.log('  ✓ d_transmision')

    // ── d_color ───────────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE d_color (
        color_id          INT         PRIMARY KEY,
        nombre_color      VARCHAR(30) NOT NULL,
        familia           VARCHAR(20) NOT NULL,
        es_metalico       VARCHAR(2)  NOT NULL,
        popularidad_rank  INT         NOT NULL
      )
    `)
    console.log('  ✓ d_color')

    // ── d_tipo_cliente ────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE d_tipo_cliente (
        tipo_cliente_id     INT          PRIMARY KEY,
        nombre_tipo         VARCHAR(30)  NOT NULL,
        descripcion         VARCHAR(150) NOT NULL,
        descuento_base_pct  DECIMAL(5,2) NOT NULL,
        requiere_ruc        VARCHAR(2)   NOT NULL
      )
    `)
    console.log('  ✓ d_tipo_cliente')

    // ── d_tiempo ──────────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE d_tiempo (
        tiempo_id           INT AUTO_INCREMENT PRIMARY KEY,
        fecha_completa      DATE        NOT NULL,
        ano                 INT         NOT NULL,
        trimestre           INT         NOT NULL,
        mes                 INT         NOT NULL,
        nombre_mes          VARCHAR(20) NOT NULL,
        dia_del_mes         INT         NOT NULL,
        dia_de_la_semana    VARCHAR(15) NOT NULL,
        semana_del_ano      INT         NOT NULL,
        es_fin_de_semana    VARCHAR(2)  NOT NULL
      )
    `)
    console.log('  ✓ d_tiempo')

    // ── d_ubicacion ───────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE d_ubicacion (
        ubicacion_id   INT         PRIMARY KEY,
        codigo_estado  VARCHAR(5)  NOT NULL,
        nombre_estado  VARCHAR(80) NOT NULL,
        region         VARCHAR(40) NOT NULL,
        pais           VARCHAR(40) NOT NULL
      )
    `)
    console.log('  ✓ d_ubicacion')

    // ── d_empleado ────────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE d_empleado (
        empleado_id               INT          PRIMARY KEY,
        nombre_completo_empleado  VARCHAR(150) NOT NULL,
        email_empleado            VARCHAR(100) NOT NULL,
        cargo                     VARCHAR(60)  NOT NULL,
        anios_experiencia         INT          NOT NULL,
        meta_mensual_unidades     INT          NOT NULL,
        comision_porcentaje       DECIMAL(5,2) NOT NULL
      )
    `)
    console.log('  ✓ d_empleado')

    // ── d_concesionaria ───────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE d_concesionaria (
        concesionaria_id     INT          PRIMARY KEY,
        nombre_concesionaria VARCHAR(100) NOT NULL,
        tipo_concesionaria   VARCHAR(50)  NOT NULL,
        estado               VARCHAR(5)   NOT NULL,
        calificacion         DECIMAL(3,1) NOT NULL,
        anio_apertura        INT          NOT NULL
      )
    `)
    console.log('  ✓ d_concesionaria')

    // ── d_estado_venta ────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE d_estado_venta (
        estado_venta_id    INT         PRIMARY KEY,
        descripcion_estado VARCHAR(60) NOT NULL,
        tipo_estado        VARCHAR(30) NOT NULL
      )
    `)
    console.log('  ✓ d_estado_venta')

    // ── d_condicion ───────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE d_condicion (
        condicion_id   INT           PRIMARY KEY,
        rango_min      INT           NOT NULL,
        rango_max      INT           NOT NULL,
        descripcion    VARCHAR(100)  NOT NULL,
        etiqueta       VARCHAR(20)   NOT NULL,
        factor_precio  DECIMAL(5,2)  NOT NULL
      )
    `)
    console.log('  ✓ d_condicion')

    // ── d_rango_precio ────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE d_rango_precio (
        rango_precio_id  INT           PRIMARY KEY,
        etiqueta         VARCHAR(20)   NOT NULL,
        precio_min       DECIMAL(12,2) NOT NULL,
        precio_max       DECIMAL(12,2) NOT NULL,
        descripcion      VARCHAR(150)  NOT NULL
      )
    `)
    console.log('  ✓ d_rango_precio')

    // ── d_cliente (referencia d_tipo_cliente — snowflake) ─────────────────────
    await conn.query(`
      CREATE TABLE d_cliente (
        cliente_id               INT          PRIMARY KEY,
        nombre_completo_cliente  VARCHAR(150) NOT NULL,
        tipo_cliente             VARCHAR(50)  NOT NULL,
        tipo_cliente_id          INT          NOT NULL,
        documento_identidad      VARCHAR(20)  NOT NULL,
        telefono                 VARCHAR(25),
        referido_por             VARCHAR(60),
        fecha_primer_compra      DATE,
        FOREIGN KEY (tipo_cliente_id) REFERENCES d_tipo_cliente(tipo_cliente_id)
      )
    `)
    console.log('  ✓ d_cliente')

    // ── d_vehiculo (referencia d_marca, d_carroceria, d_transmision, d_color) ─
    await conn.query(`
      CREATE TABLE d_vehiculo (
        vehiculo_id             INT          PRIMARY KEY,
        marca                   VARCHAR(50)  NOT NULL,
        marca_id                INT          NOT NULL,
        pais_origen_marca       VARCHAR(40)  NOT NULL,
        segmento_marca          VARCHAR(20)  NOT NULL,
        modelo                  VARCHAR(80)  NOT NULL,
        version_trim            VARCHAR(80)  NOT NULL,
        anio_fabricacion        INT          NOT NULL,
        tipo_carroceria         VARCHAR(30)  NOT NULL,
        carroceria_id           INT          NOT NULL,
        descripcion_carroceria  VARCHAR(120) NOT NULL,
        tipo_transmision        VARCHAR(15)  NOT NULL,
        transmision_id          INT          NOT NULL,
        color_exterior          VARCHAR(30)  NOT NULL,
        color_id                INT          NOT NULL,
        color_interior          VARCHAR(30)  NOT NULL,
        FOREIGN KEY (marca_id)       REFERENCES d_marca(marca_id),
        FOREIGN KEY (carroceria_id)  REFERENCES d_carroceria(carroceria_id),
        FOREIGN KEY (transmision_id) REFERENCES d_transmision(transmision_id),
        FOREIGN KEY (color_id)       REFERENCES d_color(color_id)
      )
    `)
    console.log('  ✓ d_vehiculo')

    // ── h_venta (tabla de hechos central — 11 FK) ─────────────────────────────
    await conn.query(`
      CREATE TABLE h_venta (
        venta_id               INT AUTO_INCREMENT PRIMARY KEY,
        vin                    VARCHAR(20)   NOT NULL,
        vehiculo_id            INT           NOT NULL,
        tiempo_id              INT           NOT NULL,
        ubicacion_id           INT           NOT NULL,
        concesionaria_id       INT           NOT NULL,
        cliente_id             INT           NOT NULL,
        empleado_id            INT           NOT NULL,
        estado_venta_id        INT           NOT NULL,
        condicion_id           INT           NOT NULL,
        rango_precio_id        INT           NOT NULL,
        precio_mercado_mmr     DECIMAL(12,2) NOT NULL,
        precio_venta           DECIMAL(12,2) NOT NULL,
        odometro_km            DECIMAL(12,2) NOT NULL,
        condicion_vehiculo     DECIMAL(4,1)  NOT NULL,
        comision_usd           DECIMAL(12,2) NOT NULL,
        diferencia_vs_mercado  DECIMAL(12,2) NOT NULL,
        fecha_venta            DATE          NOT NULL,
        FOREIGN KEY (vehiculo_id)      REFERENCES d_vehiculo(vehiculo_id),
        FOREIGN KEY (tiempo_id)        REFERENCES d_tiempo(tiempo_id),
        FOREIGN KEY (ubicacion_id)     REFERENCES d_ubicacion(ubicacion_id),
        FOREIGN KEY (concesionaria_id) REFERENCES d_concesionaria(concesionaria_id),
        FOREIGN KEY (cliente_id)       REFERENCES d_cliente(cliente_id),
        FOREIGN KEY (empleado_id)      REFERENCES d_empleado(empleado_id),
        FOREIGN KEY (estado_venta_id)  REFERENCES d_estado_venta(estado_venta_id),
        FOREIGN KEY (condicion_id)     REFERENCES d_condicion(condicion_id),
        FOREIGN KEY (rango_precio_id)  REFERENCES d_rango_precio(rango_precio_id)
      )
    `)
    console.log('  ✓ h_venta (tabla de hechos — 9 FK directas)')

    await conn.query('SET FOREIGN_KEY_CHECKS = 1')
    console.log('\n✅ Esquema de 15 tablas creado exitosamente!')
  } catch (err) {
    console.error('❌ Error creando esquema:', err)
    throw err
  } finally {
    conn?.release()
  }
}

createSchema()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Falló seed:schema:', err)
    process.exit(1)
  })
