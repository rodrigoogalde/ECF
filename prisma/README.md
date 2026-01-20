# Prisma - Guía de Comandos

Esta guía explica el flujo correcto para trabajar con Prisma, migraciones y base de datos en este proyecto.

## � Flujo de Trabajo con Migraciones (RECOMENDADO)

### Cuando modificas el schema de Prisma:

```bash
# 1. Edita prisma/schema.prisma con tus cambios

# 2. Crea y aplica la migración
npx prisma migrate dev --create-only
npx prisma migrate dev

# 4. (Opcional) Ejecutar seed si necesitas datos de prueba
npx tsx prisma/seed.ts
```

**¿Qué hace `prisma migrate dev`?**
- ✅ Crea un archivo de migración SQL en `prisma/migrations/`
- ✅ Aplica la migración a tu base de datos de desarrollo
- ✅ Genera automáticamente el cliente de Prisma
- ✅ Mantiene un historial versionado de cambios
- ✅ Es seguro para producción (no pierde datos)

### Para producción/deploy:

```bash
# Aplica todas las migraciones pendientes
npx prisma migrate deploy
```

## 🔍 Verificar Estado de Migraciones

### Verificar si hay migraciones pendientes:
```bash
npx prisma migrate status
```

**Salidas posibles:**
- ✅ `Database schema is up to date!` - Todo está sincronizado
- ⚠️ `Following migrations have not yet been applied` - Hay migraciones pendientes
- ❌ `Database schema is not in sync` - Hay drift (cambios manuales en la DB)

### Validar el schema de Prisma:
```bash
npx prisma validate
```
Verifica que tu `schema.prisma` sea sintácticamente correcto.

### Formatear el schema:
```bash
npx prisma format
```
Formatea automáticamente tu archivo `schema.prisma`.

## 🔄 Flujo Alternativo: db push (Solo Desarrollo Rápido)

**⚠️ NO recomendado para producción**

Cuando necesites iterar rápidamente sin crear migraciones:

```bash
# 1. Sincronizar schema con la base de datos
npx prisma db push

# 2. Generar cliente de Prisma
npx prisma generate

# 3. (Opcional) Ejecutar seed
npx tsx prisma/seed.ts
```

**Diferencias con migrate dev:**
- ❌ No crea archivos de migración
- ❌ No mantiene historial
- ⚠️ Puede causar pérdida de datos
- ✅ Más rápido para prototipos

## 📝 Comandos de Verificación e Integridad

### Verificar estado de migraciones
```bash
npx prisma migrate status
```
**Úsalo para:**
- ✅ Verificar si todas las migraciones están aplicadas
- ✅ Detectar migraciones pendientes antes de hacer deploy
- ✅ Identificar drift en la base de datos

### Validar schema
```bash
npx prisma validate
```
Verifica sintaxis y relaciones en `schema.prisma`.

### Formatear schema
```bash
npx prisma format
```
Formatea automáticamente el archivo de schema.

### Ver el estado de la base de datos
```bash
npx prisma studio
```
Abre una interfaz web para explorar y editar datos.

## 🛠️ Comandos Adicionales

### Introspeccionar la base de datos
```bash
npx prisma db pull
```
**⚠️ Cuidado**: Sobrescribe tu `schema.prisma` con el estado actual de la base de datos.

### Ejecutar una migración SQL personalizada
```bash
npx prisma db execute --file prisma/migrations/[nombre_carpeta]/migration.sql
```
Ejecuta un archivo SQL directamente en la base de datos.

### Resetear la base de datos (desarrollo)
```bash
npx prisma migrate reset
```
**⚠️ Peligroso**: 
- Elimina todos los datos
- Recrea la base de datos desde cero
- Aplica todas las migraciones en orden
- Ejecuta el seed automáticamente

### Resolver conflictos de migraciones
```bash
# Marcar una migración como aplicada (sin ejecutarla)
npx prisma migrate resolve --applied [nombre_migracion]

# Marcar una migración como revertida
npx prisma migrate resolve --rolled-back [nombre_migracion]
```

## 🎯 Casos de Uso Comunes

### Agregar un nuevo campo a un modelo existente
```bash
# 1. Edita schema.prisma y agrega el campo
# 2. Crea y aplica la migración
npx prisma migrate dev --name add_campo_a_modelo
# 3. El cliente se genera automáticamente
```

### Crear un nuevo modelo
```bash
# 1. Agrega el modelo en schema.prisma
# 2. Crea y aplica la migración
npx prisma migrate dev --name create_nuevo_modelo
# 3. Actualiza seed.ts si necesitas datos de prueba
npx tsx prisma/seed.ts
```

### Cambiar una relación entre modelos
```bash
# 1. Modifica las relaciones en schema.prisma
# 2. Crea y aplica la migración
npx prisma migrate dev --name update_relacion_modelo_a_modelo_b
# 3. Actualiza el código que usa esa relación
# 4. Actualiza seed.ts si es necesario
npx tsx prisma/seed.ts
```

### Verificar integridad antes de hacer deploy
```bash
# 1. Verificar que el schema sea válido
npx prisma validate

# 2. Verificar estado de migraciones
npx prisma migrate status

# 3. Si todo está OK, hacer deploy
npx prisma migrate deploy
```

### Después de hacer pull de cambios del repositorio
```bash
# 1. Aplicar migraciones nuevas
npx prisma migrate dev

# 2. Regenerar cliente (por si acaso)
npx prisma generate

# 3. Verificar estado
npx prisma migrate status
```

## ⚙️ Configuración del Proyecto

Este proyecto usa:
- **Adaptador**: `@prisma/adapter-pg` para PostgreSQL
- **Base de datos**: Neon (PostgreSQL serverless)
- **Variables de entorno**:
  - `DATABASE_URL_UNPOOLED` o `DIRECT_URL` para seeds/migraciones
  - `DATABASE_URL` para la aplicación (pooled)

## 🔍 Solución de Problemas

### Error: "The table does not exist"
```bash
# Aplicar migraciones pendientes
npx prisma migrate dev
```

### Error: "P3005 - Database schema is not empty"
Si intentas crear migraciones en una base de datos existente:
```bash
# Opción 1: Marca el estado actual como baseline
npx prisma migrate resolve --applied [nombre_migracion]

# Opción 2: Usa db push para desarrollo
npx prisma db push
```

### Migraciones pendientes después de pull
```bash
# Aplicar todas las migraciones
npx prisma migrate dev
```

### El cliente de Prisma no reconoce los cambios
```bash
npx prisma generate
# Luego reinicia tu IDE/TypeScript server
```

### Los tipos TypeScript están desactualizados
```bash
npx prisma generate
# Reinicia el TypeScript server en VS Code: Cmd/Ctrl + Shift + P > "Restart TS Server"
```

### Drift detectado (cambios manuales en la DB)
```bash
# Ver qué cambió
npx prisma migrate status

# Opción 1: Crear migración para sincronizar
npx prisma migrate dev --name fix_drift

# Opción 2: Resetear y reaplicar todo (⚠️ pierde datos)
npx prisma migrate reset
```

### Verificar integridad completa del sistema
```bash
# 1. Validar schema
npx prisma validate

# 2. Formatear schema
npx prisma format

# 3. Verificar migraciones
npx prisma migrate status

# 4. Regenerar cliente
npx prisma generate
```

## 📚 Recursos

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma CLI Reference](https://www.prisma.io/docs/reference/api-reference/command-reference)
