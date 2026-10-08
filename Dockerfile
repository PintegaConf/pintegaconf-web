# Imagen de la web de Píntega Conf: nginx sin privilegios (no corre como root) sirviendo archivos
# estáticos en el puerto 8080. El HTTPS lo pone el proxy o el hosting que haya delante.
#
#   docker build -t pintegaconf-web .
#   docker run --rm -p 8080:8080 pintegaconf-web      → http://localhost:8080
#
# De momento se publica la WEB TEMPORAL ("en obras"). Cuando toque la completa (Astro), se añade una
# etapa con Node 24 que haga `npm ci && npm run build` en web/site y se copia web/site/dist en su lugar.
# Versión fijada por hash; Dependabot la actualiza (.github/dependabot.yml).
FROM nginxinc/nginx-unprivileged:1.30.5-alpine@sha256:15c994d10d6d78658721c3bcafff14cb281fba2a4bdf9d5ba92c416a472516e3

COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY web/temporal/ /usr/share/nginx/html/
