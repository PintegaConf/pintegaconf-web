import type { ImageMetadata } from "astro";

import dragon from "../assets/niveles/dragon.png";
import basilisco from "../assets/niveles/basilisco.png";
import triton from "../assets/niveles/triton.png";
import ajolote from "../assets/niveles/ajolote.png";

export interface Logo {
  src: ImageMetadata;
  alt: string;
  url?: string;
}

export interface Nivel {
  /** Identificador para los estilos (tamaños y columnas en Patrocinadores.astro). */
  id: "dragon" | "basilisco" | "triton" | "ajolote";
  nombre: string;
  rango: string;
  medallon: ImageMetadata;
  /** Huecos "Tu logo aquí" que se muestran mientras no haya logos reales. */
  huecos: number;
  logos: Logo[];
}

// La importancia se marca con los logos POR FILA (Dragón 1, Basilisco 2, Tritón 3, Ajolote 4)
// y con medallones decrecientes. Dragón es exclusivo: una sola empresa.
// Para añadir un patrocinador: guardar su logo en src/assets/patrocinadores/, importarlo y
// añadirlo a `logos`, p. ej. { src: miLogo, alt: "Empresa S.L.", url: "https://empresa.com" }.
export const niveles: Nivel[] = [
  { id: "dragon", nombre: "Dragón", rango: "Patrocinio principal · exclusivo", medallon: dragon, huecos: 1, logos: [] },
  { id: "basilisco", nombre: "Basilisco", rango: "Patrocinio oro", medallon: basilisco, huecos: 4, logos: [] },
  { id: "triton", nombre: "Tritón", rango: "Patrocinio plata", medallon: triton, huecos: 6, logos: [] },
  { id: "ajolote", nombre: "Ajolote", rango: "Patrocinio bronce", medallon: ajolote, huecos: 8, logos: [] },
];

// Colaboradores y comunidades: huecos hasta que haya logos.
export const colaboradores: Logo[] = [];
export const comunidades: Logo[] = [];
