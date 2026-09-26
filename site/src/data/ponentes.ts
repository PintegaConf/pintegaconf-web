import type { ImageMetadata } from "astro";

export interface Ponente {
  nombre: string;
  charla: string;
  foto?: ImageMetadata;
}

// Line-up. Mientras esté vacío se muestran HUECOS tarjetas "Próximamente" con el "?" dorado.
export const ponentes: Ponente[] = [];
export const HUECOS_PONENTES = 6;
