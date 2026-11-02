# Imagen de la web de Píntega Conf: nginx sin privilegios (no corre como root) sirviendo archivos
# estáticos en el puerto 8080. El HTTPS lo pone el proxy o el hosting que haya delante.
#
#   docker build -t pintegaconf-web .
#   docker run --rm -p 8080:8080 pintegaconf-web      → http://localhost:8080
#
# De momento se publica la WEB TEMPORAL ("en obras"). Cuando toque la completa (Astro), se añade una
# etapa con Node 24 que haga `npm ci && npm run build` en web/site y se copia web/site/dist en su lugar.
# Versión fijada por hash; Dependabot la actualiza (.github/dependabot.yml).
FROM nginxinc/nginx-unprivileged:1.31.7-alpine@sha256:b5047b9b76845eac124358373c6852377c52e4b05834a47647e955dd91cb8f1e

COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY web/temporal/ /usr/share/nginx/html/
