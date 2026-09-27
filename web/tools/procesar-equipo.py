#!/usr/bin/env python3
"""
Prepara las ilustraciones del equipo para la web.

Toma los dibujos originales de web/web_assets/designs/<persona>/ (lienzo 1236×1272, PNG con
transparencia) y genera en web/site/src/assets/equipo/ las tres capas del revelado:

    <slug>-capucha.webp   encapuchado (estado de reposo)
    <slug>-manos.webp     fotograma intermedio: manos quitándose la capucha
    <slug>-rostro.webp    sin capucha

Cada capa se reduce a 480×494 y lleva el difuminado de hombros INCRUSTADO en el canal alfa
(no se hace con máscara CSS: Safari pintaba líneas claras en los hombros durante la animación).

Además genera <slug>-cuerpo.webp: el encapuchado SIN difuminar. Lo usa la fila de atrás en reposo,
debajo de la capucha: su parte baja queda escondida tras la fila de delante, y así el cuello y el
pecho no se desvanecen en los huecos entre las capuchas de delante.

Uso:
    pip3 install --user pillow numpy
    python3 web/tools/procesar-equipo.py            # procesa todas las personas de PERSONAS
    python3 web/tools/procesar-equipo.py matias     # solo una

Para añadir a alguien: crea web/web_assets/designs/<slug>/ con sus dibujos renombrados como
<slug>-capucha.png, <slug>-manos.png y <slug>-rostro.png, añade su slug a PERSONAS y después
sus capas en src/data/equipo.ts.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parents[1]              # web/
ORIGEN = RAIZ / "web_assets" / "designs"
DESTINO = RAIZ / "site" / "src" / "assets" / "equipo"

LIENZO = (1236, 1272)   # tamaño de los dibujos originales
SALIDA = (480, 494)     # tamaño en la web (misma proporción)
CALIDAD_WEBP = 88

# Cada persona tiene su carpeta web/web_assets/designs/<slug>/ con una capa por archivo:
# <slug>-<capa>.png (p. ej. matias/matias-rostro.png). También hay <slug>-capucha-sola.png, que no se usa.
PERSONAS = ("yisus", "iria", "matias", "daniel", "carlos")
CAPAS = ("capucha", "manos", "rostro")


def mascara_hombros(ancho: int, alto: int) -> np.ndarray:
    """Opacidad (0..1) por píxel para difuminar la parte baja de la figura.

    - Vertical: opaco hasta el 72 % de la altura, baja al 66 % en el 86 % y llega a 0 en el 98,5 %.
    - Lados: 13 % de cada borde, que solo actúa en la parte baja (entra entre el 55 % y el 65 %).
    Son los mismos valores que tenían las imágenes de la v1.
    """
    y = np.arange(alto)[:, None] / alto
    x = np.arange(ancho)[None, :] / ancho
    vertical = np.interp(y, [0, .72, .86, .985, 1], [1, 1, .66, 0, 0])
    lados = np.minimum(np.clip(x / .133, 0, 1), np.clip((1 - x) / .133, 0, 1))
    peso_lados = np.interp(y, [0, .55, .65, 1], [0, 0, 1, 1])
    return vertical * (1 - (1 - lados) * peso_lados)


def procesar(slug: str) -> None:
    mascara = mascara_hombros(*SALIDA)
    for capa in CAPAS:
        img = Image.open(ORIGEN / slug / f"{slug}-{capa}.png").convert("RGBA")
        img = img.crop((0, 0, *LIENZO))   # algún original viene con 1 px de más (1237 de ancho)
        img = img.resize(SALIDA, Image.LANCZOS)
        rgba = np.array(img).astype(float)
        if capa == "capucha":
            guardar(rgba, f"{slug}-cuerpo.webp")   # sin difuminar, para la fila de atrás
        rgba[..., 3] *= mascara
        guardar(rgba, f"{slug}-{capa}.webp")


def guardar(rgba: np.ndarray, nombre: str) -> None:
    salida = DESTINO / nombre
    Image.fromarray(rgba.round().astype("uint8")).save(salida, "WEBP", quality=CALIDAD_WEBP, method=6)
    print(f"  {salida.relative_to(RAIZ)}  ({salida.stat().st_size // 1024} KB)")


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    slugs = sys.argv[1:] or list(PERSONAS)
    for slug in slugs:
        if slug not in PERSONAS:
            sys.exit(f"Persona desconocida: {slug}. Opciones: {', '.join(PERSONAS)}")
        print(slug)
        procesar(slug)


if __name__ == "__main__":
    main()
