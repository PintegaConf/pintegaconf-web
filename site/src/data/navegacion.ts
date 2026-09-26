// Secciones de la página, en orden. El `id` es el ancla (#id) de cada <section>.
export const secciones = [
  { id: "pintega", titulo: "Qué es" },
  { id: "agenda", titulo: "Agenda" },
  { id: "ponentes", titulo: "Ponentes" },
  { id: "patrocinadores", titulo: "Patrocinadores" },
  { id: "equipo", titulo: "Equipo" },
  { id: "comunidades", titulo: "Comunidades" },
] as const;

export const enlaceEntradas = { id: "entradas", titulo: "Entradas" } as const;

// Pie: las páginas legales y la FAQ aún no existen (pendiente).
export const enlacesPie = [
  { href: "#", titulo: "FAQS" },
  { href: "#", titulo: "AVISO LEGAL" },
  { href: "#", titulo: "POLÍTICA DE PRIVACIDAD" },
  { href: "#", titulo: "POLÍTICA DE COOKIES" },
] as const;
