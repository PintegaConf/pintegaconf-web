import type { ImageMetadata } from "astro";

import dragon from "../assets/niveles/dragon.png";
import basilisco from "../assets/niveles/basilisco.png";
import triton from "../assets/niveles/triton.png";
import ajolote from "../assets/niveles/ajolote.png";

// Logos de los patrocinadores: los SVG de la web de Lareira Conf (github.com/Gallegarmy/LareiraConf-MainPage,
// src/img/sponsors/) y el de Allenta, que pasó Matías; revisados (sin scripts ni enlaces externos).
import raiola from "../assets/patrocinadores/raiola.svg";
import denodo from "../assets/patrocinadores/denodo.svg";
import nextDigital from "../assets/patrocinadores/nextdigital.svg";
import teimas from "../assets/patrocinadores/teimas.svg";
import allenta from "../assets/patrocinadores/allenta.svg";

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
  { id: "basilisco", nombre: "Basilisco", rango: "Patrocinio oro", medallon: basilisco, huecos: 4, logos: [
    { src: raiola, alt: "Raiola Networks", url: "https://raiolanetworks.com/" },
    { src: denodo, alt: "Denodo", url: "https://www.denodo.com/" },
    { src: nextDigital, alt: "Next Digital", url: "https://www.nextdigital.es/" },
    { src: allenta, alt: "Allenta", url: "https://allenta.com/" },
  ] },
  { id: "triton", nombre: "Tritón", rango: "Patrocinio plata", medallon: triton, huecos: 6, logos: [
    { src: teimas, alt: "Teimas", url: "https://www.teimas.com/" },
  ] },
  { id: "ajolote", nombre: "Ajolote", rango: "Patrocinio bronce", medallon: ajolote, huecos: 8, logos: [] },
];

// Colaboradores y comunidades: huecos hasta que haya logos.
export const colaboradores: Logo[] = [];
export const comunidades: Logo[] = [];
