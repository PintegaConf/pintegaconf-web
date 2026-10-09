# Píntega Conf '27

[![Web](https://github.com/PintegaConf/pintegaconf-web/actions/workflows/web.yml/badge.svg)](https://github.com/PintegaConf/pintegaconf-web/actions/workflows/web.yml)

Web de la conferencia tecnológica Píntega Conf '27 (A Coruña, 9 y 10 de abril de 2027) y contexto
del proyecto para Claude Code.

## Reglas

- ✂️ **Commits pequeños y bien explicados:** un cambio por commit, y el mensaje dice qué cambia, por qué y qué se probó. Mover archivos va en su propio commit.
- 🌿 **Nada directo a `main`:** cada cambio va en una rama y entra por pull request. Cuando la PR pasa la CI, se fusiona sola en `main` (con rebase, conservando sus commits) y la rama se borra. Para que una PR **no** se fusione sola, ábrela como borrador (*draft*). Se fusionan solas las PR de ramas de este repositorio; las de Dependabot no.
  ```sh
  git switch -c tipo/descripcion-corta   # p. ej. web/ponentes, ci/…, docs/…
  git push -u origin HEAD && gh pr create --fill
  ```
- 🤖 **La CI tiene que salir en verde.** Los PR de Dependabot se revisan antes de fusionarlos.
- 🗂️ **No se suben** dossiers, contratos ni el manual de marca
