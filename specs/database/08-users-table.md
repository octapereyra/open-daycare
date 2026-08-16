# SPEC 08 — Users table and authentication enums

> **Status:** Implementado
> **Depends on:** SPEC 07 — Daycares table
> **Date:** 2026-08-16
> **Objective:** Crear la tabla `users` con sus enums, vínculo obligatorio a `daycares`, sincronización segura con Supabase Auth y un usuario `staff` real para pruebas.

## Scope

**In:**

- Crear los enums `user_role` y `user_status` con los valores definidos por el esquema de referencia.
- Crear `public.users` vinculada uno-a-muchos con `public.daycares` mediante `daycare_id NOT NULL`.
- Vincular `public.users.id` con `auth.users.id` usando la misma UUID y `ON DELETE CASCADE`.
- Crear un trigger `AFTER INSERT` sobre `auth.users` para generar automáticamente el perfil de dominio.
- Leer `role` y `daycare_id` desde `raw_app_meta_data`, que solo puede configurar un proceso server-side confiable.
- Rechazar la creación de Auth cuando falten o sean inválidos `role`, `daycare_id` o `full_name`.
- Habilitar RLS en `public.users`.
- Permitir que cada usuario autenticado lea su propio perfil.
- Permitir que `staff` y `admin` lean los perfiles de su misma guardería.
- Bloquear INSERT, UPDATE y DELETE desde clientes mediante la ausencia de políticas de escritura.
- Provisionar un usuario real `staff` en Supabase Auth, vinculado a `Guardería Sala Soles`, sin guardar credenciales en el repositorio.
- Aplicar y verificar las migraciones en Supabase.

**Out of scope (for future specs):**

- Crear enums no usados por `users`: `relationship_type`, `invitation_status`, `post_type` y `child_status`.
- Crear `rooms`, `children`, `parent_children`, `invitations` u otras tablas del esquema.
- Implementar el flujo de signup, login, invitaciones o activación de cuentas.
- Implementar la UI de usuarios o un CRUD de perfiles.
- Permitir que los clientes creen o modifiquen roles, estados o pertenencia a una guardería.
- Guardar `email` o `password_hash` en `public.users`; esos datos siguen en `auth.users`.
- Migrar los mocks existentes a datos reales.

## Data model

### Enums

```sql
CREATE TYPE public.user_role AS ENUM ('staff', 'parent', 'admin');

CREATE TYPE public.user_status AS ENUM ('pending', 'active');
```

Los valores persistidos son en inglés. Las etiquetas visibles se traducirán en la UI de una spec futura.

### Users table

```sql
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daycare_id uuid NOT NULL REFERENCES public.daycares(id),
  role public.user_role NOT NULL,
  status public.user_status NOT NULL DEFAULT 'active',
  full_name text NOT NULL,
  avatar_url text,
  notify_on_post boolean NOT NULL DEFAULT true,
  daily_summary_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

La relación es `daycares 1 ──< users`: cada usuario pertenece exactamente a una guardería y una guardería puede tener muchos usuarios.

### Auth profile trigger

El trigger se ejecutará después de insertar en `auth.users` y llamará una función `SECURITY DEFINER` con `SET search_path = ''`. La función vivirá en un schema privado y usará nombres completamente calificados.

El contrato de metadatos es:

```json
{
  "raw_app_meta_data": {
    "role": "staff",
    "daycare_id": "<uuid-de-guarderia>"
  },
  "raw_user_meta_data": {
    "full_name": "Nombre del usuario",
    "avatar_url": null
  }
}
```

El trigger debe:

- Validar que `role` sea uno de los valores de `user_role`.
- Validar que `daycare_id` sea una UUID existente en `public.daycares`.
- Validar que `full_name` exista y no sea solo espacios.
- Insertar el perfil usando `NEW.id` como `public.users.id`.
- Usar el valor por defecto `active` para `status`.
- Copiar `avatar_url` cuando esté presente.
- Lanzar una excepción y abortar el signup si falla cualquier validación.

### RLS

La tabla tendrá dos políticas de lectura para el rol `authenticated`:

```sql
CREATE POLICY "users_read_own"
ON public.users
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id);

CREATE POLICY "users_read_same_daycare_staff"
ON public.users
FOR SELECT
TO authenticated
USING ((SELECT private.can_read_daycare_users(daycare_id)));
```

`private.can_read_daycare_users` será una función `SECURITY DEFINER` que consultará el perfil del usuario actual y devolverá `true` únicamente cuando su rol sea `staff` o `admin` y su `daycare_id` coincida con la fila consultada. La función evitará la recursión de RLS y no se expondrá públicamente.

No se crearán políticas de INSERT, UPDATE ni DELETE para clientes. El trigger podrá insertar el perfil porque se ejecutará con privilegios del owner de la función.

### Staff de prueba

El usuario de prueba se creará mediante Supabase Auth Admin API desde un entorno confiable, con credenciales proporcionadas por variables seguras y nunca incluidas en una migración o commit.

La creación debe configurar:

- Email y password reales mediante variables fuera del repositorio.
- `email_confirm: true` para permitir el acceso durante la prueba.
- `user_metadata.full_name` con el nombre del staff.
- `app_metadata.role: "staff"`.
- `app_metadata.daycare_id` con el UUID de `Guardería Sala Soles`.

El trigger debe crear automáticamente la fila correspondiente en `public.users`.

## Implementation plan

1. Crear `supabase/migrations/002_create_user_enums_and_table.sql` con `user_role`, `user_status`, `public.users`, sus claves foráneas, defaults y RLS habilitado.
2. Aplicar la migración 002 y verificar que los enums, las columnas, la FK hacia `auth.users` y la FK obligatoria hacia `daycares` existan.
3. Crear `supabase/migrations/003_create_user_auth_trigger.sql` con el schema privado, la función `SECURITY DEFINER` y el trigger `AFTER INSERT` sobre `auth.users`.
4. Aplicar la migración 003 y verificar que un Auth user con metadatos incompletos o inválidos sea rechazado sin crear un perfil parcial.
5. Crear `supabase/migrations/004_create_user_read_policies.sql` con la función privada de autorización por guardería y las dos políticas de lectura.
6. Aplicar la migración 004 y verificar el acceso propio, el acceso de `staff`/`admin` dentro de la misma guardería y el aislamiento entre guarderías.
7. Provisionar un usuario real `staff` de prueba mediante Auth Admin API, usando `Guardería Sala Soles` y credenciales fuera del repositorio.
8. Consultar Auth y `public.users` para confirmar que el UUID coincide, el rol es `staff`, el estado es `active` y no se almacenan email ni password en `public.users`.

## Acceptance criteria

- [x] Existe el enum `public.user_role` con exactamente `staff`, `parent` y `admin`.
- [x] Existe el enum `public.user_status` con exactamente `pending` y `active`.
- [x] Existe `public.users` con las columnas `id`, `daycare_id`, `role`, `status`, `full_name`, `avatar_url`, `notify_on_post`, `daily_summary_enabled`, `created_at` y `updated_at`.
- [x] `public.users.id` es PK y FK a `auth.users(id)` con `ON DELETE CASCADE`.
- [x] `public.users.daycare_id` es `NOT NULL` y FK a `public.daycares(id)`.
- [x] `role` es obligatorio y usa `public.user_role`.
- [x] `status` es obligatorio, usa `public.user_status` y su default es `active`.
- [x] `full_name` es obligatorio.
- [x] `avatar_url` acepta NULL.
- [x] `notify_on_post` tiene default `true`.
- [x] `daily_summary_enabled` tiene default `true`.
- [x] RLS está habilitado en `public.users`.
- [x] El trigger `AFTER INSERT` sobre `auth.users` existe y crea el perfil con el mismo UUID.
- [x] El trigger obtiene `role` y `daycare_id` desde `raw_app_meta_data`, no desde `raw_user_meta_data`.
- [x] La función del trigger usa `SECURITY DEFINER`, `SET search_path = ''` y referencias calificadas.
- [x] Un signup sin `role`, `daycare_id` o `full_name` válido es rechazado.
- [x] Un usuario autenticado puede leer su propia fila.
- [x] Un usuario con rol `staff` o `admin` puede leer usuarios de su misma guardería.
- [x] Un usuario con rol `staff` o `admin` no puede leer usuarios de otra guardería.
- [x] Un usuario con rol `parent` no puede leer perfiles ajenos.
- [x] Los clientes no pueden insertar, actualizar ni borrar filas de `public.users`.
- [x] Existe un usuario real `staff` en Supabase Auth vinculado a `Guardería Sala Soles`.
- [x] La fila de prueba fue creada automáticamente en `public.users` por el trigger.
- [x] La fila de prueba tiene `role = 'staff'` y `status = 'active'`.
- [x] El email y el password no están duplicados en `public.users`.
- [x] Las migraciones 002, 003 y 004 se aplicaron sin errores.

## Decisions

- **Yes:** Crear únicamente `user_role` y `user_status`. Los demás enums pertenecen a tablas futuras.
- **Yes:** Hacer `daycare_id NOT NULL`. Todo usuario de la aplicación debe pertenecer a una guardería.
- **Yes:** Usar el UUID de `auth.users` como PK de `public.users`. Evita duplicar identidades.
- **Yes:** Crear el perfil mediante un trigger `AFTER INSERT`. Mantiene sincronizados Auth y el modelo de dominio.
- **Yes:** Leer autorización desde `raw_app_meta_data`. Supabase lo protege de cambios realizados por el usuario final.
- **Yes:** Rechazar el signup cuando falten metadatos obligatorios. Es preferible fallar cerrado a crear perfiles inválidos.
- **Yes:** Encapsular funciones privilegiadas en un schema privado con `SECURITY DEFINER` y `SET search_path = ''`.
- **Yes:** Permitir lectura propia y lectura de la misma guardería para `staff`/`admin`.
- **Yes:** Bloquear escrituras desde clientes. La creación inicial queda a cargo del trigger y los cambios futuros requerirán operaciones server-side.
- **Yes:** Crear un usuario `staff` real mediante Auth Admin API. Permite probar la integración real sin insertar filas artificiales.
- **Yes:** Asociar el usuario de prueba a `Guardería Sala Soles`, que ya existe como dato semilla de SPEC 07.
- **No:** Usar `raw_user_meta_data` para roles o pertenencia. Es editable por el usuario y no es una fuente segura de autorización.
- **No:** Insertar directamente en `auth.users` desde una migración. Las credenciales y el ciclo de vida deben seguir el mecanismo de Auth.
- **No:** Guardar email o password en `public.users`. Supabase Auth ya es la fuente de esos datos.
- **No:** Crear políticas de lectura pública. Los perfiles contienen información privada.

## Risks

| Risk | Mitigation |
| --- | --- |
| Un error del trigger puede bloquear signups. | Aplicar primero las migraciones y probar metadata válida e inválida antes de provisionar el staff. |
| Un signup normal sin `app_metadata` será rechazado. | Provisionar roles y guarderías desde un backend o Admin API confiable; el signup público de padres se definirá en otra spec. |
| Una política que consulte `public.users` directamente puede entrar en recursión RLS. | Usar `private.can_read_daycare_users` como función `SECURITY DEFINER` no expuesta. |
| El staff de prueba requiere credenciales sensibles. | Leer email y password desde variables seguras y no incluirlos en SQL, specs, logs ni commits. |
| El UUID de `Guardería Sala Soles` puede variar entre entornos. | Resolver el UUID por nombre en el entorno de prueba antes de llamar a Auth Admin API; no hardcodear IDs generados. |

## What is **not** in this spec

- Los enums `relationship_type`, `invitation_status`, `post_type` y `child_status`.
- Las tablas `rooms`, `children`, `parent_children`, `invitations` y las demás tablas relacionadas.
- El flujo de signup, login, invitaciones y activación de cuentas.
- La UI o el CRUD de usuarios.
- La edición de roles, estados o pertenencia a guarderías desde el cliente.
- La duplicación de email o password en `public.users`.
- La migración de mocks a Supabase.

Cada uno de esos temas, si llega, va en su propia spec.
