// Media queries compartidas por los scripts. Deben coincidir con los puntos de corte del CSS
// (ver src/styles/tokens.css).

/** Móvil: el equipo pasa a carrusel. */
export const MOVIL = window.matchMedia("(max-width: 680px)");

/** Ratón o trackpad (puntero fino con hover). En táctil, no. */
export const PUNTERO_FINO = window.matchMedia("(hover: hover) and (pointer: fine)");

/** El visitante pidió menos animaciones en su sistema. */
export const MENOS_MOVIMIENTO = window.matchMedia("(prefers-reduced-motion: reduce)");

/** Consulta un elemento obligatorio: si falta, el error dice cuál (mejor que un null más tarde). */
export function requerido<T extends Element>(selector: string, raiz: ParentNode = document): T {
  const el = raiz.querySelector<T>(selector);
  if (!el) throw new Error(`Falta el elemento ${selector}`);
  return el;
}
