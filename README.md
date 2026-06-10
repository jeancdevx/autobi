# 🚗 AutoBI — Star Schema Seeder

**Proyecto Final · Métodos Cuantitativos**

Sistema de Business Intelligence para el análisis del mercado automotriz de
subastas en EE.UU. (2014–2015).

---

## 📋 Requisitos previos

- [Node.js](https://nodejs.org/) v26+
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [Docker](https://www.docker.com/get-started/)

---

## 🚀 Guía de inicio rápido

### 1. Clonar e instalar dependencias

```bash
git clone git@github.com:jeancdevx/autobi.git
cd autobi
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

### 3. Colocar el dataset

Descarga `car_prices.csv` de Kaggle y colócalo en la **raíz del proyecto**:

```
autobi/
├── car_prices.csv   ← aquí
├── src/
├── docker-compose.yml
└── ...
```

> Dataset: https://www.kaggle.com/datasets/syedanwarafridi/vehicle-sales-data

### 4. Levantar la base de datos con Docker

```bash
pnpm db:up
# Esperar ~10 segundos a que MySQL esté listo
```

### 5. Crear el esquema estrella

```bash
pnpm seed:schema
```

### 6. Poblar todas las tablas

```bash
pnpm seed:all
```

> ⏱️ Este proceso tarda ~2–3 minutos por el volumen de d_vehiculo.

---

## 📊 Modelo estrella (Star Schema)

```
                    d_tiempo
                       │
      d_cliente ─── h_venta ─── d_vehiculo
                    │  │  │
         d_empleado ┘  │  └── d_ubicacion
                       │
              d_concesionaria
                       │
                d_estado_venta
```

### Tablas del modelo

| Tabla             | Tipo       | Registros | Descripción                                           |
| ----------------- | ---------- | --------- | ----------------------------------------------------- |
| `h_venta`         | **Hechos** | 5,000     | Transacciones de venta reales del dataset             |
| `d_vehiculo`      | Dimensión  | ~145,000  | Marca, modelo, trim, carrocería, transmisión, colores |
| `d_tiempo`        | Dimensión  | 730       | Calendario completo 2014–2015                         |
| `d_cliente`       | Dimensión  | 500       | Compradores con tipo y canal de adquisición           |
| `d_ubicacion`     | Dimensión  | 34        | Estados de EE.UU. con región geográfica               |
| `d_empleado`      | Dimensión  | 150       | Asesores de venta con cargo y comisión                |
| `d_concesionaria` | Dimensión  | 150       | Agencias vendedoras del dataset                       |
| `d_estado_venta`  | Dimensión  | 5         | Estados del proceso (Completada, Cancelada...)        |

### Regla estrella pura cumplida ✅

Todas las claves foráneas de `h_venta` apuntan **directamente** a una dimensión.
Ninguna dimensión apunta a otra dimensión.

---

## 🛠️ Comandos disponibles

| Comando                   | Descripción                          |
| ------------------------- | ------------------------------------ |
| `pnpm db:up`              | Levanta el contenedor MySQL          |
| `pnpm db:down`            | Detiene el contenedor                |
| `pnpm db:reset`           | Elimina el volumen y reinicia limpio |
| `pnpm clean`              | Elimina y recrea la BD (sin datos)   |
| `pnpm seed:schema`        | Crea todas las tablas                |
| `pnpm seed:all`           | Ejecuta todos los seeders en orden   |
| `pnpm seed:tiempo`        | Solo d_tiempo                        |
| `pnpm seed:cliente`       | Solo d_cliente                       |
| `pnpm seed:ubicacion`     | Solo d_ubicacion                     |
| `pnpm seed:empleado`      | Solo d_empleado                      |
| `pnpm seed:concesionaria` | Solo d_concesionaria                 |
| `pnpm seed:estado`        | Solo d_estado_venta                  |
| `pnpm seed:vehiculo`      | Solo d_vehiculo                      |
| `pnpm seed:hventa`        | Solo h_venta                         |

---

## 🔌 Conectar Power Pivot a MySQL

1. Abrir Excel → pestaña **Power Pivot** → **Administrar**
2. Click en **Obtener datos externos** → **De otras fuentes** → **MySQL**
3. Ingresar:
   - Servidor: `localhost`
   - Puerto: `3306`
   - Base de datos: `autobi_star`
   - Usuario: `autobi_user`
   - Contraseña: `autobi_pass`
4. Importar las 8 tablas
5. Crear las relaciones desde `h_venta` hacia cada dimensión

---

## 📁 Estructura del proyecto

```
autobi/
├── src/
│   ├── config.ts              # Pool de conexión MySQL
│   ├── cleaner.ts             # Limpia la BD
│   ├── schema.seed.ts         # Crea las tablas
│   ├── manager.seed.ts        # Orquesta todos los seeders
│   └── entities/
│       ├── d_tiempo.seed.ts
│       ├── d_cliente.seed.ts
│       ├── d_ubicacion.seed.ts
│       ├── d_empleado.seed.ts
│       ├── d_concesionaria.seed.ts
│       ├── d_estado_venta.seed.ts
│       ├── d_vehiculo.seed.ts
│       └── h_venta.seed.ts
├── docker-compose.yml
├── .env.example
├── tsconfig.json
├── package.json
└── README.md
```
