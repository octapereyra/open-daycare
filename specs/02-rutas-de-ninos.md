# SPEC 02 — Rutas de niños: lista y perfil

> **Status:** Implementado
> **Depends on:** SPEC 01 — Feed del home (visual)
> **Date:** 2026-08-01
> **Objective:** Implementar las rutas `/kids` (lista) y `/kids/[id]` (perfil) replicando pixel-identical los wireframes `ninos.dc.html` y `perfil-nino.dc.html`, con datos mock en `lib/mock-kids.ts`, navegación real entre ambas via `next/link`, y refactor del `Sidebar`/`BottomNav` compartidos para marcar "Niños" activo segun la ruta activa.

## Scope

**In:**

- Implementar la ruta `/kids` (`app/kids/page.tsx`) replicando el layout y estilos de `references/pantallas/ninos.dc.html`.
- Implementar la ruta `/kids/[id]` (`app/kids/[id]/page.tsx`) replicando el layout y estilos de `references/pantallas/perfil-nino.dc.html`.
- Encabezado "GESTIÓN · Niños" + boton "Agregar niño" (visual, `href="#"`).
- Input "Buscar niño…" (visual, sin filtrado ni `useState`).
- Separador "SALA SOLES · 8 niños".
- Grid 2 columnas de 8 niños mock: avatar (inicial + colores), nombre, edad, padres vinculados, y chip de estado (MANÍ/LACTOSA o VINCULAR si sin padres; flecha chevron si no hay chip).
- Tarjeta de niño como `next/link` real a `/kids/[slug]` (slug derivado del nombre).
- Perfil: breadcrumb "Volver a Niños" (link real a `/kids`), tarjeta de identidad (avatar 84px, nombre, edad + sala, boton "Editar" visual), caja "Alergias y notas" (rojo), datos (nacimiento, sala, ingreso), boton "Resumen del dia" (visual), y panel "Padres vinculados" (avatar, relacion, estado ACTIVA/PENDIENTE, "Vincular otro padre" visual).
- Refactor de `app/_components/sidebar.tsx` y `app/_components/bottom-nav.tsx`: prop `active: "feed" | "niños" | "avisos" | "cuenta"` y hrefs reales para `/` (Feed) y `/kids` (Niños); los demas quedan `href="#"`.
- Extraer los datos mock a `lib/mock-kids.ts` (array unico `kids: Kid[]` con perfil + padres).
- Reusar tokens warm y tipografías de SPEC 01 (sin tocar `globals.css` ni `layout.tsx`).
- Responsive: sidebar desktop → bottom-nav + FAB bajo `lg` (mismo patrón que SPEC 01); grid de niños 1 columna bajo `sm`; perfil stack vertical bajo `lg` (perfil arriba, panel derecho abajo, "Resumen del dia" full-width).

**Out of scope (for future specs):**

- Autenticación, sesión y permisos.
- Base de datos y persistencia.
- Rutas reales para Agregar niño, Editar, Vincular padre, Resumen del dia, logout (quedan `href="#"`).
- Interactividad: búsqueda funcional, likes, comentarios, edición, vinculación.
- Datos dinamicos o fetch (todo hardcoded mock).
- Otros wireframes de `references/pantallas/` (feed, avisos, mi cuenta, crear publicación, etc.).

## Data model

Esta feature introduce una unica estructura de datos mock para los niños. No hay
persistencia ni estado en runtime.

```ts
// lib/mock-kids.ts

type ParentStatus = "active" | "pending";

interface Parent {
  /** Initial shown in the avatar */
  initial: string;
  /** Display name, e.g. "Lucía Fernández" */
  name: string;
  /** Relationship copy, e.g. "Mamá · activa" — UI copy, stays Spanish */
  relation: string;
  /** Avatar background color (hex) */
  avatarBg: string;
  /** Avatar text color (hex) */
  avatarColor: string;
  status: ParentStatus;
}

type KidChip = "MANÍ" | "LACTOSA" | "VINCULAR" | null;

interface Kid {
  /** URL slug derived from the name, e.g. "mateo-fernandez" */
  slug: string;
  /** Display name, e.g. "Mateo Fernández" */
  name: string;
  /** Initial shown in the avatar */
  initial: string;
  /** Avatar background color (hex) */
  avatarBg: string;
  /** Avatar text color (hex) */
  avatarColor: string;
  /** Age in years, displayed as "3 años" */
  ageYears: number;
  /** Number of linked parents (display only) */
  parentsCount: number;
  /** Chip on the list card: allergy label, "VINCULAR" if no parents, null if none */
  chip: KidChip;
  /** Detail: birth date formatted, e.g. "12 mar 2022" */
  birthDate: string;
  /** Detail: room name, e.g. "Soles" */
  room: string;
  /** Detail: entry date formatted, e.g. "feb 2025" */
  enrolled: string;
  /** Detail: allergies/notes block; absent if none */
  allergiesNote?: { title: string; text: string };
  /** Detail: linked parents list */
  parents: Parent[];
}

export const kids: Kid[] = [/* 8 kids from the wireframe */];
```

Convenciones:

- Los colores de avatar y chips se guardan como hex en el mock (especificos de
  cada niño en el wireframe), consistente con SPEC 01.
- `slug` se deriva del `name` como kebab-case; es la clave de la URL `/kids/[id]`.
- `kids` es la unica fuente de datos; la lista y el detalle leen de ella.
  `/kids/[id]` busca por `slug`.
- No se define estado React; la lista y el detalle son estaticos.
- Los literales en español (MANÍ, LACTOSA, VINCULAR, ACTIVA, PENDIENTE,
  "Mamá · activa", alergias/notas) son UI copy y quedan como estan — no son
  enums localizables.

## Implementation plan

1. **Mock de datos.** Crear `lib/mock-kids.ts` con los tipos `ParentStatus`, `Parent`, `KidChip`, `Kid` y el array `kids: Kid[]` con los 8 niños del wireframe (Mateo, Sofía, Benjamín, Valentina, Tomás, Emma, Lucas, Olivia), cada uno con perfil + padres. Manual: `npm run build` pasa sin type errors.

2. **Refactor del Sidebar.** Modificar `app/_components/sidebar.tsx`: agregar prop `active: "feed" | "niños" | "avisos" | "cuenta"` y reemplazar los `href="#"` de Feed y Niños por `/` y `/kids` reales (Avisos y Mi cuenta quedan `href="#"`). Marcar el item activo segun la prop en vez del flag hardcodeado. Manual: `app/page.tsx` sigue renderizando Feed activo sin cambios visuales.

3. **Refactor del BottomNav.** Modificar `app/_components/bottom-nav.tsx` con el mismo prop `active` y hrefs reales para `/` y `/kids`. Manual: bajo 768px el bottom-nav marca Feed activo en `/`.

4. **Actualizar `/`.** Ajustar `app/page.tsx` para pasar `<Sidebar active="feed" />` y `<BottomNav active="feed" />` (reemplaza el hardcodeo removido). Manual: `npm run dev`, `/` sin cambios visuales.

5. **KidCard.** Crear `app/_components/kid-card.tsx` que recibe un `Kid` y renderiza avatar, nombre, edad + padres vinculados, y chip (MANÍ/LACTOSA o VINCULAR) o chevron si `chip === null`. Toda la tarjeta es `<Link href={`/kids/${kid.slug}`}>`. Manual: renderizar un `KidCard` suelto de `kids`, comparar con el wireframe.

6. **Página `/kids`.** Crear `app/kids/page.tsx`: layout flex con `<Sidebar active="niños" />` + `<main>` scrollable. Dentro de main: encabezado ("GESTIÓN" + h1 "Niños" + boton "Agregar niño" visual), input "Buscar niño…" visual, separador "SALA SOLES · 8 niños" y grid 2 columnas (`grid-cols-1 sm:grid-cols-2`) de `kids.map(KidCard)`. Incluir `<BottomNav active="niños" />` y `<Fab />`. Manual: `npm run dev`, `/kids` muestra la lista pixel-comparable al wireframe.

7. **Página `/kids/[id]`.** Crear `app/kids/[id]/page.tsx` con `generateStaticParams` (mapea `kids` a `{ id: slug }`), `generateMetadata` (titulo `${kid.name} · OpenDaycare`) y busca el kid por `slug`; si no existe, `notFound()`. Layout: `<Sidebar active="niños" />` + `<main>` con breadcrumb "Volver a Niños" (`<Link href="/kids">`), y grid de 2 columnas bajo `lg` (perfil izquierda min-w-[300px] + panel derecha w-[300px]). Perfil: tarjeta identidad (avatar 84px, nombre, edad + sala, "Editar" visual), caja "Alergias y notas" (rojo, solo si `allergiesNote`), y datos (nacimiento, sala, ingreso). Panel: boton "Resumen del dia" (visual) y lista de padres (avatar, relacion, estado ACTIVA/PENDIENTE, "Vincular otro padre" visual). Stack vertical bajo `lg`. Incluir `<BottomNav active="niños" />` y `<Fab />`. Manual: `npm run dev`, navegar de `/kids` a `/kids/mateo-fernandez`, ver el perfil pixel-comparable al wireframe.

8. **Verificacion manual de rutas.** Manual: navegar `/` → click "Niños" en sidebar → `/kids` con Niños activo → click en Mateo → `/kids/mateo-fernandez` con Niños activo → click "Volver a Niños" → `/kids`. En mobile: mismo flujo via bottom-nav.

## Acceptance criteria

- [x] `npm run dev` levanta el servidor en :3000 sin errores de consola ni de compilación.
- [x] `npm run build` completa sin errores de TypeScript ni de build.
- [x] `npm run lint` pasa sin errores en `app/` y `lib/` (sin contar `references/`).
- [x] Los datos mock viven en `lib/mock-kids.ts` tipados y exportados como `kids: Kid[]`.
- [x] `kids` contiene exactamente 8 niños con slug unico derivado de su nombre.
- [x] Navegar a `/kids` muestra el layout de dos columnas: sidebar 248px + contenido scrollable.
- [x] El sidebar marca "Niños" como item activo (fondo `#FBE3D8`, color `#D9583C`, bold) en `/kids` y `/kids/[id]`.
- [x] El feed `/` sigue marcando "Feed" activo tras el refactor del Sidebar/BottomNav.
- [x] El sidebar usa hrefs reales: `/` para Feed, `/kids` para Niños (Avisos y Mi cuenta quedan `href="#"`).
- [x] El encabezado de `/kids` muestra "GESTIÓN" + h1 "Niños" + boton "Agregar niño" (visual, `href="#"`).
- [x] El input "Buscar niño…" se renderiza visualmente (sin filtrado, sin `useState`).
- [x] El separador muestra "SALA SOLES" y "8 niños".
- [x] Se renderizan exactamente 8 tarjetas en grid de 2 columnas (1 columna bajo `sm`).
- [x] Cada tarjeta muestra avatar (inicial + colores), nombre, edad + padres vinculados, y chip correcto (MANÍ/LACTOSA o VINCULAR) o chevron si `chip === null`.
- [x] Cada tarjeta es un `<Link>` real a `/kids/${slug}` (navega, no es `href="#"`).
- [x] El layout de `/kids` se ve pixel-identical al wireframe `references/pantallas/ninos.dc.html` en viewport desktop.
- [x] Navegar a `/kids/mateo-fernandez` muestra el perfil completo: breadcrumb "Volver a Niños", avatar 84px, nombre "Mateo Fernández", "3 años · Sala Soles", boton "Editar".
- [x] La caja "Alergias y notas" se renderiza (rojo) con titulo y texto del mock.
- [x] Los datos (nacimiento, sala, ingreso) se renderizan con los valores del mock.
- [x] El boton "Resumen del dia" se renderiza (visual, `href="#"`).
- [x] El panel "Padres vinculados" lista los padres del mock con avatar, relacion, y estado (ACTIVA/PENDIENTE).
- [x] "Vincular otro padre" se renderiza (visual, `href="#"`).
- [x] El breadcrumb "Volver a Niños" es `<Link href="/kids">` real.
- [x] `notFound()` se invoca al navegar a `/kids/<slug-inexistente>`.
- [x] El layout de `/kids/[id]` se ve pixel-identical al wireframe `references/pantallas/perfil-nino.dc.html` en viewport desktop.
- [x] A 1280px (desktop) el sidebar está visible y el bottom-nav + FAB están ocultos en `/kids` y `/kids/[id]`.
- [x] A 768px (tablet) el sidebar se oculta y aparece el bottom-nav inferior + FAB en `/kids` y `/kids/[id]`.
- [x] A 375px (mobile) el grid de `/kids` pasa a 1 columna sin scroll horizontal.
- [x] A 375px (mobile) el perfil `/kids/[id]` apila vertical (perfil arriba, panel abajo, "Resumen del dia" full-width) sin scroll horizontal.
- [x] No hay estado React ni interactividad: búsqueda, "Agregar niño", "Editar", "Vincular padre", "Resumen del dia" y logout no responden a clicks (salvo los `<Link>` de navegación).

## Decisions

- **Sí:** Navegación real con `next/link` entre `/kids` y `/kids/[id]` (tarjetas y breadcrumb). Es la navegación entre vistas que este spec define; usar `href="#"` rompería el flujo.
- **No:** `href="#"` para tarjetas y breadcrumb. Sería un retroceso vs SPEC 01, que descartó Next `Link` porque no habia rutas destino reales — aquí sí las hay.

- **Sí:** Refactor del `Sidebar` y `BottomNav` compartidos con prop `active`. Evita duplicación y prepara el patrón para futuros specs (Avisos, Mi cuenta).
- **No:** Duplicar el sidebar en `/kids` y `/kids/[id]`. Multiplicaría mantenimiento y desincronizaría estilos.

- **Sí:** hrefs reales (`/`, `/kids`) y `href="#"` para los demas (Avisos, Mi cuenta). Solo existen rutas para Feed y Niños; el resto queda visual.
- **No:** Usar `href="#"` tambien para Feed y Niños. Anularía la navegación que este spec introduce.

- **Sí:** Un unico array `kids: Kid[]` en `lib/mock-kids.ts` con perfil + padres. La lista y el detalle leen de la misma fuente; no hay duplicación.
- **No:** Dos arreglos separados (lista ligera + detalle). Duplica datos y rompe consistencia.

- **Sí:** Slug legible derivado del nombre (`mateo-fernandez`). URLs amigables y sin exponer índices numericos.
- **No:** Id numerico (`/kids/1`). URLs opacas y frágiles ante reordenamientos del mock.
- **No:** Id corto (`/kids/mateo`). Colisiones posibles con nombres compartidos; el apellido desambigua.

- **Sí:** Input "Buscar niño…" puramente visual sin `useState`. Mantiene la regla de "sin interactividad" de SPEC 01 y evita estado vacío fuera de scope.
- **No:** Buscador funcional en cliente. Abre estado, filtra, render condicional — todo fuera de este spec.

- **Sí:** Literales en español (MANÍ, LACTOSA, VINCULAR, ACTIVA, PENDIENTE, "Mamá · activa") como UI copy, no enums localizables. Consistente con SPEC 01 (badges LOGRO/ACTIVIDAD/ANUNCIO).
- **No:** Enums localizables. Overengineering para un maquetado visual sin i18n.

- **Sí:** "Agregar niño", "Editar", "Vincular otro padre", "Resumen del dia" todos visuales `href="#"`. No hay pantallas destino todavía.
- **No:** Navegar a rutas inexistentes. Causaría 404 y rompería la fidelidad visual.

- **Sí:** Reusar tokens warm y tipografías de SPEC 01 sin tocar `globals.css` ni `layout.tsx`. El sistema de diseño ya está definido.
- **No:** Redefinir tokens o fonts. Duplicación innecesaria.

- **Sí:** Responsive con el mismo patrón que SPEC 01 (sidebar `lg`, bottom-nav + FAB bajo `lg`) y stack vertical en el perfil. Consistencia visual entre vistas.
- **No:** Patrones responsivos distintos por ruta. Rompería la coherencia de la app.

## What is **not** in this spec

- Autenticación, sesión y permisos.
- Base de datos y persistencia.
- Rutas reales para Agregar niño, Editar, Vincular padre, Resumen del dia, logout (quedan `href="#"`).
- Interactividad: búsqueda funcional, likes, comentarios, edición, vinculación.
- Datos dinamicos o fetch (todo hardcoded mock).
- Otros wireframes de `references/pantallas/` (feed, avisos, mi cuenta, crear publicación, etc.).

Cada uno de esos, si llega, va en su propio spec.

## Verification report

**Date:** 2026-08-02
**Spec:** `specs/02-rutas-de-ninos.md`

| # | Criterio (resumen) | Familia | Status | proof_refs |
|---|---|---|---|---|
| 1 | `npm run dev` sin errores | Build | PASS | Dev server on :3000, `.next/dev/logs/next-development.log` shows `✓ Compiled` only, no errors |
| 2 | `npm run build` sin errores | Build | PASS | `Compiled successfully in 2.4s`, TypeScript passed, 13/13 static pages generated including `/kids` and `/kids/[id]` |
| 3 | `npm run lint` sin errores en app/ y lib/ | Build | PASS | eslint reports 2 errors + 8 warnings all in `references/pantallas/support.js` — zero issues in `app/` or `lib/` |
| 4 | Mock en `lib/mock-kids.ts` tipado `kids: Kid[]` | Code | PASS | `lib/mock-kids.ts:1-28` exports types `ParentStatus`, `Parent`, `KidChip`, `Kid`; `lib/mock-kids.ts:47` exports `const kids: Kid[]` |
| 5 | 8 niños con slug único | Code | PASS | `lib/mock-kids.ts:47-247` — mateo-fernandez, sofia-mendez, benjamin-ruiz, valentina-soto, tomas-diaz, emma-castro, lucas-romero, olivia-vega |
| 6 | `/kids` layout 2 columnas: sidebar 248px + scroll | UI | PASS | `sidebar.tsx:100` `w-[248px]`; `kids/page.tsx:48` `main flex-1 min-w-0 h-screen overflow-y-auto` |
| 7 | Sidebar "Niños" activo en `/kids` y `/kids/[id]` | UI | PASS | Both pages pass `active="niños"`; `sidebar.tsx:157` applies `bg-[#FBE3D8] text-[#D9583C] font-extrabold` |
| 8 | Feed `/` marca "Feed" activo post-refactor | UI | PASS | `app/page.tsx:27` passes `active="feed"`; screenshot `.playwright-mcp/feed-desktop-1280.png` confirms Feed highlighted |
| 9 | Sidebar hrefs reales: `/`, `/kids`, `#`, `#` | Code | PASS | `sidebar.tsx:92-95` — Feed→`/`, Niños→`/kids`, Avisos→`#`, Mi cuenta→`#` |
| 10 | Encabezado GESTIÓN + h1 Niños + botón Agregar niño `#` | UI | PASS | `kids/page.tsx:52-65`; snapshot shows `GESTIÓN`, `heading "Niños"`, `link "Agregar niño" /url: #` |
| 11 | Input "Buscar niño…" visual, sin useState | Code | PASS | `kids/page.tsx:68-75` renders `<input placeholder="Buscar niño…">`; `grep useState app/` returns zero matches |
| 12 | Separador "SALA SOLES" + "8 niños" | UI | PASS | `kids/page.tsx:77-83`; snapshot confirms text `SALA SOLES` and `8 niños` |
| 13 | 8 tarjetas grid 2 cols (1 col bajo sm) | UI | PASS | `kids/page.tsx:85` `grid-cols-1 sm:grid-cols-2`; snapshot shows 8 link cards |
| 14 | Tarjeta: avatar, nombre, edad+padres, chip/chevron | UI | PASS | `kid-card.tsx:29-63`; snapshot shows MANÍ, LACTOSA, VINCULAR chips and chevron for null-chip kids (Sofía, Benjamín, etc.) |
| 15 | Tarjeta `<Link>` real a `/kids/${slug}` | Code | PASS | `kid-card.tsx:31-33` `<Link href={/kids/${kid.slug}}>`; snapshot shows `/url: /kids/mateo-fernandez` etc. |
| 16 | `/kids` pixel-identical a wireframe desktop | UI | PASS | Visual comparison: `.playwright-mcp/kids-live-1280.png` vs `.playwright-mcp/wireframe-ninos.png` — same sidebar, header, search, separator, 2-col grid |
| 17 | Perfil mateo-fernandez completo | UI | PASS | Snapshot: breadcrumb "Volver a Niños", h1 "Mateo Fernández", "3 años · Sala Soles", "Editar" button, avatar 84px (`w-[84px] h-[84px]` at `profile page.tsx:112`) |
| 18 | Caja "Alergias y notas" roja | UI | PASS | `kids/[id]/page.tsx:134-148`; snapshot shows "Alergias y notas" + "Alergia al maní…" text; `bg-[#FBDAD6]` red-tinted box |
| 19 | Datos nacimiento, sala, ingreso del mock | UI | PASS | Snapshot: "Fecha de nacimiento / 12 mar 2022", "Sala / Soles", "Ingreso / feb 2025" — matches `lib/mock-kids.ts:57-59` |
| 20 | Botón "Resumen del día" visual `#` | UI | PASS | `kids/[id]/page.tsx:173-179`; snapshot: `link "Resumen del día" /url: #` |
| 21 | Panel "Padres vinculados" con ACTIVA/PENDIENTE | UI | PASS | Snapshot: "Lucía Fernández / Mamá · activa / ACTIVA", "Diego Fernández / Papá · invitación enviada / PENDIENTE" |
| 22 | "Vincular otro padre" visual `#` | UI | PASS | `kids/[id]/page.tsx:223-230`; snapshot: `link "Vincular otro padre" /url: #` |
| 23 | Breadcrumb `<Link href="/kids">` real | Code | PASS | `kids/[id]/page.tsx:100-106`; snapshot: `link "Volver a Niños" /url: /kids` |
| 24 | `notFound()` en slug inexistente | Code | PASS | Navigated to `/kids/nonexistent-slug` → HTTP 404, title "404: This page could not be found." |
| 25 | `/kids/[id]` pixel-identical a wireframe desktop | UI | PASS | Visual comparison: `.playwright-mcp/profile-live-1280.png` vs `.playwright-mcp/wireframe-perfil.png` — same breadcrumb, identity card, allergies box, data rows, parents panel |
| 26 | 1280px: sidebar visible, bottom-nav+FAB hidden | UI | PASS | `sidebar.tsx` rendered (snapshot shows complementary); `bottom-nav.tsx:100` `lg:hidden`; `fab.tsx:20` `lg:hidden` |
| 27 | 768px: sidebar hidden, bottom-nav+FAB visible | UI | PASS | `.playwright-mcp/kids-tablet-768.png` shows bottom-nav bar; sidebar absent (`hidden lg:block`); FAB visible |
| 28 | 375px: grid 1 columna sin scroll horizontal | UI | PASS | `.playwright-mcp/kids-mobile-375.png` shows single-column card layout; `grid-cols-1` at mobile breakpoint |
| 29 | 375px: perfil apila vertical | UI | PASS | `.playwright-mcp/profile-mobile-375.png` shows vertical stack (profile top, parents panel bottom); `flex-col` at mobile, `lg:flex-row` at desktop |
| 30 | Sin estado React ni interactividad | Code | PASS | `grep useState app/` returns zero matches; all action buttons use `<a href="#">`; only `<Link>` components navigate |

### Failures

None. All 30 acceptance criteria pass.