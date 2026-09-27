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

Uso:
    pip3 install --user pillow numpy
    python3 web/tools/procesar-equipo.py            # procesa todas las personas de PERSONAS
    python3 web/tools/procesar-equipo.py matias     # solo una

Para añadir a alguien: crea web/web_assets/designs/<carpeta>/ con sus tres dibujos, añade su entrada
a PERSONAS y después su `slug` en src/data/equipo.ts.
"""
import sys
import unicodedata
from pathlib import Path

import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parents[1]              # web/
ORIGEN = RAIZ / "web_assets" / "designs"
DESTINO = RAIZ / "site" / "src" / "assets" / "equipo"

LIENZO = (1236, 1272)   # tamaño de los dibujos originales
SALIDA = (480, 494)     # tamaño en la web (misma proporción)
CALIDAD_WEBP = 88

# slug -> (carpeta, {capa: nombre de archivo}). Los nombres son los que entregó cada ilustrador.
PERSONAS = {
    "yisus": ("yisus", {
        "capucha": "Yisus capucha.png",
        "manos": "Yisus capucha manos.png",
        "rostro": "Yisus sin capucha.png",
    }),
    "matias": ("matias", {
        "capucha": "Matías con capucha.png",
        "manos": "Matias capucha manos.png",
        "rostro": "Matias.png",
    }),
}


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


def buscar(carpeta: Path, nombre: str) -> Path:
    """Encuentra el archivo aunque macOS haya guardado la tilde descompuesta (NFD)."""
    objetivo = unicodedata.normalize("NFC", nombre)
    for f in carpeta.iterdir():
        if unicodedata.normalize("NFC", f.name) == objetivo:
            return f
    raise FileNotFoundError(f"No encuentro «{nombre}» en {carpeta}")


def procesar(slug: str) -> None:
    carpeta, capas = PERSONAS[slug]
    mascara = mascara_hombros(*SALIDA)
    for capa, nombre in capas.items():
        origen = buscar(ORIGEN / carpeta, nombre)
        img = Image.open(origen).convert("RGBA")
        img = img.crop((0, 0, *LIENZO))   # algún original viene con 1 px de más (1237 de ancho)
        img = img.resize(SALIDA, Image.LANCZOS)
        rgba = np.array(img).astype(float)
        rgba[..., 3] *= mascara
        salida = DESTINO / f"{slug}-{capa}.webp"
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
