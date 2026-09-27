// Datos generales del evento. Cambiar aquí y se actualiza en toda la web (textos, SEO, schema.org).

export const evento = {
  nombre: "Píntega Conf '27",
  lema: "Código, comunidad y futuro",
  ciudad: "A Coruña",
  email: "info@pintegaconf.es",

  // Perfiles oficiales. Salen en el pie y en schema.org (sameAs); `usuario` de X va en twitter:site.
  redes: [
    { nombre: "LinkedIn", url: "https://www.linkedin.com/company/pintega-conf" },
    { nombre: "Instagram", url: "https://www.instagram.com/pintegaconf/" },
    { nombre: "X", url: "https://x.com/pintegaconf", usuario: "@pintegaconf" },
  ],

  // Viernes 9: pre-evento, SIN charlas, en otro sitio aún por decidir (no es el Rectorado).
  preEvento: { fecha: "2027-04-09", lugar: null as string | null },
  // Sábado 10: el día principal (charlas, ponentes, patrocinadores, networking).
  charlas: {
    fecha: "2027-04-10",
    lugar: "Rectorado UDC",                              // corto: datos de portada y entrada
    lugarEnFrase: "el Rectorado de la UDC",              // dentro de un texto
    lugarCompleto: "Rectorado de la Universidade da Coruña", // schema.org
  },

  descripcion:
    "Píntega Conf '27, la conferencia tecnológica de las comunidades tech: charlas el sábado 10 de abril de 2027 en el Rectorado de la UDC, A Coruña, y pre-evento el viernes 9. La sucesora de Lareira Conf.",
  descripcionCorta: "Código, comunidad y futuro. La conferencia tecnológica de las comunidades tech, sucesora de Lareira Conf.",
} as const;

/** Enlace mailto con asunto (codificado para que la tilde viaje bien). */
export const mailto = (asunto: string) => `mailto:${evento.email}?subject=${encodeURIComponent(asunto)}`;
