# web/site — la web de Píntega Conf '27 (Astro)

Web estática: `npm run build` genera `dist/` con HTML, CSS, JS, fuentes e imágenes, listos para
subir a cualquier hosting. No hace falta Node en el servidor.

## Puesta en marcha

Requisito: Node 22.12 o superior (instalado Node 24 LTS con Homebrew). Como `node@24` es "keg-only",
hay que añadirlo al PATH una vez:

```sh
echo 'export PATH="/opt/homebrew/opt/node@24/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

```sh
cd web/site
npm ci            # instala EXACTAMENTE lo del package-lock.json (nunca `npm install` a secas)
npm run dev       # servidor local con recarga en http://localhost:4321
npm run build     # comprueba tipos y genera dist/
npm run preview   # sirve dist/ para verlo tal cual quedará publicado
npm run audit     # vulnerabilidades conocidas en las dependencias
npm run a11y      # compila y audita la accesibilidad (ver «Accesibilidad» más abajo)
```

## Estructura

```
src/
  pages/
    index.astro              la portada: solo ordena las secciones
    faq.astro                preguntas frecuentes (<details>, sin JS)
    aviso-legal.astro, privacidad.astro, cookies.astro   textos legales (BORRADOR hasta rellenar data/legal.ts)
    accesibilidad.astro      declaración de accesibilidad (actualizarla al revisar)
    seguridad.astro          seguridad y privacidad explicadas al visitante
  layouts/
    Base.astro               <head>: SEO, Open Graph, schema.org, fuentes, script del tema
    PaginaTexto.astro        páginas de texto: cabecera, menú, bloque de lectura y pie
  components/
    layout/                  Cabecera, Menu (desplegable), Pie
    secciones/               Portada, QueEs, Agenda, Ponentes, Patrocinadores, Logos, Equipo, Entradas
    entradas/                PaseWallet, TicketClasico, FormularioCompra, QrDecorativo
    LogoHueco.astro          un hueco de logo (logo real o "Tu logo aquí")
    Dato.astro               un dato legal o el hueco "pendiente: ..." si falta
  data/                      ← EL CONTENIDO. Casi todo lo que cambia se edita aquí
    evento.ts                fechas, lugares, email, descripciones
    navegacion.ts            secciones del menú y enlaces del pie
    equipo.ts                personas, fila y sus ilustraciones
    patrocinio.ts            niveles, logos de patrocinadores, colaboradores, comunidades
    ponentes.ts              line-up
    legal.ts                 titular de la web (nombre, NIF, domicilio) y hosting: PENDIENTE
  scripts/                   JavaScript del navegador (TypeScript), uno por comportamiento
    tema.ts, cabecera.ts, menu.ts
    equipo/revelado.ts       hover por silueta (ratón) y toques (tablet)
    equipo/carrusel.ts       carrusel del móvil: revelado automático y flechas
    entradas/pase.ts         nombre en vivo e inclinación 3D del pase
    entradas/formulario.ts   validación del formulario (sin pasarela)
    lib/medios.ts            media queries compartidas y utilidades
  styles/
    tokens.css               colores, tema claro/oscuro, puntos de corte (LEER antes de tocar colores)
    base.css                 reset y piezas compartidas (botones, títulos, paneles, huecos de logo)
  assets/                    imágenes que Astro optimiza (marca, medallones, equipo)
public/                      se copia tal cual: favicon, og.jpg, robots.txt, _headers
```

Cada componente lleva su propio CSS (`<style>` con ámbito: no afecta a otros componentes) y, si lo
necesita, importa su script. Los estilos que cruzan componentes (el desenfoque de la página cuando
se destapa a alguien del equipo) están marcados con `:global(...)`.

## Tareas habituales

- **Cambiar un texto o una fecha:** `src/data/evento.ts` o el componente de la sección.
- **Añadir un patrocinador:** guardar el logo en `src/assets/patrocinadores/`, importarlo en `src/data/patrocinio.ts` y añadirlo a `logos` del nivel: `{ src: logo, alt: "Empresa", url: "https://…" }`. El hueco "Tu logo aquí" desaparece solo.
- **Añadir ponentes:** `src/data/ponentes.ts`. Mientras la lista esté vacía se ven 6 tarjetas "Próximamente".
- **Ilustraciones de alguien del equipo:**
  1. Dejar sus dibujos (lienzo 1236×1272) en `web/web_assets/designs/<slug>/` con estos nombres: `<slug>-capucha.png`, `<slug>-manos.png`, `<slug>-rostro.png` (y `<slug>-capucha-sola.png`, que no se usa en la web).
  2. Añadir su slug a `PERSONAS` en `web/tools/procesar-equipo.py` y ejecutarlo (`python3 web/tools/procesar-equipo.py <slug>`).
  3. Importar las 3 imágenes en `src/data/equipo.ts` y ponerlas en su `ilustracion`.
- **Datos legales:** rellenar `src/data/legal.ts`. Cuando estén todos, desaparece el aviso de borrador de las páginas legales y el aviso del build. Los textos deberían revisarlos una persona experta antes de publicarlos.
- **Enlaces a páginas:** con barra final (`/faq/`, `/privacidad/`), que es la URL que genera Astro y la que aparece en el sitemap.
- **Volver al ticket clásico:** `DISENO_ENTRADA = "clasico"` en `components/secciones/Entradas.astro`.
- **Colores:** siempre con los tokens de `styles/tokens.css`, que tienen valor claro y oscuro. Nunca colores sueltos en las secciones.

## Reglas que vienen de la v1 (bugs ya resueltos: no volver atrás)

- **Difuminado de los hombros:** va incrustado en las imágenes (lo hace `procesar-equipo.py`). No usar máscaras CSS, que en Safari pintaban líneas.
- **"Paso al frente" del equipo:** si se cambian sus `transform` en `Equipo.astro`, hay que cambiar también `REPOSO`/`ACTIVA` en `scripts/equipo/revelado.ts`.
- **Fundidos del revelado:** capucha → manos → rostro. El rostro aparece a los 0,9 s y al salir se funde a la vez que vuelve la capucha; si no, el pelo que sobresale (rizos de Matías) se ve encima.
- **Scroll horizontal:** no puede haber en ningún ancho. Comprobar a 320, 375, 768 y 1024 px con `document.documentElement.scrollWidth === innerWidth`.
- **Navegadores:** probar en Safari (Mac, iPhone, iPad) además de Chrome.

## Accesibilidad (obligatoria: WCAG 2.2 AA)

`npm run a11y` compila la web y ejecuta `tests/accesibilidad.mjs` (necesita Google Chrome). La CI lo hace en cada cambio y falla si hay problemas:
- **axe-core** (WCAG 2.0, 2.1 y 2.2 A y AA + buenas prácticas) en todas las páginas, en escritorio y móvil, en los temas oscuro y claro, y con el menú abierto.
- **Recorrido real con Tab:** nombre accesible, foco visible, foco no tapado por la cabecera y objetivos de 24×24 px.
- **Espaciado de texto** (1.4.12), **reducir movimiento** y **palabras pegadas** a enlaces o negritas.
- **Comportamientos:** Escape en el equipo, flechas del carrusel, cierre del menú y errores del formulario.

Opciones:
- `A11Y_DETALLE=1`: orden de tabulación completo.
- `A11Y_REVISAR=1`: casos que axe no puede decidir (texto sobre degradados), para revisar el contraste a mano.
- `A11Y_DIST=../temporal A11Y_PAGINAS=/`: auditar otra web.

Lo que la herramienta NO cubre y hay que revisar a mano en cambios visuales:
- el **modo de alto contraste** (colores forzados: nada que dependa solo del color de fondo);
- los **lectores de pantalla reales**: VoiceOver, NVDA y TalkBack. Aún no se ha hecho, y está anotado en la declaración.

Reglas:
- Foco: solo el global de `base.css`. No hay que añadir estilos de foco por componente.
- Nada animado más de 5 s sin forma de pararlo.
- Errores de formulario asociados a su campo.
- Controles con borde transparente, para que tengan contorno en alto contraste.
- Si cambia algo relevante, actualizar la fecha y los pendientes de `pages/accesibilidad.astro`.

## Seguridad

- **CSP:** va en un `<meta>` que genera Astro (`astro.config.mjs` → `security.csp`), con hash de cada script y estilo propio. Si un script externo nuevo deja de funcionar, es la CSP: hay que añadir su origen en `directives`, a conciencia.
- **Cabeceras HTTP:** `public/_headers` (formato de Netlify y Cloudflare Pages). En nginx, el equivalente es:
  ```nginx
  add_header Content-Security-Policy "frame-ancestors 'none'" always;
  add_header X-Frame-Options DENY always;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options nosniff always;
  add_header Referrer-Policy strict-origin-when-cross-origin always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;
  location /_astro/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
  ```
- **Dependencias:** `.npmrc` impide scripts de instalación y fija versiones exactas. Para actualizar:
  1. `npm outdated`;
  2. leer el changelog y los avisos de seguridad;
  3. `npm install astro@X.Y.Z`;
  4. `npm run build`;
  5. probar;
  6. commit del `package-lock.json`.
- **`public/.well-known/security.txt`** (RFC 9116): contacto para avisar de fallos. **Caduca el 26-09-2027**: renovarlo antes.
- **Distintivos del pie** (`components/layout/Distintivos.astro`): solo compromisos reales y comprobables, enlazados a su página. Nada de sellos oficiales que no se tengan.
- **Telemetría de Astro:** desactivada en esta máquina (`npx astro telemetry disable`).
- Análisis completo en `web/README.md`.
