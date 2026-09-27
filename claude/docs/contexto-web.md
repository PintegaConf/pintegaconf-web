# Contexto: web de Pintega Conf y "Círculo Arcano" (hover reveal del equipo)

Historial de decisiones de diseño y código de la web, migrado desde el proyecto de Claude (sep 2026).

> **Rutas actuales (sep 2026):** la web es `web/site/` (Astro) y la v1 de archivo único está en `web/backup/pintega-conf-web.v1.html`. La web temporal se llama ahora `web/temporal/` (antes `web-temporal/`). Las secciones antiguas de este historial mencionan rutas de la v1 (`Claude outputs/pintega-conf-web.html`, `web-temporal/`...): son registro histórico y se dejan como estaban.

## Qué es esto

Un componente web para la página de **Pintega Conf**: una fila de personas ocultas bajo una capucha que, al hacer hover/foco, se identifican — la capucha se funde y aparece su ficha (nombre, rol/tema).

**"Píntega"** es la palabra gallega para salamandra — símbolo folclórico de fuego/alquimia. Esto es intencional en el diseño, no decorativo: la marca real es una silueta de salamandra **negra sobre fondo mostaza**, estilo recorte de papel plano. Toda la paleta viene de ahí.

## Recorrido de estilo (por qué se ve como se ve)

1. Empezó como transición hover simple (capucha → rostro) inspirada en Assassin's Creed.
2. Pasó por una fase "códec de Metal Gear Solid" (pantalla CRT, scanlines) — el usuario la rechazó: no era el arte que buscaba.
3. Pasó por ilustración a tinta/semitono estilo Yoji Shinkawa (portadas MGS) — le gustó la idea pero pidió cortes **bruscos** (`steps()`, sin ease) en vez de fundido, inspirado en las cutscenes tipo "motion comic" de **Metal Gear Solid: Peace Walker** (arte de Ashley Wood).
4. El usuario pidió tema de **magia/rol** ligado al nombre "Pintega Conf" → estética de grimorio/adeptos ocultos, escuelas de magia como tracks de charlas (Nigromancia, Ilusión, Adivinación...).
5. El usuario mostró el **logo real de la salamandra** (negro sobre mostaza) → se recolorea todo a esa paleta de 2 tonos (antes había pasado por violeta arcano y rojo/ember — ambos incorrectos, no son la marca).
6. Pidió layout de **foto de grupo**: dos filas intercaladas (atrás/delante), con quien tiene el foco "dando un paso al frente".
7. Pidió quitar la tarjeta/caja — solo la figura flotando sobre el color de página.
8. Pidió que fueran **7 personas**, no 8.
9. Pidió un **tercer fotograma intermedio** (capucha saliendo despedida con líneas de movimiento).
10. Lo probó y **lo descartó**: se vuelve a **solo 2 fotogramas: capucha → rostro**.
11. Los retratos SVG paramétricos se sustituyeron por **ilustraciones reales** (encapuchado / mismo hombre sin capucha, barba de perilla), embebidas como data URI (`IMG_HOOD`/`IMG_FACE`); cada persona puede tener las suyas con `hood`/`face` en el array. De momento los 7 usan la misma ilustración de ejemplo.
12. Pidió modo **responsive**: en desktop las dos filas intercaladas; en móvil (≤680px) un carrusel de una tarjeta a pantalla completa con scroll-snap.

## Estado técnico

- **Datos aparte del dibujo**: array JS (`grimorio` en el prototipo; en la web, el equipo) con `name`, rol, `row: "back"|"front"`, `hood`/`face` opcionales. Una plantilla (`cardTemplate`) genera el HTML de cada tarjeta.
- **Animación suave** (cambio de criterio del usuario, sep 2026): tras la etapa de cortes secos `steps(1)`, se volvió a `transition` suave. Ya no hay flash ni chispas.
- **Paso al frente real**: las filas no tienen `z-index` (no crean contexto de apilamiento); el `z-index` va en cada `.operative` (atrás 1, delante 2). La de atrás baja `translateY(64px) scale(1.06)` y queda delante.
- **Hover de escritorio por silueta (JS)**: las zonas rectangulares `.hit` se quitaron porque se solapaban. Ahora `.operative`/`.dossier` tienen `pointer-events:none` en escritorio y un script en `.formation-inner` (pointermove) prueba el **alfa de la ilustración** bajo el cursor, deshaciendo la transformación de cada persona (reposo: atrás `scale(.8)`; activa: `translateY(64px) scale(1.06)` atrás / `translateY(-8px) scale(1.06)` delante — **si se cambian en el CSS hay que cambiarlos también en `REST`/`ACTIVE` del JS**). Orden: primero la activa (histéresis, con máscara del rostro), luego fila delantera (el último `order` encima), luego trasera. Pone `.is-active` (z-index 60) y 90ms de gracia en huecos para no parpadear. Teclado sigue con `:focus-within`.
- **Foco con desenfoque**: con `:has()`, al hacer hover en uno, los demás se desenfocan (`blur(3px)`) y el resto de la página baja a `blur(2px)` + opacidad .55. Desactivado en el carrusel móvil.
- **Layout de grupo**: `.row-back` y `.row-front`, cada una `display:flex`. Espaciado con **márgenes negativos fijos** (`-55px` entre personas de la misma fila, solape vertical entre filas, fila de atrás desplazada `73px` = medio paso) — deliberadamente NO `space-between`/`space-around`: el usuario quiere un apretado **constante** en cualquier resolución.
- **Móvil (`@media max-width:680px`)**: `.row-back`/`.row-front` pasan a `display:contents`, y `.formation-inner` se convierte en carrusel `overflow-x:auto; scroll-snap-type:x mandatory` con una tarjeta a `flex:0 0 100%`.

## Bugs ya encontrados y corregidos (para no repetirlos)

- **`feDisplacementMap`/`feTurbulence` compartido entre varios SVG**: producía bloques de color rotos. Se quitó del todo.
- **Especificidad CSS en el carrusel móvil**: `.operative:not(:first-child) { margin-left: -55px; }` ganaba al reset del media query. Corregido duplicando el selector: `.operative, .operative:not(:first-child) { margin-left: 0; ... }`.
- **`.formation-inner` con `width: fit-content` sin resetear en el media query**: dependencia circular de tamaño → scroll horizontal gigante y tarjetas desalineadas. Corregido con `width: auto` en el media query. Verificado con `python -m http.server` comprobando `document.documentElement.scrollWidth == window.innerWidth`.
- **Ficha recortada en móvil**: `overflow-x:auto` recorta también en vertical. `.info` ahora es hija de `.dossier`; en escritorio `position:absolute` encima, en móvil `position:static` debajo con hueco reservado (`visibility:hidden`).
- **Revelado automático en móvil**: un `IntersectionObserver` (root = carrusel, umbral 0.75) marca `.is-active` la tarjeta centrada (180ms de retardo para que asiente el scroll-snap). Solo si el carrusel está ≥50% en pantalla y se cumple `max-width:680px`. Selectores de revelado: `.operative:is(:hover, :focus-within, .is-active)`. La regla de desenfoque de escritorio necesitó `:not(.is-active)`.
- **Capas al cambiar de persona**: la que se iba conservaba z-index alto y tapaba a la nueva. Ahora sin transición de z-index: activa 60, `:focus-within` 50, `.was-active` 40 (el JS la pone 550ms al desactivar), filas 1/2.
- **Revelado (versión elegida)**: fundido de opacidad con la capucha ENCIMA del rostro; al salir la capucha reaparece encima y luego se quita la cara. Rechazados: "levantado" con clip-path, y cara encima.
- **Ritmo del revelado**: la capucha espera 0.3s y se disuelve en 0.45s con `cubic-bezier(.45,0,.35,1)`. La ficha entra a los 0.55s. Revelado completo ≈0.75s.
- **Bucle de hover en el borde superior de los de atrás**: en `pick()` la activa se mantiene si el cursor está sobre su silueta adelantada **o** sobre su zona de reposo + margen. Margen `pad`: 12% de la altura en la fila de atrás, 3% en la de delante.
- **Etiqueta bajo cada persona eliminada**: solo queda la ficha del hover.
- **Flechas en el carrusel móvil**: `.nav-prev`/`.nav-next` (círculo tinta, chevron mostaza), desactivadas en primero/último, ocultas en escritorio. Scrollbar oculta.
- **Flechas en iPhone**: `scrollBy(track.clientWidth)` descentraba (incluye padding; Safari iOS no re-encaja). Ahora se calcula la tarjeta actual y se hace `scrollTo` a su centro exacto (`.formation-inner` con `position:relative`).

## Web completa (pintega-conf-web.html) — sep 2026

- Formato basado en el diseño de **Penpot** (archivo PINTEGA CONF, tablero HOME 1440×6486 + "Menú desplegado"). El Círculo Arcano vive en la sección **EQUIPO**.
- **Equipo** (7, en este orden): Jesús, Iria, Matías, Nacho, Tiziana, Daniel, Carlos — rol "Organización".
- **Estructura**: cabecera · PINTEGA CONF (panel con borde dorado, degradado oscuro, cuadradito dorado abajo-izq) · AGENDA · PONENTES (3×2) · PATROCINADORES · COLABORADORES · EQUIPO · COMUNIDADES · ENTRADAS (ticket amarillo + formulario nombre/apellidos/email/trabajo/cupón/COMPRAR) · footer dorado (FAQS · código de conducta · aviso legal · privacidad · cookies). Menú: panel dorado a la derecha.
- **Tokens**: dorado web #FDC330 (manual #FDC822), negro #1C1C1B, fondo #232323. Arima (títulos 48px), Roboto Mono (texto 14px), Source Sans 3 (formulario/footer).
- **Assets**: logo horizontal, logo PC27, salamandra y huellas sacados en vectorial del PDF `marca_and_rrss/imagen corporativa pintega conf.pdf` (manual de marca, págs. 16, 14, 14 y 1). Las descargas directas de Penpot estaban bloqueadas por la red.
- **Portada** (propuesta aceptada): cabecera fija (sticky) en todos los tamaños con logo + menú horizontal (≥1100px) + botón Entradas; por debajo de 1100px hamburguesa, y la barra sigue visible al hacer scroll. Hero blanco: "Conferencia tecnológica · A Coruña", H1 "El punto de encuentro de las comunidades tech", datos (fecha, lugar, un solo track), botones "Consigue tu entrada" / "Ver agenda", salamandra sobre orbe dorado. En móvil los botones van antes de los datos.
- **Huecos de ponentes y patrocinadores: se quedan así** hasta que haya (decisión del usuario).
- **Precio**: aún no hay; hueco "Entrada general · Precio por anunciar".
- Bug corregido: en móvil el carrusel del equipo salía desplazado 24px → `max-width:none` en el media query.
- **Hombros difuminados** incrustados en los PNG. Antes era una máscara CSS y en **Safari** dejaba líneas claras al animar — **no volver a la máscara CSS**.
- **Centrado del equipo en Safari**: ancho explícito `calc(4*200px - 3*55px)` en vez de `fit-content`.
- **Orbe de portada**: composición propia del usuario (orbe dorado con sombra negra abajo-izquierda + llama de contorno + salamandra enroscada) → `web_assets/orbes/orbe-elegido-transparente.png` (813×880). Va en `.hero-art`.
- **Ilustraciones actuales (v3)**: una carpeta por persona en `web_assets/designs/` (yisus, matias, daniel, carlos; iria, nacho y tiziana vacías a la espera), cada una con encapuchado, manos, rostro y capucha sola; mismo lienzo 1236×1272 → ya alineadas. En la web van a 480×494 con difuminado de hombros corto (vertical 72%→98,5%, lados 13% solo abajo). `.frame` aspect-ratio 1236/1272.
- **Ponentes por anunciar**: círculo oscuro con borde dorado y "?" dorado que brilla suavemente.
- **Patrocinadores**: medallones Dragón/Basilisco/Tritón/Ajolote (de `web_assets/TIERS/PNG`, 400px WebP incrustados). Cada nivel es un panel con el medallón asomando; la importancia se marca por **logos por fila** — Dragón 1, Basilisco 2, Tritón 3, Ajolote 4 (huecos: Dragón 1 —patrocinador exclusivo, una sola empresa—, Basilisco 4, Tritón 6, Ajolote 8); medallones decrecientes 210/190/170/150px (mínimo 150px escritorio, 130px móvil para que se lea el texto del Ajolote). Huecos oscuros con borde dorado discontinuo "Tu logo aquí"; logos reales en blanco y a color al hover; botón "Patrocina Pintega Conf".
- Formulario de compra: sin pasarela, solo valida y muestra "la venta abrirá muy pronto".
- Los fuentes de build antiguos (`web/template.html`, `web/build.py`, `web/*.txt`) **no se conservaron**; el HTML final es la fuente de verdad.

## Contenido de ejemplo del prototipo (codec-unmask.html)

Los 7 ponentes del prototipo son **inventados**, con apellidos gallegos. Mapeo escuela de magia ↔ track:

- Nigromancia → resucitar sistemas legados
- Ilusión → frontend/UI
- Evocación → performance
- Adivinación → observabilidad/monitorización
- Transmutación → migración a nube
- Abjuración → seguridad
- Encantamiento → DX/herramientas

## Web v2 en Astro (sep 2026)

La web se reescribió en **Astro 7** en `web/site/` (la v1 de archivo único queda en `web/backup/` y en `Claude outputs/`). Mismo aspecto (comparado captura a captura en escritorio y móvil, tema oscuro y claro) y mismo comportamiento (probado: toques en tablet, hover, carrusel, menú, tema, formulario, pase), pero:
- componentes por sección con su CSS con ámbito; contenido en `src/data/`; JS en TypeScript, un archivo por comportamiento;
- el equipo se pinta en el orden de `equipo` y el escritorio usa una **rejilla CSS** (columnas de medio paso de 72,5px; delante 1,3,5,7, atrás 2,4,6; fila de delante con `margin-top:-137px`): ya no hace falta mover tarjetas con JS para el carrusel;
- ponentes, niveles de patrocinio y QR se generan al compilar (no hay `innerHTML`);
- imágenes optimizadas por Astro (HTML de 52 KB frente a 867 KB), fuentes autoalojadas, CSP con hashes, cabeceras en `public/_headers`.
Decisión, seguridad y mejoras: `web/README.md`. Guía de uso: `web/site/README.md`.

## Pendiente — to-do

### Animación del equipo
- [x] **Fotograma intermedio "quitándose la capucha con las manos"** (sep 2026): capa `.layer-hands` entre capucha y rostro, con animación `hands-off` (1.3s). El rostro aparece a los 0.9s (si no, el pelo de Matías asomaba por encima de la capucha en la fase de manos). Con `prefers-reduced-motion` se salta las manos. La máscara del hover sigue usando capucha (reposo) y rostro (activo).
- [x] Matías con ilustraciones propias (capucha, manos, rostro). Yisus con fotograma de manos.
- [x] Daniel y Carlos ("Centryck") con ilustraciones propias; Yisus y Matías retocados (27 sep 2026).
- [ ] Ilustraciones del resto (Iria, Nacho, Tiziana) — hoy usan las de Yisus por defecto.
- [x] **Carrusel del equipo en móvil arreglado** (sep 2026). Las flechas saltaban desordenadas (Jesús → Nacho → Matías…) si la página se cargaba en escritorio y luego se estrechaba o giraba: `cards` se ordenaba una sola vez al cargar. Ahora:
  - En móvil un script saca las tarjetas de `.row-back`/`.row-front` y las pone directamente en `.formation-inner` en el orden de `equipo`; al volver a escritorio las devuelve a su fila. Así el DOM coincide con lo que se ve (flechas, tabulador, lectores de pantalla). Escucha `change` del media query **y** `resize` (el `change` no siempre llega).
  - Las flechas recalculan el orden en cada toque.
  - Verificado en Chrome headless (carga en móvil, y escritorio → móvil → escritorio). **Falta probar en Safari de Mac e iPhone real.**
- [x] ~~Revelado al tocar en tablets~~ (hecho, ver abajo). Nota original:: en pantallas táctiles de más de 680px no hay hover, así que no se puede quitar la capucha. Activar el revelado con un toque (`pointerdown`/`click` con `pointerType === "touch"`, o bajo `@media (hover: none)`): el toque en una silueta la marca `.is-active` y un toque fuera o en otra persona cambia la activa. Reutilizar el `pick()` por alfa de la silueta que ya existe para escritorio. Probar en iPad real (Safari).

### Contenido de la web
- [ ] Line-up de ponentes (hoy 6 tarjetas "Próximamente").
- [x] Medallones de nivel.
- [x] Rediseño de Patrocinadores.
- [ ] Logos de patrocinadores: array `niveles[i].logos = [{ src, alt }]`.
- [ ] Email real de patrocinio en el botón "Patrocina Pintega Conf" (ahora `mailto:` sin destinatario).
- [ ] Logos de colaboradores y comunidades.
- [ ] Precio de la entrada (tipos, qué incluye, plazas).
- [ ] **Pasarela de pago con Stripe** para comprar entradas (ya hay cuenta y TPV físico). Opción más simple sin backend: Stripe Payment Links o Checkout alojado; el botón COMPRAR lleva al checkout con los datos del formulario (email prellenado, cupón como código de promoción de Stripe). Hace falta: precio definido, producto en Stripe, páginas de éxito/cancelación, y textos legales (privacidad, condiciones de venta/devoluciones) antes de abrir la venta. Pagos de prueba en modo test antes de pasar a producción.
- [x] ~~Modo claro y modo oscuro~~ (hecho). Nota original:: pasar todos los colores a tokens en `:root`, respetar `prefers-color-scheme` y añadir un selector en la cabecera que guarde la preferencia. Revisar el contraste del dorado `#FDC330` sobre fondo claro (sobre blanco no cumple para texto), las ilustraciones del equipo, los medallones y el orbe en ambos modos.
- [ ] Agenda: pre-evento del viernes 9 (sin charlas; lugar por decidir, no es el Rectorado) y horario de charlas del sábado 10.
- [x] Textos corregidos (sep 2026): fuera "un solo track" y "la misma experiencia para todos"; el 9 es pre-evento y el 10 el día de charlas; se destaca la diversidad de perfiles. Aplicado en la web y en la temporal. Portada: "Sábado 10 de abril · día de charlas" + "Rectorado UDC" + "Viernes 9 · pre-evento, lugar por anunciar" (el pre-evento NO es en el Rectorado). Cuando se sepa el lugar del pre-evento, ponerlo en portada, formato y agenda de las dos webs.
- [x] Páginas de FAQ, código de conducta, aviso legal, privacidad y cookies (sep 2026). Privacidad y código de conducta adaptados de lareiraconf.es; titular Asociación Sysarmy Galicia. Pendiente: hosting (`alojamiento` en `src/data/legal.ts`) y revisión legal.

### Web temporal ("en obras")
- [x] **Página provisional hecha** (sep 2026): `web-temporal/index.html` + `web-temporal/assets/` (logo, orbe y huellas sacados de la web; `og.jpg` 1200×630 a partir del banner de Twitter; favicon). Portada mostaza con logo, lema "Código, comunidad y futuro", fecha/lugar/track y orbe; bloque "qué es"; tres llamadas (entradas "Avísame", ponentes, patrocinio) con `mailto:info@pintegaconf.es` (email tomado del banner); franja "web en obras". Open Graph y schema.org `Event` apuntan a `https://pintegaconf.es/` (dominio supuesto por el email). Sin scroll horizontal a 320/375/768/1024.
  - [x] Enlaces a redes (sep 2026) en el pie de la web temporal y de la web Astro: LinkedIn `linkedin.com/company/pintega-conf`, Instagram y X `@pintegaconf`. En Astro los perfiles están en `evento.redes` (`src/data/evento.ts`) y se pintan con `components/layout/Redes.astro`; también van en schema.org (`sameAs`) y `twitter:site`. Enlaces normales, sin widgets ni rastreo. En la temporal, además, bloque "Síguenos" en la portada con botones grandes (petición de Matías: son la única forma de enterarse de las novedades hasta que salga la web completa); en móvil el orbe va debajo del texto para que se vean sin bajar.
  - [ ] Confirmar dominio y email.
  - [ ] Probar en Safari/iPhone y publicar.

### Entradas
- [x] Entrada estilo Wallet (sep 2026): `.pass` dentro de `.pass-stage`; reutiliza por JS el logo de la cabecera, el orbe y las huellas (no duplica data URI). Campos: Charlas Sáb 10 abr, Asistente (del formulario), Entrada General, Lugar Rectorado UDC, Pre-evento Vie 9 abr. QR decorativo generado en JS (no es real). Muescas con círculos `var(--bg)` (no máscaras, por Safari). El ticket clásico sigue en el HTML: `data-ticket="clasico"` para volver a él.
- [ ] Cuando haya Stripe: QR/código real o quitar el QR del pase, y precio en la entrada.

### Marca
- [x] Nombre con tilde "Píntega Conf" en ambas webs (textos, títulos, metadatos, asuntos de email) y logo nuevo con la llama-tilde. `og.jpg` de la web temporal regenerado con el logo nuevo . Banners de Twitter y LinkedIn (`marca_and_rrss/`) con la tilde añadida: llama negra rellena encima de la I (variante del manual "fondo blanco / blanco y negro"), sacada del logo vectorial. El resto del banner se queda como está (decisión del usuario).

### Hecho (sep 2026, tanda 3)
- [x] Revelado al tocar en tablets/iPad (probado con toques simulados a 1024 y 1300: tocar, cambiar, volver a tocar, tocar fuera, arrastrar).
- [x] Modo claro/oscuro con botón en la cabecera (≥681px) y "Modo claro/oscuro" en el menú; se guarda en localStorage y se aplica antes de pintar.
- [x] Título, meta descripción, favicon, Open Graph/Twitter y schema.org `Event` en la web completa (imagen `https://pintegaconf.es/assets/og.jpg`: la de la web temporal, dominio sin confirmar).
- [x] Sin scroll horizontal de 320 a 1300px: a ≤360px la hamburguesa se salía y "PATROCINADORES" no cabía (ya pasaba antes); cabecera compacta y títulos a 32px.
- [x] Dragón: patrocinador exclusivo, un solo hueco ("Patrocinio principal · exclusivo").

### Revisión
- [ ] Probar en Safari de Mac y en iPhone real tras cada cambio.
- [ ] Aplicar lo que quede de `docs/propuestas-mejora.md`: SEO/Open Graph, rendimiento (sacar imágenes del HTML), accesibilidad, redes/newsletter.
