# Píntega Conf '27

[![Web](https://github.com/PintegaConf/pintegaconf-web/actions/workflows/web.yml/badge.svg)](https://github.com/PintegaConf/pintegaconf-web/actions/workflows/web.yml)
[![Privado](https://img.shields.io/badge/repositorio-privado-1C1C1B?logo=github&labelColor=1C1C1B)](#reglas)

Web de la conferencia tecnológica Píntega Conf '27 (A Coruña, 9 y 10 de abril de 2027) y contexto
del proyecto para Claude Code.

| Carpeta | |
|---|---|
| [`web/`](web/README.md) | La web y todo lo suyo: código (Astro), web temporal, material de diseño y herramientas. |
| [`claude/`](claude/README.md) | Contexto para Claude Code y guía para montar el proyecto en otro equipo. |

## Empezar

```sh
git clone git@github.com:PintegaConf/pintegaconf-web.git && cd pintegaconf-web
sh claude/setup.sh               # comprueba Node e instala las dependencias
cd web/site && npm run dev       # → http://localhost:4321
```

Requisitos y detalles: [`claude/README.md`](claude/README.md).

## Reglas

- 🔒 **El repositorio es privado** y debe seguir siéndolo.
- ✂️ **Commits pequeños y bien explicados:** un cambio por commit, y el mensaje dice qué cambia, por qué y qué se probó. Mover archivos va en su propio commit.
- 🌿 **Nada directo a `main`:** cada cambio va en una rama y entra por pull request. Cuando la PR pasa la CI, se fusiona sola en `main` (con rebase, conservando sus commits) y la rama se borra. Para que una PR **no** se fusione sola, ábrela como borrador (*draft*). Se fusionan solas las PR de ramas de este repositorio; las de Dependabot no.
  ```sh
  git switch -c tipo/descripcion-corta   # p. ej. web/ponentes, ci/…, docs/…
  git push -u origin HEAD && gh pr create --fill
  ```
  GitHub no deja bloquear `main` en un repositorio privado del plan Free, así que es una norma, no un bloqueo: quien tenga permiso de escritura podría subir a `main` igualmente. Por eso los demás tienen solo lectura.
- 🤖 **La CI tiene que salir en verde.** Los PR de Dependabot se revisan antes de fusionarlos.
- 🗂️ **No se suben** dossiers, contratos ni el manual de marca: se quedan en el equipo de Matías.
