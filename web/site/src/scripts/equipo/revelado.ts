// Equipo en escritorio y tablet (>680px): destapar a la persona sobre la que está el puntero.
//
// Las figuras se solapan, así que no vale el rectángulo de cada una: se mira el canal alfa de la
// ilustración bajo el puntero (la silueta real), deshaciendo el "paso al frente" de cada persona.
// Con ratón funciona por hover; en táctil, un toque destapa y otro toque (en la misma o fuera) tapa.
// Con teclado lo hace el CSS (:focus-within).
import { MOVIL, requerido } from "../lib/medios";

interface Mascara {
  ancho: number;
  alto: number;
  alfa: Uint8ClampedArray;
}

interface Figura {
  el: HTMLElement;
  info: HTMLElement;
  atras: boolean;
  indice: number;
  capucha: string;
  rostro: string;
  dossier: HTMLElement;
  marco: HTMLElement;
}

// Mismos valores que el CSS de Equipo.astro (si cambias allí el "paso al frente", cámbialo aquí)
const REPOSO = { atras: { ty: 12, s: 0.8 }, delante: { ty: 0, s: 1 } };
const ACTIVA = { atras: { ty: 64, s: 1.06 }, delante: { ty: -8, s: 1.06 } };
// Margen extra por arriba (fracción de la altura) para que el borde de la capucha no parpadee
const MARGEN = { atras: 0.12, delante: 0.03 };
const UMBRAL_ALFA = 100;
const GRACIA_MS = 90;          // tiempo en un hueco entre figuras antes de tapar (evita parpadeos)
const SALIDA_MS = 550;         // la que se va mantiene z-index alto mientras se tapa
const TOQUE_MAX_PX = 10;       // si el dedo se mueve más, es scroll, no un toque

const pista = requerido<HTMLElement>("#equipo .formation-inner");
const mascaras = new Map<string, Mascara | null>();

function cargarMascara(src: string): void {
  if (mascaras.has(src)) return;
  mascaras.set(src, null);
  const img = new Image();
  img.onload = () => {
    const lienzo = document.createElement("canvas");
    lienzo.width = img.naturalWidth;
    lienzo.height = img.naturalHeight;
    const ctx = lienzo.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const rgba = ctx.getImageData(0, 0, lienzo.width, lienzo.height).data;
    const alfa = new Uint8ClampedArray(lienzo.width * lienzo.height);
    for (let i = 0; i < alfa.length; i++) alfa[i] = rgba[i * 4 + 3];
    mascaras.set(src, { ancho: lienzo.width, alto: lienzo.height, alfa });
  };
  img.src = src;
}

const figuras: Figura[] = [...pista.querySelectorAll<HTMLElement>(".operative")].map((el) => {
  const capucha = requerido<HTMLImageElement>(".layer-hood", el).src;
  const rostro = requerido<HTMLImageElement>(".layer-face", el).src;
  cargarMascara(capucha);
  cargarMascara(rostro);
  return {
    el,
    info: requerido<HTMLElement>(".info", el),
    atras: el.dataset.fila === "atras",
    indice: Number(el.dataset.indice),
    capucha,
    rostro,
    dossier: requerido<HTMLElement>(".dossier", el),
    marco: requerido<HTMLElement>(".frame", el),
  };
});

// Orden de pintado, de arriba abajo: fila de delante primero y, dentro de cada fila, la última del HTML
const ordenPintado = [...figuras].sort((a, b) => Number(a.atras) - Number(b.atras) || b.indice - a.indice);

/** ¿Hay silueta en la columna u, entre v y v + margen (coordenadas 0..1 de la imagen)? */
function hayAlfa(m: Mascara, u: number, v: number, margen: number): boolean {
  const col = Math.floor(u * m.ancho);
  for (let k = 0; k <= 4; k++) {
    const vv = v + (margen * k) / 4;
    if (vv < 0) continue;
    if (vv >= 1) break;
    if (m.alfa[Math.floor(vv * m.alto) * m.ancho + col] > UMBRAL_ALFA) return true;
  }
  return false;
}

/** ¿El punto (x, y) de pantalla cae sobre la silueta de la figura, en reposo o adelantada? */
function toca(f: Figura, x: number, y: number, activa: boolean, margen = 0): boolean {
  const t = (activa ? ACTIVA : REPOSO)[f.atras ? "atras" : "delante"];
  const r = f.el.getBoundingClientRect();
  const d = f.dossier;
  // Deshacer la transformación (escala desde el centro + desplazamiento vertical)
  const cx = r.left + d.offsetLeft + d.offsetWidth / 2;
  const cy = r.top + d.offsetTop + d.offsetHeight / 2;
  const px = cx + (x - cx) / t.s;
  const py = cy + (y - cy - t.ty) / t.s;
  const mx = r.left + d.offsetLeft + f.marco.offsetLeft;
  const my = r.top + d.offsetTop + f.marco.offsetTop;
  const u = (px - mx) / f.marco.offsetWidth;
  const v = (py - my) / f.marco.offsetHeight;
  if (u < 0 || u >= 1 || v >= 1 || v < -margen) return false;
  const m = mascaras.get(activa ? f.rostro : f.capucha);
  if (!m) return v >= 0; // máscara aún cargando: vale el rectángulo
  return hayAlfa(m, u, v, margen);
}

let activa: Figura | null = null;
let temporizadorGracia: number | undefined;
const temporizadoresSalida = new WeakMap<HTMLElement, number>();

function activar(f: Figura | null): void {
  if (f === activa) return;
  figuras.forEach((x) => x.el.classList.remove("cerrada")); // destapar a otra persona anula el Escape anterior
  if (activa) {
    const saliente = activa.el;
    saliente.classList.remove("is-active");
    saliente.classList.add("was-active");
    clearTimeout(temporizadoresSalida.get(saliente));
    temporizadoresSalida.set(saliente, window.setTimeout(() => saliente.classList.remove("was-active"), SALIDA_MS));
  }
  if (f) {
    clearTimeout(temporizadoresSalida.get(f.el));
    f.el.classList.remove("was-active");
    f.el.classList.add("is-active");
  }
  activa = f;
  pista.classList.toggle("pointing", Boolean(f));
}

/** ¿El punto está sobre la ficha (nombre y rol) de la figura? */
function sobreFicha(f: Figura, x: number, y: number): boolean {
  const r = f.info.getBoundingClientRect();
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

/** Figura bajo el punto. La activa tiene preferencia (histéresis) para no saltar entre vecinas, y también
 *  si el puntero está sobre su ficha: se puede pasar el ratón por encima sin que desaparezca (WCAG 1.4.13). */
function figuraEn(x: number, y: number): Figura | null {
  if (activa && (toca(activa, x, y, true) || toca(activa, x, y, false, MARGEN[activa.atras ? "atras" : "delante"]) || sobreFicha(activa, x, y))) return activa;
  return ordenPintado.find((f) => f !== activa && toca(f, x, y, false, MARGEN[f.atras ? "atras" : "delante"])) ?? null;
}

const esRaton = (e: PointerEvent) => e.pointerType === "mouse";

// ---------- Ratón: hover ----------
function alMoverRaton(e: PointerEvent): void {
  if (MOVIL.matches || !esRaton(e)) return;
  const f = figuraEn(e.clientX, e.clientY);
  clearTimeout(temporizadorGracia);
  if (f) activar(f);
  else temporizadorGracia = window.setTimeout(() => activar(null), GRACIA_MS);
}
pista.addEventListener("pointermove", alMoverRaton);
pista.addEventListener("pointerdown", alMoverRaton);
pista.addEventListener("pointerleave", (e) => {
  if (MOVIL.matches || !esRaton(e)) return;
  clearTimeout(temporizadorGracia);
  activar(null);
});

// ---------- Táctil (tablet/iPad): toques ----------
// Al levantar el dedo el navegador lanza pointerleave; por eso los toques no usan el hover de arriba.
let inicioToque: { x: number; y: number } | null = null;
document.addEventListener("pointerdown", (e) => { inicioToque = esRaton(e) ? null : { x: e.clientX, y: e.clientY }; }, { passive: true });
document.addEventListener("pointercancel", () => { inicioToque = null; });
document.addEventListener("pointerup", (e) => {
  if (MOVIL.matches || !inicioToque || esRaton(e)) return;
  const movido = Math.hypot(e.clientX - inicioToque.x, e.clientY - inicioToque.y) > TOQUE_MAX_PX;
  inicioToque = null;
  if (movido) return;
  const f = pista.contains(e.target as Node) ? figuraEn(e.clientX, e.clientY) : null;
  clearTimeout(temporizadorGracia);
  activar(f && f !== activa ? f : null);
});

// Al pasar a móvil, el carrusel se encarga (scripts/equipo/carrusel.ts)
MOVIL.addEventListener("change", () => {
  if (MOVIL.matches) activar(null);
});
