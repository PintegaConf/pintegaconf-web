import type { ImageMetadata } from "astro";

import yisusCapucha from "../assets/equipo/yisus-capucha.webp";
import yisusManos from "../assets/equipo/yisus-manos.webp";
import yisusRostro from "../assets/equipo/yisus-rostro.webp";
import matiasCapucha from "../assets/equipo/matias-capucha.webp";
import matiasManos from "../assets/equipo/matias-manos.webp";
import matiasRostro from "../assets/equipo/matias-rostro.webp";

/** Las tres capas del revelado: encapuchado → manos quitándose la capucha → rostro. */
export interface Ilustracion {
  capucha: ImageMetadata;
  manos: ImageMetadata;
  rostro: ImageMetadata;
}

export interface Miembro {
  nombre: string;
  rol: string;
  /** Fila del grupo en escritorio: "atras" (3 personas) o "delante" (4), intercaladas. */
  fila: "atras" | "delante";
  /** Sus ilustraciones. Si aún no las tiene, se usan las de Yisus. */
  ilustracion?: Ilustracion;
}

// Para añadir las ilustraciones de alguien: procesarlas con web/tools/procesar-equipo.py,
// importarlas aquí arriba y ponerlas en su `ilustracion`.
const ilustraciones = {
  yisus: { capucha: yisusCapucha, manos: yisusManos, rostro: yisusRostro },
  matias: { capucha: matiasCapucha, manos: matiasManos, rostro: matiasRostro },
} satisfies Record<string, Ilustracion>;

export const ilustracionPorDefecto: Ilustracion = ilustraciones.yisus;

// Orden de la sección EQUIPO (también el del carrusel en móvil). Yisus = Jesús.
export const equipo: Miembro[] = [
  { nombre: "Jesús", rol: "Organización", fila: "atras", ilustracion: ilustraciones.yisus },
  { nombre: "Iria", rol: "Organización", fila: "delante" },
  { nombre: "Matías", rol: "Organización", fila: "atras", ilustracion: ilustraciones.matias },
  { nombre: "Nacho", rol: "Organización", fila: "delante" },
  { nombre: "Tiziana", rol: "Organización", fila: "delante" },
  { nombre: "David", rol: "Organización", fila: "atras" },
  { nombre: "Carlos", rol: "Organización", fila: "delante" },
];
