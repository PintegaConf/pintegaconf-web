#!/bin/sh
# Pone a punto el proyecto tras clonarlo: comprueba Node y instala las dependencias EXACTAS del
# package-lock.json (npm ci). Uso, desde la raíz del repositorio:  sh claude/setup.sh
set -eu

raiz=$(cd "$(dirname "$0")/.." && pwd)
sitio="$raiz/web/site"

if ! command -v node >/dev/null 2>&1; then
  # En macOS con Homebrew, node@24 no se añade al PATH solo
  if [ -x /opt/homebrew/opt/node@24/bin/node ]; then
    PATH="/opt/homebrew/opt/node@24/bin:$PATH"
    echo "Aviso: uso Node de /opt/homebrew/opt/node@24/bin. Añádelo a tu PATH (ver claude/README.md)."
  else
    echo "Falta Node.js 22.12 o superior. Instálalo (ver claude/README.md) y vuelve a ejecutar." >&2
    exit 1
  fi
fi

# Astro 7 necesita Node >= 22.12
version=$(node -p 'process.versions.node')
if ! node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>22||(a===22&&b>=12)?0:1)'; then
  echo "Node $version es demasiado antiguo: hace falta 22.12 o superior (recomendado 24 LTS)." >&2
  exit 1
fi
echo "Node $version: OK"

cd "$sitio"
# npm ci: instala exactamente lo del lockfile; .npmrc impide que los paquetes ejecuten scripts al instalarse
npm ci
npm audit --omit=dev || echo "Ojo: npm audit ha encontrado avisos; revísalos antes de publicar."

echo
echo "Listo. Para ver la web:  cd web/site && npm run dev   → http://localhost:4321"
