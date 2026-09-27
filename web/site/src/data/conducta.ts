// Personas de la organización a las que se puede escribir directamente para denunciar una infracción
// del código de conducta (/codigo-de-conducta/). Lista y usuarios de Telegram dados por la organización.
export const contactosConducta = [
  { nombre: "Ignacio Espósito", telegram: "Qrow01" },
  { nombre: "Jesús Pérez-Roca", telegram: "Yisus1982" },
  { nombre: "Tiziana Amicarella", telegram: "tizianaamicca" },
  { nombre: "Matías Garrido", telegram: "matiasgarrid0" },
  { nombre: "Daniel Isasi", telegram: "DanisaDR1980" },
  { nombre: "Iria Hidalgo", telegram: "Iriahn" },
  { nombre: "Carlos Santillana", telegram: "TheCentryck" },
] as const;

/** Fecha de la última revisión del código de conducta. */
export const CONDUCTA_ACTUALIZADO = "2026-09-27";
