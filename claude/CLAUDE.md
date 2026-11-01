# Píntega Conf '27 — contexto para Claude Code

Conferencia tecnológica anual. Este archivo lo carga Claude Code a través del `CLAUDE.md` de la raíz del repositorio (que solo contiene `@claude/CLAUDE.md`).
Idioma de trabajo: **español**. El usuario es Matías (organización, sistemas/infra).

## Datos del evento (confirmados)

- **Contacto:** info@pintegaconf.es (también para patrocinio). **Redes:** LinkedIn `linkedin.com/company/pintega-conf`, Instagram y X `@pintegaconf` (enlazadas en el pie de las dos webs). **En la web temporal tienen que verse a simple vista en la portada** (bloque "Síguenos" bajo la fecha y el lugar, visible sin bajar también en móvil): mientras no esté la web completa son la única vía para enterarse de las novedades. Dominio previsto: pintegaconf.es (sin confirmar).

- **Fecha:** 9 y 10 de abril de 2027 (viernes y sábado). Ojo: el diseño de Penpot decía "21 de marzo" y la descripción antigua del proyecto "9-10 de marzo"; ambas están desfasadas.
- **Programa:** viernes 9 = **pre-evento** (sin charlas, en **otro sitio aún por decidir**, no en el Rectorado); sábado 10 = **día principal** (charlas, ponentes, patrocinadores, networking).
- **Lugar:** Rectorado UDC, A Coruña.
- **No usar "un solo track"** en los textos (confunde; el usuario lo descartó). El público y los ponentes son de perfiles, edades y cargos muy distintos: los textos deben reflejar esa diversidad, nada de "la misma experiencia para todos".
- **Objetivos:** conseguir patrocinadores, ponentes, tener la web y crecer en redes sociales (captar gente interesada en asistir).
- **Nombre con tilde: "Píntega Conf" / "PÍNTEGA CONF"** en todos los textos visibles, títulos, metadatos y asuntos de email. Sin tilde solo en identificadores técnicos (dominio `pintegaconf.es`, email, ids `#pintega`, nombres de archivo). En el logo la tilde es la llamita encima de la salamandra (manual actualizado sep 2026).
- Sucesora de **Lareira Conf**. La cuenta de Instagram de Lareira (~1000 seguidores, con su propio CM) se usa para promocionar Pintega, pero su CM solo publica contenido con la estética pixel-art/hoguera de Lareira.
- **Mascota:** la píntega (salamandra de fuego negra con manchas amarillas, la del logo). "Píntega" = salamandra en gallego. **No reutilizar a Lumi** (mascota de Lareira, diseñada por otra persona).
- **Equipo** (orden de la sección EQUIPO): Jesús, Iria, Matías, Nacho, Tiziana, Daniel, Carlos — rol "Organización".
- **Entradas:** se venden con **Weezevent** (decisión del 30-10-2026; sustituye a Stripe: una plataforma de empresa ya trae panel, QR, facturas y reembolsos). La web solo enlaza a su tienda (sin iframe ni scripts suyos). Cobro, facturas, QR, SLA y lista de comprobación antes de abrir la venta: `claude/docs/entradas-weezevent.md`. **Tres entradas** (31-10-2026), precio final con IVA y comisión incluidos, las tres con el pre-evento del viernes y el sábado de charlas: **Chispa 30 €** (sin post-evento), **Llama 40 €** (con post-evento) y **Hoguera 60 €** (con post-evento y un regalo, aún sin concretar). Cada una tiene además su tarifa early bird en Weezevent (precio y plazo por confirmar).
- **Oferta a ponentes:** viaje y hotel cubiertos, entrada full-pass, cena en el post-evento (no hay cena solo de ponentes), grabación de la charla + difusión en web/redes, regalo de ponente.
- **Charlas:** 30–45 min de media, duraciones variadas (no slot fijo). La agenda la organizará Matías más adelante.
- **Niveles de patrocinio:** Dragón > Basilisco > Tritón > Ajolote. **Dragón es exclusivo: una sola empresa** (un único hueco en la web).
- **Patrocinadores confirmados (1-11-2026):** Basilisco: Raiola Networks, Next Digital y Allenta; Tritón: Teimas. **Denodo (Basilisco) aún no ha firmado:** su logo está en el repositorio pero desactivado (línea comentada en `patrocinio.ts`); activarlo cuando Matías lo confirme. Logos en `web/site/src/assets/patrocinadores/` (los de la web de Lareira, `Gallegarmy/LareiraConf-MainPage`, `src/img/sponsors/`; el de Allenta lo pasó Matías). Revisar cada SVG antes de meterlo (sin scripts ni enlaces externos) y que su tamaño óptico cuadre con los demás (al de Allenta se le dio margen en el `viewBox`).

## Mapa

Repositorio **github.com/PintegaConf/pintegaconf-web — PRIVADO (debe seguir siéndolo)**, organización PintegaConf (dueño: Matías). Solo versiona `claude/` y `web/` (`.gitignore` en modo lista blanca).

- `claude/docs/contexto-web.md`: historial de decisiones de la web — **LEER antes de tocar la web**. `claude/docs/entradas-weezevent.md`: venta de entradas. `web/README.md`: reglas del repositorio.
- `web/site/` (Astro) es la **fuente de verdad**; `web/backup/` y `web/web_assets/equipo/` son solo referencia antigua.
- Ilustraciones del equipo en `web/web_assets/designs/<persona>/` (Yisus = Jesús, Carlos = "Centryck"); nombres de archivo en `web/CLAUDE.md` → «Nuevas ilustraciones».

**Solo en el equipo de Matías, NO en el repositorio** (pedírselos si hacen falta): `dossiers/` (ponentes y patrocinio, PDF), `contracts/` (**confidencial: no subir a ningún sitio**), `marca_and_rrss/` (manual de marca PDF, banners de LinkedIn/Twitter, colaboraciones con Lareira/Sysarmy, logos PNG con tilde), `Claude outputs/` (v1 antigua y dossier).

**Importante:** la web se edita en `web/site/` (Astro). Node 24 LTS (en el Mac de Matías: `/opt/homebrew/opt/node@24/bin`, keg-only, hay que tenerlo en el PATH).
CI: `.github/workflows/web.yml` (GitHub Actions, gratis en el plan Free); debe quedar en verde. Dependabot abre PR semanales: revisar antes de fusionar.
Seguridad del proyecto: `.npmrc` con `ignore-scripts` y versiones exactas (no quitar), CSP en `astro.config.mjs` (no añadir orígenes externos sin motivo), fuentes autoalojadas (nunca volver a cargar de Google), nada de `innerHTML` con datos: renderizar en Astro o usar `textContent`.

## Marca / tokens

- Dorado web `#FDC330` (manual: `#FDC822`), negro `#1C1C1B`, fondo oscuro `#232323`.
- Tipografías: Arima (títulos, 48px), Roboto Mono (texto 14px), Source Sans 3 (formulario/footer). Manual: Arima Madurai Bold + Roboto; logo en Alodiya.
- Logo: `marca_and_rrss/` tiene los PNG nuevos (596×596, con tilde). Para la web se usa el vectorial sacado de la pág. 16 del manual → `web/site/src/assets/marca/logo-horizontal.svg` (copia en `web/temporal/assets/logo-pintega-horizontal.svg`).
- Estilo: silueta de salamandra negra sobre mostaza, recorte de papel plano, 2 tonos.

## Reglas al trabajar en la web

- **Ramas y PR, nunca push a `main` (MUY IMPORTANTE):** cada cambio en una rama nueva desde `main` actualizado (`git switch -c tipo/descripcion`), push y `gh pr create`. El job «Fusionar en main» de `web.yml` la fusiona solo (rebase) cuando pasa la CI; no hace falta fusionar a mano. Borrador = no se fusiona. En local hay un hook `pre-push` que impide subir a `main`; no saltárselo con `--no-verify`. Después de la fusión: `git switch main && git pull`. (En el plan Free privado, GitHub no permite proteger `main` de verdad.)
- **Commits a GitHub (MUY IMPORTANTE):** cada commit trata **un solo cambio** y su mensaje explica bien **qué cambia y por qué** (y qué se ha probado). Nada de commits de mil cosas a la vez con miles de líneas: arreglos, reorganizaciones y contenido nuevo van en commits separados. Los movimientos de archivos, en un commit propio sin ediciones mezcladas.
- **ACCESIBILIDAD OBLIGATORIA (WCAG 2.2 AA + buenas prácticas, al pie de la letra):** todo el mundo tiene que poder usar la web, en todos los navegadores y dispositivos. Teclado perfecto (orden lógico, foco siempre visible y nunca tapado por la cabecera fija), contraste AA en los dos temas (también bordes de campos y foco, 3:1), `prefers-reduced-motion`, nada animado de más de 5 s sin pausa, nombres accesibles, landmarks, un solo h1 y errores de formulario asociados a su campo. Ningún cambio se da por bueno sin comprobarlo: `npm run a11y` (axe, Tab real, espaciado, movimiento, palabras pegadas, comportamientos; también en la CI) + panel Audit + alto contraste a mano en cambios visuales. Mantener al día `pages/accesibilidad.astro` (declaración). Distintivos del pie: solo compromisos reales, nunca sellos oficiales que no se tengan. Puede haber una ponente de accesibilidad: la web tiene que ser ejemplar.
- **"Audit" = panel Audit de la barra de desarrollo de Astro** (accesibilidad y rendimiento en `npm run dev`), no `npm audit` (vulnerabilidades de dependencias). Revisar los dos y no decir "0 problemas" sin haber mirado el panel.
- **Reglas de diseño y código de la web** (Safari, equipo, temas, entradas, edición reutilizable…): en `web/CLAUDE.md`, que se carga al trabajar en `web/`.

## Pendiente (resumen — detalle en claude/docs/contexto-web.md)

- **Venta de entradas con Weezevent:** tarifas (con early bird) y los enlaces de los tres módulos filtrados ya están (1-11-2026). Las webs están en «Muy pronto a la venta». Falta abrir la venta en Weezevent (y entonces `ventaAbierta = true` y quitar `venta-pronto` en la temporal), poner en la web los precios early bird y quitar el borrador de la PR #26. **Ojo al fusionar:** `deploy.yml` publica en el servidor al fusionar una PR en `main`. Lista completa en `claude/docs/entradas-weezevent.md`.
- Web temporal "en obras" hecha en `web/temporal/`, con fuentes autoalojadas, CSP propia y aviso legal en `/aviso-legal/` (copia del de Astro sin el enlace a privacidad/cookies: si cambia uno, cambiar el otro). Portada compacta en ≤ 480 px para que las redes se vean sin bajar en un iPhone SE (375×548). Es la que se va a publicar (ver Publicación).
- Line-up de ponentes, el resto de patrocinadores (`logos` de cada nivel en `web/site/src/data/patrocinio.ts`), colaboradores y comunidades.
- Agenda: detalles del pre-evento (viernes 9) y horario de charlas (sábado 10).
- **Accesibilidad: probar con lectores de pantalla reales** (VoiceOver macOS/iOS, NVDA, TalkBack) y actualizar la declaración. Lo automático y el teclado ya están (sep 2026).
- **Renovar `security.txt`** antes del 26-09-2027.
- **Traducciones: inglés y gallego** además del español (idioma por defecto). Plan técnico en `web/README.md` → Mejoras propuestas.
- Páginas FAQ, código de conducta, aviso legal, privacidad y cookies: **hechas** (sep 2026). Privacidad y código de conducta están basados en los de lareiraconf.es (misma organización; cambiar "Lareira Conf" por "Píntega Conf"). **Titular: Asociación Sysarmy Galicia** (NIF G21961842, Travesía de Arteixo 5, 3.º dcha., Arteixo); email legal y de denuncias `administracion@sysarmygalicia.com` (las consultas generales siguen en info@pintegaconf.es). Contactos de Telegram del código de conducta en `web/site/src/data/conducta.ts`. Los textos de Lareira están revisados y estuvieron en producción: mantener su contenido tal cual (p. ej. las comunicaciones de próximas ediciones a quien compra entrada por interés legítimo, con opción de oponerse), sin "mejorarlos" por nuestra cuenta. Las legales siguen en BORRADOR: falta el hosting en `web/site/src/data/legal.ts` y una revisión legal. No inventar datos.
- Web v2 en Astro hecha y probada por Matías en Safari de Mac, iPhone e iPad (sep 2026). Falta publicarla (el código ya está en el repo privado).
- **Publicación (8-10-2026):** Matías decidió publicar **solo la web temporal**; la completa sigue sin publicar hasta que él lo diga. Se despliega con el `Dockerfile` de la raíz (lo pidió Nacho para desplegar). Si cambian las cabeceras, cambiarlas en `web/nginx.conf` y en `web/site/public/_headers`. HSTS activado: el dominio tendrá HTTPS (confirmado por Matías). Mejoras propuestas en `web/README.md` (accesibilidad, CI, RGPD del formulario, web temporal dentro de Astro).
