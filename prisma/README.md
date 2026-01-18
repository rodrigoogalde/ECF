# Prisma - Guía de Comandos

Esta guía explica el orden correcto de comandos para trabajar con Prisma en este proyecto.

## 📋 Orden de Comandos

### 1. Modificar el Schema
Primero, edita el archivo `prisma/schema.prisma` con los cambios necesarios en tus modelos.

### 2. Sincronizar con la Base de Datos
Después de modificar el schema, sincroniza los cambios con la base de datos:

```bash
npx prisma db push
```

**¿Qué hace?**
- Aplica los cambios del schema directamente a la base de datos
- Útil para desarrollo rápido sin crear archivos de migración
- **Advertencia**: Puede causar pérdida de datos en producción

### 3. Generar el Cliente de Prisma
Genera/actualiza el cliente de Prisma con los nuevos tipos:

```bash
npx prisma generate
```

**¿Qué hace?**
- Genera el cliente de Prisma en `src/generated/prisma`
- Actualiza los tipos TypeScript para que coincidan con tu schema
- **Importante**: Siempre ejecuta esto después de cambiar el schema

### 4. Ejecutar el Seed
Pobla la base de datos con datos iniciales:

```bash
npx tsx prisma/seed.ts
```

**¿Qué hace?**
- Ejecuta el script de seed para insertar datos de prueba
- Usa `upsert` para evitar duplicados
- Crea usuarios y actividades con sus itinerarios

## 🔄 Flujo Completo

Cuando hagas cambios en los modelos, ejecuta estos comandos en orden:

```bash
# 1. Sincronizar schema con la base de datos
npx prisma db push

# 2. Generar cliente de Prisma
npx prisma generate

# 3. (Opcional) Ejecutar seed si necesitas datos de prueba
npx tsx prisma/seed.ts
```

## 📝 Comandos Adicionales Útiles

### Ver el estado de la base de datos
```bash
npx prisma studio
```
Abre una interfaz web para explorar y editar datos.

### Introspeccionar la base de datos
```bash
npx prisma db pull
```
**⚠️ Cuidado**: Sobrescribe tu `schema.prisma` con el estado actual de la base de datos.

### Crear una migración (para producción)
```bash
npx prisma migrate dev --name nombre_descriptivo
```
Crea archivos de migración versionados (mejor para producción).

### Aplicar migraciones en producción
```bash
npx prisma migrate deploy
```

### Resetear la base de datos
```bash
npx prisma migrate reset
```
**⚠️ Peligroso**: Elimina todos los datos y recrea la base de datos.

## 🎯 Casos de Uso Comunes

### Agregar un nuevo campo a un modelo existente
1. Edita `schema.prisma` y agrega el campo
2. `npx prisma db push`
3. `npx prisma generate`

### Crear un nuevo modelo
1. Agrega el modelo en `schema.prisma`
2. `npx prisma db push`
3. `npx prisma generate`
4. Actualiza `seed.ts` si necesitas datos de prueba
5. `npx tsx prisma/seed.ts`

### Cambiar una relación entre modelos
1. Modifica las relaciones en `schema.prisma`
2. `npx prisma db push`
3. `npx prisma generate`
4. Actualiza el código que usa esa relación
5. Actualiza `seed.ts` si es necesario
6. `npx tsx prisma/seed.ts`

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
npx prisma db push
npx prisma generate
```

### Error: "P3005 - Database schema is not empty"
Si intentas crear migraciones en una base de datos existente:
```bash
# Usa db push en su lugar
npx prisma db push
```

### El cliente de Prisma no reconoce los cambios
```bash
npx prisma generate
```

### Los tipos TypeScript están desactualizados
```bash
npx prisma generate
# Luego reinicia tu IDE/TypeScript server
```

## 📚 Recursos

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma CLI Reference](https://www.prisma.io/docs/reference/api-reference/command-reference)
