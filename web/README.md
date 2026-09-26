# Web de Píntega Conf '27

[![Astro](https://img.shields.io/badge/Astro-7.3.5-FDC330?logo=astro&logoColor=white&labelColor=1C1C1B)](https://astro.build)
[![Node](https://img.shields.io/badge/Node-%E2%89%A5%2022.12-FDC330?logo=nodedotjs&logoColor=white&labelColor=1C1C1B)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-estricto-FDC330?logo=typescript&logoColor=white&labelColor=1C1C1B)](site/tsconfig.json)
[![Web estática](https://img.shields.io/badge/salida-100%25%20est%C3%A1tica-FDC330?labelColor=1C1C1B)](site/astro.config.mjs)
[![CSP](https://img.shields.io/badge/CSP-hashes%20%2B%20cabeceras-FDC330?labelColor=1C1C1B)](site/public/_headers)
[![Fuentes](https://img.shields.io/badge/fuentes-autoalojadas%20%28RGPD%29-FDC330?labelColor=1C1C1B)](#análisis-de-seguridad-y-privacidad)

Comandos, estructura del código y cómo añadir contenido: [`site/README.md`](site/README.md).

```
web/
  site/          ← LA WEB (v2, Astro). Código fuente: se edita aquí. Guía práctica en site/README.md
  web_assets/    ← material original de diseño (ilustraciones, medallones, orbes). No se sirve tal cual.
  tools/         ← herramientas: procesar-equipo.py (prepara las ilustraciones del equipo)
  temporal/      ← web provisional "en obras" (un solo HTML + assets/), para publicar mientras tanto
  backup/        ← copia de la v1 (archivo único) y de la web temporal, tal como estaban. Referencia; no se toca.
```

La v1 (`backup/pintega-conf-web.v1.html`) era un único HTML de 867 KB y ~1.080 líneas con todo
dentro: CSS, JavaScript y las imágenes en base64. La v2 es la misma web, visualmente idéntica,
reorganizada en componentes. Se comparó captura a captura en escritorio y móvil.

## Antes de subir un cambio de la web

- `npm run build` sin errores (lo mismo que comprueba la CI).
- El panel **Audit** de `npm run dev` (barra inferior de Astro) sin avisos nuevos.
- Probado también en **Safari** (Mac, iPhone y, si toca el equipo, iPad).

Las reglas generales del repositorio (privado, commits pequeños) están en el [README principal](../README.md#reglas).

## Por qué Astro

Se valoraron tres opciones: Astro, Hugo y HTML/CSS/JS sin framework. Las tres generan HTML estático,
así que en producción no hay servidor que atacar.

| | A favor | En contra |
|---|---|---|
| **Astro 7** (elegido) | Componentes (`.astro` = HTML + su CSS + su JS) · optimiza imágenes solo (WebP, tamaños, `srcset`) · 0 JS salvo lo interactivo · TypeScript · aloja las fuentes de Google en nuestro dominio · CSP con hashes automática · plantillas para las páginas que vienen (FAQ, legales) | Necesita Node.js y ~270 paquetes npm → riesgo de cadena de suministro (2026 ha tenido ataques grandes a npm) · una versión mayor al año · paso de build |
| Hugo | Un solo binario, sin npm · muy rápido | Plantillas en sintaxis Go, más áridas · peor para componentes interactivos |
| Sin framework | Cero dependencias | Cabecera/pie duplicados en cada página nueva · imágenes optimizadas a mano |

Cómo se mitigan los contras de Astro:
- **npm:** ningún paquete ejecuta scripts al instalarse (`ignore-scripts`, que es por donde entran esos ataques). Versiones exactas, lockfile e instalación siempre con `npm ci`.
- **Auditoría:** `npm audit` da hoy 0 vulnerabilidades.
- **Actualizaciones:** subir Astro de forma consciente, leyendo sus avisos de seguridad.
- **Superficie de ataque:** solo se usa la salida estática. Las vulnerabilidades de Astro publicadas en 2026 son casi todas del modo servidor (SSR, server islands), que aquí no existe.

## Análisis de seguridad y privacidad

### Problemas de la v1, resueltos en la v2

| # | Problema en la v1 | Riesgo | Solución en la v2 |
|---|---|---|---|
| 1 | Fuentes cargadas desde `fonts.googleapis.com` | Cada visita enviaba la IP del visitante a Google. En Alemania se ha multado por esto (RGPD, Múnich 2022) | La API de fuentes de Astro las descarga al compilar y las sirve desde nuestro dominio. 0 peticiones a Google |
| 2 | HTML generado con `innerHTML` y plantillas de texto (ponentes, patrocinadores, equipo, QR) | XSS latente: si esos datos llegasen algún día de fuera (un CMS, el `alt` de un logo), se ejecutaría HTML/JS | Todo se genera al compilar con Astro, que escapa los textos. El nombre del formulario va al pase con `textContent`. Probado con `<b>` en el nombre: no se interpreta |
| 3 | Sin Content-Security-Policy ni cabeceras de seguridad | Ninguna defensa si se colase un script | CSP estricta en cada página: solo scripts y estilos propios, con hash. `_headers` añade anti-iframe, HSTS, `nosniff`, `Referrer-Policy` y `Permissions-Policy` |
| 4 | Todo en línea (scripts y estilos) | Imposible poner una CSP estricta | Scripts y CSS en archivos. Solo quedan en línea el tema (antes de pintar) y los datos schema.org, ambos con hash |
| 5 | 867 KB de HTML con imágenes en base64 | Sin caché, carga lenta en móvil, imágenes a tamaño fijo | HTML de 52 KB; imágenes WebP con varios tamaños y nombres con hash (caché de un año) |
| 6 | Enlaces de logos sin `rel` | El sitio enlazado podría controlar nuestra pestaña (`window.opener`) | `rel="noopener noreferrer"` en todos los enlaces externos |
| 7 | Campos del formulario sin límite | Datos enormes o basura | `maxlength` en todos los campos |

### Pendiente (no se puede cerrar solo con código)

- **Formulario de compra y RGPD:** hoy no envía datos a ningún sitio. Antes de activarlo (con Stripe) hacen falta:
  - la política de privacidad publicada y enlazada junto al formulario;
  - la base legal y el responsable del tratamiento;
  - quitar los campos que no sean necesarios ("Trabajo en..." ¿hace falta?).
- **Stripe:** usar **Stripe Checkout** o **Payment Links**, de modo que la tarjeta nunca pase por nuestra web. Para crear la sesión de pago y recibir los webhooks hará falta una función serverless pequeña (Cloudflare/Netlify), con la clave secreta solo en el servidor y la firma de los webhooks verificada.
- **Hosting:** las cabeceras de `public/_headers` funcionan en Netlify y Cloudflare Pages. En nginx hay que traducirlas (ver `site/README.md`). HSTS solo cuando el HTTPS esté funcionando.
- **Email en claro** (`mailto:info@…`): los bots lo recogen para spam. Es aceptable para una conferencia; la alternativa sería un formulario de contacto.
- **Analítica:** ahora no hay ninguna, así que no hace falta banner de cookies. Si se añade, que sea sin cookies (Plausible, Umami autoalojado…) o habrá que poner banner con opción de rechazar.

## Mejoras propuestas (siguientes pasos)

1. ~~Páginas de FAQ, aviso legal, privacidad y cookies~~ **Hechas** (las legales, como BORRADOR hasta tener los datos del titular en `site/src/data/legal.ts` y una revisión legal). Además: sitemap (`@astrojs/sitemap`) y aviso de privacidad junto al formulario de compra.
2. **Integración de Stripe** (ver arriba).
3. **Accesibilidad:**
   - enlace "saltar al contenido";
   - revisar el orden de foco del menú;
   - comprobar el contraste del modo claro con una herramienta;
   - probar con VoiceOver en iPhone y Mac.
4. ~~Integración continua~~ **Hecho:** workflow `.github/workflows/web.yml` (tipos, build y `npm audit` en cada cambio de `web/site`) y **Dependabot** (`.github/dependabot.yml`), más alertas y correcciones automáticas de seguridad activadas en el repositorio.
5. **Web temporal** como segunda página del proyecto Astro (hoy está suelta en `web-temporal/`), para compartir cabecera, fuentes y CSP.
6. **Traducciones al inglés y al gallego** (el español sigue siendo el idioma por defecto). Plan:
   - **Rutas:** usar el enrutado de idiomas que Astro trae de serie (`i18n` en `astro.config.mjs`, `locales: ["es", "en", "gl"]`, `defaultLocale: "es"`). Así el español sigue en `/` y los otros idiomas van en `/en/` y `/gl/`. No hace falta ninguna integración.
   - **Textos:** sacar los que hoy están escritos dentro de los componentes a diccionarios por idioma (p. ej. `src/i18n/{es,en,gl}.ts`), junto con los textos de `src/data/`, y un selector de idioma en la cabecera y el menú.
   - **SEO:** `<html lang>` según el idioma, etiquetas `hreflang` entre versiones y la opción `i18n` de `@astrojs/sitemap`.
   - **Legales:** el aviso legal, la privacidad y las cookies también se traducen; la versión en español sigue siendo la de referencia.
   - El nombre "Píntega" se mantiene en todos los idiomas (es gallego).
7. **Probar en Safari (Mac, iPhone, iPad).** Se ha verificado en Chrome; Safari ha dado bugs propios en la v1.
