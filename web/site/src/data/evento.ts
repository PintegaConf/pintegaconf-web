// Datos generales del evento. Cambiar aquí y se actualiza en toda la web (textos, SEO, schema.org).
//
// EDICIÓN: para el año siguiente basta con cambiar estas dos fechas. El año, el nombre («Píntega Conf '28») y todos los
// textos con fecha de la web salen de aquí (con fecha() de abajo). Lo que no sale de aquí: el logo y la imagen para
// redes (llevan el año dibujado: src/assets/marca/logo-*.svg y public/og.jpg) y la web temporal (HTML a mano).
const PRE_EVENTO = "2027-04-09";   // pre-evento, SIN charlas (otro sitio)
const CHARLAS = "2027-04-10";      // el día principal: charlas, ponentes, patrocinadores, networking
const ANIO = Number(CHARLAS.slice(0, 4));
const NOMBRE = `Píntega Conf '${String(ANIO).slice(-2)}`;

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** Un día (AAAA-MM-DD) en texto. «larga»: sábado 10 de abril de 2027 · «media»: sábado 10 de abril ·
 *  «dia»: sábado 10 · «mes»: 10 de abril · «corta»: sáb 10 abr. En minúscula: mayuscula() para empezar frase. */
export function fecha(iso: string, formato: "larga" | "media" | "dia" | "mes" | "corta" = "larga"): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const semana = DIAS[d.getUTCDay()], dia = d.getUTCDate(), mes = MESES[d.getUTCMonth()];
  if (formato === "corta") return `${semana.slice(0, 3)} ${dia} ${mes.slice(0, 3)}`;
  if (formato === "dia") return `${semana} ${dia}`;
  if (formato === "mes") return `${dia} de ${mes}`;
  return `${semana} ${dia} de ${mes}${formato === "larga" ? ` de ${d.getUTCFullYear()}` : ""}`;
}

export const mayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

export const evento = {
  anio: ANIO,
  anioCorto: String(ANIO).slice(-2),   // «27»
  nombre: NOMBRE,
  lema: "Código, comunidad y futuro",
  ciudad: "A Coruña",
  email: "info@pintegaconf.es",
  // Dossier para ponentes (Canva). Lo enlazan los botones de "quiero ser ponente" (también el de la web temporal).
  dossierPonentes: "https://pintegaconf-dossier.my.canva.site/pintegaconf27-dossier-ponentes-pdf",
  // Dossier de patrocinio (Canva). Lo enlazan los botones de "patrocina" (también el de la web temporal).
  dossierPatrocinio: "https://pintegaconf-dossier.my.canva.site",
  // Formulario (Google Forms) para proponer charlas. Lo enlazan la FAQ y la ventana de los huecos de ponentes.
  formularioPonentes: "https://forms.gle/RYwGGrW43a5542Rz8",
  // Lo que se ofrece a los ponentes (FAQ y ventana de los huecos de ponentes).
  ofertaPonentes: [
    "viaje y hotel cubiertos",
    "entrada full-pass",
    "cena en el post-evento",
    "grabación de la charla y difusión en la web y en redes",
    "un regalo de ponente",
  ],

  // Perfiles oficiales. Salen en el pie y en schema.org (sameAs); `usuario` de X va en twitter:site.
  redes: [
    { nombre: "LinkedIn", url: "https://www.linkedin.com/company/pintega-conf" },
    { nombre: "Instagram", url: "https://www.instagram.com/pintegaconf/" },
    { nombre: "X", url: "https://x.com/pintegaconf", usuario: "@pintegaconf" },
  ],

  // Pre-evento: SIN charlas, en otro sitio aún por decidir (no es el Rectorado).
  preEvento: { fecha: PRE_EVENTO, lugar: null as string | null },
  // El día principal (charlas, ponentes, patrocinadores, networking).
  charlas: {
    fecha: CHARLAS,
    lugar: "Rectorado UDC",                              // corto: datos de portada y entrada
    lugarEnFrase: "el Rectorado de la UDC",              // dentro de un texto
    lugarCompleto: "Rectorado de la Universidade da Coruña", // schema.org
  },

  descripcion:
    `${NOMBRE}, la conferencia tecnológica de las comunidades tech: charlas el ${fecha(CHARLAS)} en el Rectorado de la UDC, A Coruña, y pre-evento el ${fecha(PRE_EVENTO, "dia")}. La sucesora de Lareira Conf.`,
  descripcionCorta: "Código, comunidad y futuro. La conferencia tecnológica de las comunidades tech, sucesora de Lareira Conf.",
} as const;

/** Enlace mailto con asunto (codificado para que la tilde viaje bien). */
export const mailto = (asunto: string) => `mailto:${evento.email}?subject=${encodeURIComponent(asunto)}`;
