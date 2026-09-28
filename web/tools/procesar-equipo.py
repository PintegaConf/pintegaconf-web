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

Además genera <slug>-cuerpo.webp: el encapuchado sin el difuminado de abajo (solo suaviza los lados).
Lo usa el grupo del escritorio en reposo, debajo de la capucha: los cuerpos se tapan unos a otros sin
huecos y un único degradado de la sección («suelo») funde la parte baja de todo el grupo a la vez.

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
PERSONAS = ("yisus", "iria", "matias", "nacho", "tiziana", "daniel", "carlos")
CAPAS = ("capucha", "manos", "rostro")


def mascara_hombros(ancho: int, alto: int) -> np.ndarray:
    """Opacidad (0..1) por píxel para difuminar la parte baja de la figura, en forma de busto.

    La túnica llega hasta los bordes del dibujo, así que un difuminado recto dejaba abajo un rectángulo
    con los bordes borrosos. Ahora el final del difuminado sigue una curva en U: en el centro solo se
    difumina un borde fino abajo (del 92,5 % al 99,5 % de la altura) y hacia los lados la curva sube
    (en el borde, del 63 % al 70 %), así que no quedan esquinas rectas. El cuerpo sigue opaco: nada de
    ver el orbe del fondo a través de las figuras.
    """
    y = np.arange(alto)[:, None] / alto
    u = np.abs(np.arange(ancho)[None, :] / ancho - .5) / .5     # 0 en el centro, 1 en los lados
    fin = .995 - .295 * u ** 2.4                                 # donde la opacidad llega a 0
    banda = .07                                                  # anchura del fundido
    return np.clip((fin - y) / banda, 0, 1)


def mascara_lados(ancho: int, alto: int) -> np.ndarray:
    """Para <slug>-cuerpo.webp: solo difumina los lados (8 %) en la parte baja, sin tocar el borde de abajo.

    En el grupo del escritorio los cuerpos se solapan y los tapa por abajo el «suelo» (un degradado de
    la sección); así solo hace falta suavizar los lados de las figuras de los extremos.
    """
    y = np.arange(alto)[:, None] / alto
    x = np.arange(ancho)[None, :] / ancho
    lados = np.minimum(np.clip(x / .08, 0, 1), np.clip((1 - x) / .08, 0, 1))
    peso = np.interp(y, [0, .55, .7, 1], [0, 0, 1, 1])
    return np.broadcast_to(1 - (1 - lados) * peso, (alto, ancho))


def procesar(slug: str) -> None:
    mascara = mascara_hombros(*SALIDA)
    for capa in CAPAS:
        img = Image.open(ORIGEN / slug / f"{slug}-{capa}.png").convert("RGBA")
        img = img.crop((0, 0, *LIENZO))   # algún original viene con 1 px de más (1237 de ancho)
        img = img.resize(SALIDA, Image.LANCZOS)
        rgba = np.array(img).astype(float)
        if capa == "capucha":
            cuerpo = rgba.copy()
            cuerpo[..., 3] *= mascara_lados(*SALIDA)
            guardar(cuerpo, f"{slug}-cuerpo.webp")   # para el grupo en reposo (escritorio)
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
