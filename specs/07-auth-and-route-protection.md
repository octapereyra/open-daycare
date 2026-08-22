# SPEC 07 — Autenticación real y protección de rutas (Supabase Auth email + password)

> **Estado:** Aprobado
> **Depende de:** SPEC 01 (home-feed) — reutiliza el layout del home y el sidebar; SPEC 03 (login-and-activate) — reutiliza `/login` y `/activate` ya maquetados
> **Fecha:** 2026-08-22
> **Objetivo:** Conectar el formulario de `/login` con Supabase Auth (`signInWithPassword`), proteger todas las rutas excepto `/login` y `/activate` mediante redirect en el proxy más check en páginas servidoras, redirigir usuarios autenticados desde `/login` al home, mostrar error ante credenciales inválidas e implementar logout real desde el sidebar.

## Scope

**In:**

- Lógica de redirect en `proxy.ts`: usando el client SSR existente (`utils/supabase/middleware.ts`) con `supabase.auth.getClaims()`:
  - Si no hay claims y la ruta no es pública (`/login`, `/activate`) → redirect a `/login`.
  - Si hay claims y la ruta es `/login` → redirect a `/`.
  - `/activate` sigue siendo pública (sin lógica de activación, queda accesible).
- Formulario de login funcional:
  - Nuevo componente cliente `components/auth/LoginForm.tsx` con estado para email, password, error y loading.
  - Llamada a `signInWithPassword({ email, password })` vía browser client (`utils/supabase/client.ts`).
  - Login exitoso → `router.push('/')` + `router.refresh()`.
  - Credenciales inválidas → mensaje visible `Email o contraseña incorrectos` bajo el formulario.
  - Botón deshabilitado mientras hay una petición en curso (estado loading).
- Integración en `app/(auth)/login/page.tsx`: se reemplazan los inputs estáticos por `<LoginForm>` manteniendo el diseño pixel-perfect actual.
- Defensa en profundidad: check server-side en páginas protegidas (`app/page.tsx` y las rutas de niños) que llama `getClaims()` y hace `redirect('/login')` si no hay sesión, además del proxy.
- Logout real:
  - Server Action `signOutAction` en `app/actions/auth.ts`: `supabase.auth.signOut()` + `redirect('/login')`.
  - El botón "Cerrar sesión" del sidebar deja de ser un `<Link href="#">` y pasa a ser un `<form action={signOutAction}>` con `<button>` que mantiene el estilo actual.
- Usuario de prueba: crear en Supabase Auth un usuario staff confirmado usando `STAFF_EMAIL` / `STAFF_PASSWORD` de `.env.local`, para poder probar login/logout end to end.

**Out of scope (para specs futuras):**

- Flujo real de activación de cuenta (`/activate`): código de invitación, creación de password, checkbox de autorización. Queda como pantalla pública estática.
- Roles y redirección según rol (staff vs familia): requiere la tabla `users` del schema, que aún no existe en Supabase.
- "¿Olvidaste tu contraseña?" (reset password).
- Tabla `users`, triggers sobre `auth.users`, RLS.
- Persistencia o datos reales detrás del feed y las demás pantallas.
- Las demás pantallas del catálogo.

## Data model

No introduce datos nuevos. La autenticación vive completamente en Supabase Auth (`auth.users`, sesiones via cookies); no se crean tablas ni columnas en la base de datos pública. Los datos de dominio (perfiles, roles) quedan fuera de esta spec.

## Implementation plan

1. **Redirect en el proxy.** Modificar `utils/supabase/middleware.ts` (o `proxy.ts`) para que después de `getClaims()`:
   - Definir rutas públicas: pathname empieza con `/login` o `/activate`.
   - Sin claims + ruta protegida → `NextResponse.redirect(new URL('/login', request.url))`.
   - Con claims + ruta `/login` → redirect a `/`.
   - Devolver siempre el `supabaseResponse` original sin tocar cookies (requisito de `@supabase/ssr`).
   - _Prueba: sin sesión, `/` redirige a `/login`; con sesión, `/login` redirige a `/`._

2. **Componente `LoginForm`.** Crear `components/auth/LoginForm.tsx` (client component):
   - Inputs controlados de email y password con los estilos actuales de la página.
   - Al submit: `signInWithPassword` desde `utils/supabase/client.ts`; si `error` → setear mensaje `Email o contraseña incorrectos`; si ok → `router.push('/')` + `router.refresh()`.
   - Estado loading: botón muestra feedback y se deshabilita.
   - Mensaje de error con color accent/rojo debajo del formulario.
   - _Prueba: credenciales inválidas muestran el error; válidas navegan al home._

3. **Integrar en la página de login.** Actualizar `app/(auth)/login/page.tsx`: reemplazar inputs estáticos, link forgot password (sigue visual) y botón por `<LoginForm />`, conservando el layout de dos columnas intacto.
   - _Prueba: comparar visualmente contra `references/pantallas/login.dc.html`._

4. **Check server-side en páginas protegidas.** Agregar helper `getUserClaims()` (o equivalente) en `utils/supabase/server.ts` y usarlo en `app/page.tsx` y las páginas de `app/kids/**`: si no hay claims → `redirect('/login')`.
   - _Prueba: borrar cookies de sesión y recargar `/` → redirect a `/login` aunque el proxy no actúe._

5. **Logout.**
   - Crear `app/actions/auth.ts` con `'use server'` y `signOutAction()`: client server (`utils/supabase/server.ts`) → `auth.signOut()` → `redirect('/login')`.
   - En `components/shared/Sidebar.tsx`: cambiar el `<Link href="#">` de logout por `<form action={signOutAction}>` + `<button>` con los mismos estilos e ícono.
   - _Prueba: click en cerrar sesión → vuelve a `/login`; intentar volver a `/` redirige a `/login`._

6. **Usuario de prueba en Supabase Auth.** Crear usuario staff confirmado (email confirmation completada) con los valores de `STAFF_EMAIL` / `STAFF_PASSWORD` de `.env.local`, vía dashboard de Supabase o Admin API.
   - _Prueba: login manual con esas credenciales funciona._

7. **Ensamblar y verificar.** Recorrer el flujo completo: visitante anónimo → `/login` → login válido → home → logout → `/login`. Verificar redirects de `/kids` sin sesión y de `/login` con sesión. Ejecutar `npm run lint` y `npx tsc --noEmit`.

## Acceptance criteria

- [ ] Un usuario sin sesión que visita `/` es redirigido a `/login`.
- [ ] Un usuario sin sesión que visita `/kids` (y subrutas) es redirigido a `/login`.
- [ ] `/login` y `/activate` son accesibles sin sesión.
- [ ] Login con email y password válidos navega al home `/` y muestra el feed con sidebar.
- [ ] Login con credenciales inválidas NO navega y muestra el mensaje `Email o contraseña incorrectos`.
- [ ] El botón `Iniciar sesión` se deshabilita mientras la petición está en curso.
- [ ] Un usuario con sesión que visita `/login` es redirigido a `/`.
- [ ] El botón "Cerrar sesión" del sidebar cierra la sesión real y redirige a `/login`.
- [ ] Después del logout, visitar `/` redirige a `/login`.
- [ ] El diseño de `/login` se mantiene igual al calco de `login.dc.html`.
- [ ] La sesión sobrevive recargas de página (cookies sincronizadas por el proxy).
- [ ] `npm run lint` pasa sin errores.
- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] No hay errores en la consola del navegador durante el flujo completo.

## Decisions

- **Sí:** Protección a dos niveles — redirect en el proxy (rápido, cubre todas las rutas) + check server-side en cada página protegida (defensa en profundidad; el middleware no es barrera absoluta). Patrón recomendado por la documentación actual de Supabase para App Router.
- **Sí:** `getClaims()` en lugar de `getUser()` en el proxy, consistente con la implementación existente de `utils/supabase/middleware.ts` y la recomendación vigente de Supabase.
- **Sí:** Login desde client component con browser client (`signInWithPassword`). Más simple que Server Action para este caso; las cookies las sincroniza el browser client y el proxy refresca sesiones.
- **Sí:** Logout vía Server Action (`signOut` + `redirect`). Permite limpiar cookies server-side antes de navegar.
- **Sí:** Mensaje genérico `Email o contraseña incorrectos` sin distinguir email inexistente de password errónea. Buena práctica anti-enumeración.
- **Sí:** Solo autenticación básica, sin roles. La tabla `users` del schema no existe todavía en Supabase; roles van en spec futura.
- **No:** Implementar activación de cuenta ni reset password. Fuera de alcance, confirmado por el usuario.
- **Nota:** Definición rápida sin revisión sección por sección — el usuario pidió generar el archivo completo de una sola vez tras aprobar el header.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| Email confirmation habilitado en el proyecto Supabase puede bloquear el login del usuario de prueba | Crear el usuario ya confirmado (Admin API con `email_confirm: true` o dashboard), no con signup público. |
| Tocar cookies dentro del proxy rompe la sincronización de sesión | Devolver siempre el `supabaseResponse` original tal como exige `@supabase/ssr`; nunca recrear la respuesta. |
| El check server-side duplicado (proxy + página) puede causar loops de redirect | El redirect de página solo dispara si no hay claims; `/login` está excluido de protección. Probar el flujo completo. |
| El sidebar es client component y usa Server Action | Los form actions con server actions importadas funcionan en client components sin cambios extra. |

## What is **not** in this spec

- Activación de cuenta real (código de invitación, creación de password).
- Roles (staff vs familia) y navegación por rol.
- "¿Olvidaste tu contraseña?".
- Tabla `users`, triggers, RLS, datos de dominio en BD.
- Persistencia del feed u otras pantallas.

Cada uno de esos, si llega, va en su propia spec.
