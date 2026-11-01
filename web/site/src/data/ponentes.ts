import type { ImageMetadata } from "astro";
import type { NombreRed } from "./iconos-redes";

export interface Ponente {
  nombre: string;
  /** Cargo y empresa, p. ej. «SRE en Empresa». */
  cargo?: string;
  /** Título de la charla. */
  charla: string;
  /** Resumen de la charla. */
  resumen?: string;
  bio?: string;
  /** Foto de la ventana (src/assets/ponentes/). En la rejilla siempre se ve la silueta encapuchada. */
  foto?: ImageMetadata;
  redes?: { nombre: NombreRed; url: string }[];
}

// Line-up en el orden en que se muestra. Los huecos que falten hasta HUECOS_PONENTES salen como siluetas
// con el «?» dorado que abren la ventana «¿Quieres ser tú?».
export const ponentes: Ponente[] = [];
export const HUECOS_PONENTES = 6;
