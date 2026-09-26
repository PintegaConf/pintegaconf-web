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

// Pie. `href: null` = la página aún no existe: se muestra el texto sin enlace (un enlace a "#"
// es un enlace roto). Cuando se cree la página, poner su ruta, p. ej. "/privacidad".
export const enlacesPie: { href: string | null; titulo: string }[] = [
  { href: null, titulo: "FAQS" },
  { href: null, titulo: "AVISO LEGAL" },
  { href: null, titulo: "POLÍTICA DE PRIVACIDAD" },
  { href: null, titulo: "POLÍTICA DE COOKIES" },
];
