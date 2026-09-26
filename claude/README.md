# Montar el proyecto en otro equipo

Guía para clonar el repositorio y dejarlo listo para trabajar en la web, con o sin Claude Code.

## 1. Requisitos

| Herramienta | Para qué | Cómo instalarla |
|---|---|---|
| **git** + acceso a la organización **PintegaConf** en GitHub | clonar (el repositorio es privado) | pedir acceso a Matías; clave SSH añadida a tu cuenta de GitHub |
| **Node.js 22.12 o superior** (recomendado 24 LTS) | compilar y ver la web | macOS: `brew install node@24` y añadir `/opt/homebrew/opt/node@24/bin` al PATH · Linux/Windows: [nodejs.org](https://nodejs.org) o `nvm install 24` |
| Python 3 + Pillow + numpy *(opcional)* | solo para preparar ilustraciones del equipo | `pip3 install --user pillow numpy` |
| Claude Code *(opcional)* | trabajar con Claude en el proyecto | [claude.com/claude-code](https://claude.com/claude-code) |

## 2. Clonar y arrancar

```sh
git clone git@github.com:PintegaConf/pintegaconf-web.git
cd pintegaconf-web
sh claude/setup.sh        # comprueba Node e instala las dependencias exactas (npm ci)
cd web/site
npm run dev               # la web en http://localhost:4321
```

Cómo funciona la web, dónde está cada cosa y cómo añadir contenido: `web/site/README.md`.
Reglas del repositorio (privado, commits pequeños y bien explicados, CI en verde): `README.md` de la raíz.

## 3. Trabajar con Claude Code

Abrir Claude Code **en la raíz del repositorio** (`pintegaconf-web/`). El `CLAUDE.md` de la raíz importa
`claude/CLAUDE.md`, así que Claude carga solo:
- los datos confirmados del evento (fechas, lugar, nombre con tilde, niveles de patrocinio…);
- las reglas de trabajo en la web (bugs de Safari ya resueltos, revelado del equipo, tema claro/oscuro, commits);
- los pendientes.

El historial detallado de decisiones está en `claude/docs/contexto-web.md`. Conviene pedirle a Claude que lo lea antes de tocar partes delicadas de la web (el equipo, el carrusel, el pase).

La memoria personal de Claude de cada equipo no viaja con el repositorio. Todo lo importante está escrito en `claude/CLAUDE.md`.

## 4. Lo que NO está en el repositorio

Por confidencialidad o tamaño, estas carpetas del proyecto solo están en el equipo de Matías:
`dossiers/`, `contracts/` (confidencial), `marca_and_rrss/` (manual de marca, banners, logos PNG) y `Claude outputs/`.
Si necesitas algo de ahí, pídeselo. **Los contratos nunca se suben a ningún sitio.**
