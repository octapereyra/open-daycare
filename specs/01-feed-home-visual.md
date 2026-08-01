# SPEC 01 — Feed del home (visual)

> **Status:** Implementado
> **Depends on:** —
> **Date:** 2026-07-29
> **Objective:** Implementar la pantalla `/` replicando de forma pixel-identical la plantilla `references/pantallas/feed.dc.html` en desktop y con diseño responsivo (sidebar → bottom-nav + FAB en mobile), con datos mock estrictamente maquetado visual sin interactividad, auth ni persistencia.

## Scope

**In:**

- Implementar la ruta `/` (`app/page.tsx`) replicando el layout y estilos de `references/pantallas/feed.dc.html`.
- Sidebar completo de 248px con: logo OpenDaycare + "Sala Soles", botón "Nueva publicación", nav (Feed activo, Niños, Avisos, Mi cuenta) y tarjeta de usuario "Caro Giménez" con logout.
- Encabezado del feed: badge "GUARDERÍA · SALA SOLES", saludo "Buenas, Caro" y subtítulo "12 niños · martes 17 jun".
- Caja Composer "Compartí un momento…" (no funcional, link).
- Separador "PUBLICADO HOY".
- Tres publicaciones mock en orden: publicacion logro (Mateo), publicacion actividad con placeholder de foto (Mateo), anuncio general.
- Cada post: avatar, nombre, hora, badge de tipo (LOGRO/ACTIVIDAD/ANUNCIO), destinatario ("Para: familia de Mateo" / "Para: toda la sala"), texto, footer con contador de corazones, comentarios, y link "Editar".
- Extraer los datos mock a `lib/mock-feed.ts` (array tipado de publicaciones).
- Configurar tipografías Fredoka y Nunito via `next/font/google` con variables CSS.
- Definir tokens de color del tema warm en `app/globals.css` (`@theme inline`).
- Links de nav y actions como `href="#"` placeholders (sin Next `Link`, sin rutas rotas).

**Out of scope (for future specs):**

- Autenticación y sesion de usuario.
- Base de datos y persistencia.
- Rutas reales para Niños, Avisos, Mi cuenta, Nueva publicación, detalle-publicacion, foto, logout, editar.
- Interactividad: likes, comentarios, composer, editar, navegacion.
- Datos dinamicos o fetch (todo es hardcoded mock).
- Diseno responsivo: sidebar de 248px se oculta bajo `md` (768px) y se reemplaza por:
  - Bottom-nav fijo inferior con los 4 items del nav (Feed activo, Niños, Avisos, Mi cuenta) + logout integrado.
  - FAB "Nueva publicación" abajo a la derecha (sustituye al botón del sidebar).
  - Encabezado del feed, composer, separador y posts se adaptan a ancho fluido (max-width y padding responsivo).
- Verificacion de breakpoints clave (375px mobile, 768px tablet, 1280px desktop): el layout no se rompe ni causa scroll horizontal.
- Otros wireframes de `references/pantallas/`.

## Data model

Esta feature introduce una unica estructura de datos mock para el feed. No hay
persistencia ni estado en runtime.

`` `ts
// lib/mock-feed.ts

type PostType = "achievement" | "activity" | "announcement";

interface PostAuthor {
  /** Initial shown in the avatar */
  initial: string;
  /** Name shown under the avatar */
  name: string;
  /** Avatar background color (hex) */
  avatarBg: string;
  /** Avatar text color (hex) */
  avatarColor: string;
  /** true if the avatar uses an icon instead of an initial */
  useIcon?: boolean;
}

interface Post {
  id: string;
  type: PostType;
  author: PostAuthor;
  /** Displayed time, e.g. "14:20" */
  time: string;
  /** Authorship line, e.g. "publicado por vos" — UI copy, stays Spanish */
  authorLabel: string;
  /** Audience, e.g. "familia de Mateo" or "toda la sala" — UI copy, stays Spanish */
  audience: string;
  body: string;
  /** Like count (display only) */
  likes: number;
  /** Comment count (display only) */
  comments: number;
  /** Photo placeholder; absent on achievement/announcement posts */
  photoPlaceholder?: string;
}

export const mockPosts: Post[] = [/* 3 posts from the wireframe */];
`` `

Convenciones:

- Los colores de avatar y badges se guardan como hex en el mock (no como
  tokens de Tailwind) porque son especificos de cada post en el wireframe.
- `mockPosts` es la unica fuente de datos; `app/page.tsx` mapea sobre ella.
- No se define estado React; el feed es estatico.

## Implementation plan

1. **Tipografías.** En `app/layout.tsx` reemplazar `Geist/Geist_Mono` por `Fredoka` y `Nunito` desde `next/font/google`, con variables CSS `--font-fredoka` y `--font-nunito`. Actualizar `metadata` (titulo y descripcion a OpenDayCare). Manual: `npm run dev`, la pagina starter carga sin errores y usa las nuevas fonts.

2. **Tokens de color en Tailwind.** En `app/globals.css` agregar a `@theme inline` los tokens del tema warm: `--color-canvas (#F6ECDF)`, `--color-surface (#FFFDF9)`, `--color-border (#ECE0D0)`, `--color-ink (#3F362E)`, `--color-muted (#94887B)`, `--color-coral (#F2937A)`, `--color-coral-strong (#EE8164)`, `--color-aux (#A89A8B)`, `--color-rule (#E7DAC8)`. Quitar el dark-mode hardcodeado que viene del starter. Manual: build sin errores de CSS.

3. **Mock de datos.** Crear `lib/mock-feed.ts` con los tipos `PostType`, `PostAuthor`, `Post` y el array `mockPosts` con los 3 posts del wireframe (logro Mateo, actividad Mateo, anuncio general). Manual: `npm run build` pasa sin type errors.

4. **Sidebar.** Crear `app/_components/sidebar.tsx` con el sidebar de 248px: logo, botón "Nueva publicación", nav (Feed activo + 3 inactivos) y tarjeta de usuario con logout. Todos los links `href="#"`. Importar iconos como SVGs inline. Manual: importar temporalmente en `page.tsx`, ver el sidebar renderizado en `/`.

5. **Post card.** Crear `app/_components/post-card.tsx` que recibe un `Post` y renderiza avatar, nombre, hora, badge de tipo, destinatario, body, placeholder de foto (si existe) y footer (likes, comentarios, Editar). Manual: renderizar un post de `mockPosts` suelto, comparar con el wireframe.

6. **Página `/`.** Reescribir `app/page.tsx`: layout flex con `<Sidebar />` + `<main>` scrollable. Dentro de main: encabezado (badge, saludo, subtítulo), composer, separador "PUBLICADO HOY" y `mockPosts.map(PostCard)`. Manual: `npm run dev`, `/` muestra el feed completo pixel-comparable al wireframe.

7. **Layout root.** Ajustar `app/layout.tsx`: quitar `flex flex-col` y estilos del starter que rompen el layout full-height del feed. El `<body>` debe permitir el flex h-full del feed. Manual: `/` ocupa todo el viewport sin scroll extra.

8. **Bottom-nav mobile.** Crear `app/_components/bottom-nav.tsx` con nav inferior fijo (los 4 items + logout) visible solo bajo `md`. Links `href="#"`. Manual: redimensionar el browser bajo 768px, ver el bottom-nav y perder el sidebar.

9. **FAB "Nueva publicación".** Crear `app/_components/fab.tsx` (botón flotante abajo a la derecha) visible solo bajo `md`, sustituye al botón del sidebar. Manual: bajo 768px el FAB aparece y la acción del sidebar desaparece.

10. **Responsive del feed.** Ajustar `app/page.tsx`: el contenedor del feed usa `max-w-[760px]` con padding fluido (`px-4 md:px-10`); el sidebar se renderiza solo `md:block` y el bottom-nav + FAB solo `md:hidden`. Manual: probar a 375px, 768px y 1280px — sin scroll horizontal, sin desborde.

## Acceptance criteria

- [ ] `npm run dev` levanta el servidor en :3000 sin errores de consola ni de compilación.
- [ ] `npm run build` completa sin errores de TypeScript ni de build.
- [ ] `npm run lint` pasa sin errores.
- [ ] Navegar a `/` muestra el layout de dos columnas: sidebar 248px a la izquierda + feed a la derecha.
- [ ] El sidebar muestra logo "OpenDaycare" + "Sala Soles", botón "Nueva publicación", los 4 items de nav (Feed activo, Niños, Avisos, Mi cuenta) y la tarjeta "Caro Giménez" con icono de logout.
- [ ] El feed muestra el encabezado "GUARDERÍA · SALA SOLES", el saludo "Buenas, Caro" y el subtítulo "12 niños · martes 17 jun".
- [ ] Se renderiza la caja composer "Compartí un momento…" con el icono de cámara.
- [ ] Se renderiza el separador "PUBLICADO HOY".
- [ ] Se renderizan exactamente 3 publicaciones en orden: logro (Mateo), actividad (Mateo), anuncio general.
- [ ] Cada post muestra avatar, nombre, hora, badge de tipo correcto (LOGRO/ACTIVIDAD/ANUNCIO), destinatario, texto del body y footer con likes + comentarios + "Editar".
- [ ] El post de tipo actividad muestra el placeholder de foto con borde dashed.
- [ ] Los posts de tipo logro y anuncio no muestran placeholder de foto.
- [ ] Las tipografías Fredoka (headings/logo) y Nunito (body) cargan via `next/font/google` sin FOUT visible.
- [ ] Los tokens de color warm (`--color-canvas`, `--color-surface`, `--color-coral`, etc.) están definidos en `app/globals.css` bajo `@theme inline`.
- [ ] Los datos mock viven en `lib/mock-feed.ts` tipados y exportados como `mockPosts`.
- [ ] Todos los links de nav y acciones usan `href="#"` (no hay rutas rotas ni Next `Link`).
- [ ] No hay estado React ni interactividad: likes, comentarios, composer y editar no responden a clicks.
- [ ] El layout se ve pixel-identical al wireframe `references/pantallas/feed.dc.html` comparado con screenshot en viewport desktop.
- [ ] A 1280px (desktop) el sidebar de 248px está visible y el bottom-nav + FAB están ocultos.
- [ ] A 768px (tablet) el sidebar se oculta y aparece el bottom-nav inferior + FAB de "Nueva publicación".
- [ ] A 375px (mobile) el feed ocupa el ancho fluido sin scroll horizontal y sin desborde del contenido.
- [ ] En los 3 breakpoints clave (375px / 768px / 1280px) el layout no se rompe ni genera scroll horizontal.

## Decisions

- **Sí:** Datos mock en módulo separado `lib/mock-feed.ts`. Separa datos de markup y facilita el swap en futuros specs cuando haya backend.
- **No:** Datos inline en `page.tsx`. Mezcla estructura con contenido y dificulta el reemplazo posterior.

- **Sí:** Sidebar completo renderizado con todos los links como `href="#"`. Visualmente identico al wireframe, sin rutas rotas.
- **No:** Sidebar recortado o links a rutas inexistentes. Rompería la fidelidad visual o generaria 404.

- **Sí:** `next/font/google` con variables CSS para Fredoka y Nunito. Idiomático Next 16, self-hosting, sin layout shift.
- **No:** `<link>` a Google Fonts en `<head>`. Coincide literal con el wireframe pero peor perf y riesgo de FOUT/CLS.

- **Sí:** Tokens de color warm definidos en `@theme inline` (`globals.css`) y usados via clases de Tailwind v4.
- **No:** Inline `style` con hex copiados del wireframe. Bypasa el sistema de diseño de Tailwind.

- **Sí:** Todo es puramente visual, sin interactividad. Sin auth ni DB no hay estado que manejar.
- **No:** Cliks en likes, comentarios, composer o editar. Quedan para specs con backend.

- **Sí:** Diseno responsivo incluido en este spec. El sidebar desktop se oculta bajo `md` (768px) y se reemplaza por bottom-nav inferior + FAB de "Nueva publicación".
- **No:** Sidebar colapsable tipo hamburger o sidebar a solo iconos en mobile. El bottom-nav es el patrón mobile nativo de este tipo de apps.
- **No:** Generar wireframe mobile de referencia propio. Se verifica por no-rotura en breakpoints clave, no por fidelidad pixel-perfect mobile.

- **No:** Usar Next `Link` para las rutas placeholder. `href="#"` es suficiente para un maquetado visual sin causar 404.

## What is **not** in this spec

- Autenticación y sesion de usuario.
- Base de datos y persistencia.
- Rutas reales para Niños, Avisos, Mi cuenta, Nueva publicación, detalle-publicacion, foto, logout, editar.
- Interactividad: likes, comentarios, composer, editar, navegacion.
- Datos dinamicos o fetch (todo es hardcoded mock).
- Otros wireframes de `references/pantallas/`.

Cada uno de esos, si llega, va en su propio spec.