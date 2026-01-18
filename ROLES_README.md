# Sistema de Roles - Documentación

## Descripción General

Este proyecto implementa un sistema de autenticación con dos tipos de usuarios:
- **ADMIN**: Acceso completo al sistema
- **STUDENT**: Acceso limitado a funcionalidades de estudiante

## Componentes Implementados

### 1. Base de Datos (Prisma)

El modelo `User` incluye un campo `role` con valores:
```prisma
enum UserRole {
  ADMIN
  STUDENT
}

model User {
  role UserRole @default(STUDENT)
  // ... otros campos
}
```

Por defecto, todos los usuarios nuevos son **STUDENT**.

### 2. Proxy (`src/proxy.ts`)

Protege rutas automáticamente:
- `/admin/*` - Solo accesible para usuarios con rol ADMIN
- `/student/*` - Accesible para STUDENT y ADMIN

Si un usuario no autenticado intenta acceder, es redirigido a login.
Si un usuario sin permisos intenta acceder, es redirigido a `/unauthorized`.

**Nota**: Next.js ha deprecado `middleware.ts` en favor de `proxy.ts` para clarificar su propósito como proxy de red.

### 3. Utilidades de Autenticación (`src/lib/utils/auth-utils.ts`)

Funciones helper para proteger páginas:

```typescript
// Requiere autenticación
const session = await requireAuth();

// Requiere rol de admin
const session = await requireAdmin();

// Requiere un rol específico
import { ROLE } from "@/lib/constants/roles";
const session = await requireRole(ROLE.STUDENT);

// Verificar roles
isAdmin(role);
isStudent(role);
hasRole(userRole, requiredRole);
```

### 4. Configuración NextAuth

NextAuth está configurado para incluir el `role` en:
- JWT token
- Session object

Accede al rol del usuario: `session.user.role`

### 5. Constantes ROLE (`src/lib/constants/roles.ts`)

Enum de constantes para evitar strings literales:

```typescript
export const ROLE = {
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
} as const;
```

**Siempre usa `ROLE.ADMIN` o `ROLE.STUDENT` en lugar de strings literales.**

## Uso en Páginas

### Página protegida para Admin

```typescript
// src/app/admin/dashboard/page.tsx
import { requireAdmin } from "@/lib/utils/auth-utils";
import { ROLE } from "@/lib/constants/roles";

export default async function AdminDashboard() {
  const session = await requireAdmin();
  
  return (
    <div>
      <h1>Panel Admin</h1>
      <p>Usuario: {session.user.name}</p>
      <p>Rol: {session.user.role}</p>
    </div>
  );
}
```

### Página protegida para Estudiante

```typescript
// src/app/student/cursos/page.tsx
import { requireRole } from "@/lib/utils/auth-utils";
import { ROLE } from "@/lib/constants/roles";

export default async function CursosPage() {
  const session = await requireRole(ROLE.STUDENT);
  
  return (
    <div>
      <h1>Mis Cursos</h1>
      <p>Usuario: {session.user.name}</p>
    </div>
  );
}
```

### Verificación condicional en componentes

```typescript
"use client";
import { useSession } from "@/lib/auth-client";
import { ROLE } from "@/lib/constants/roles";

export function MyComponent() {
  const { data: session } = useSession();
  
  if (session?.user.role === ROLE.ADMIN) {
    return <AdminView />;
  }
  
  return <StudentView />;
}
```

### Uso del componente RoleGuard

```typescript
import { RoleGuard } from "@/components/RoleGuard";
import { ROLE } from "@/lib/constants/roles";

export function MyPage() {
  return (
    <div>
      <h1>Página Pública</h1>
      
      <RoleGuard 
        allowedRoles={[ROLE.ADMIN]} 
        fallback={<p>Solo administradores</p>}
      >
        <AdminPanel />
      </RoleGuard>
      
      <RoleGuard 
        allowedRoles={[ROLE.STUDENT, ROLE.ADMIN]}
      >
        <StudentContent />
      </RoleGuard>
    </div>
  );
}
```

## Cambiar el Rol de un Usuario

### Opción 1: Directamente en la base de datos

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'usuario@ejemplo.com';
```

### Opción 2: Crear una página de administración

```typescript
// src/app/admin/users/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/auth-utils";

export default async function UsersManagement() {
  await requireAdmin();
  
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true }
  });
  
  // Renderizar lista de usuarios con opción de cambiar rol
}
```

### Opción 3: Server Action

```typescript
// src/app/actions/user-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/auth-utils";
import { UserRole } from "@prisma/client";

export async function updateUserRole(userId: string, newRole: UserRole) {
  await requireAdmin();
  
  return await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });
}
```

## Rutas Disponibles

- `/admin` - Panel de administrador (solo ADMIN)
- `/student` - Portal del estudiante (STUDENT y ADMIN)
- `/unauthorized` - Página de acceso denegado

## Notas Importantes

1. **Los admins tienen acceso a todo**: Un usuario con rol ADMIN puede acceder tanto a rutas `/admin` como `/student`.

2. **Uso de constantes ROLE**: Siempre usa el enum `ROLE` importado de `@/lib/constants/roles` en lugar de strings literales como `"ADMIN"` o `"STUDENT"`.

3. **Sesión JWT**: El rol se almacena en el JWT, por lo que después de cambiar el rol de un usuario, debe cerrar sesión y volver a iniciar para que el cambio surta efecto.

4. **Primer usuario admin**: Debes crear manualmente el primer usuario admin en la base de datos después del primer login.

5. **Proxy automático**: No necesitas verificar permisos manualmente en rutas que coincidan con el matcher del proxy. El proxy intercepta las peticiones antes de que lleguen a las páginas.

## Ejemplo Completo: Crear Primer Admin

1. Inicia sesión con tu cuenta
2. Ejecuta en la base de datos:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'tu-email@ejemplo.com';
```
3. Cierra sesión y vuelve a iniciar
4. Ahora tienes acceso a `/admin`
