// Equipo en móvil (≤680px): carrusel con scroll-snap.
//  - La persona centrada se destapa sola (si el carrusel está al menos a medias en pantalla).
//  - Flechas anterior/siguiente que CENTRAN exactamente a la persona (Safari iOS no re-encaja
//    si se desplaza el ancho del carrusel, que incluye el padding).
import { MOVIL, requerido } from "../lib/medios";

const UMBRAL_CENTRADA = 0.75;   // parte visible para considerar a alguien "centrado"
const UMBRAL_VISIBLE = 0.5;     // parte del carrusel en pantalla para destapar
const ESPERA_MS = 180;          // deja que el scroll-snap asiente antes de destapar

const pista = requerido<HTMLElement>("#equipo .formation-inner");
const anterior = requerido<HTMLButtonElement>("#equipo .nav-prev");
const siguiente = requerido<HTMLButtonElement>("#equipo .nav-next");
const figuras = [...pista.querySelectorAll<HTMLElement>(".operative")];

// ---------- Revelado automático ----------
let centrada: HTMLElement | null = null;
let visible = false;
let espera: number | undefined;

function destapar(el: HTMLElement | null): void {
  figuras.forEach((f) => f.classList.toggle("is-active", f === el));
  // Si el foco estaba en otra persona, se quita (si no, :focus-within la dejaría destapada)
  const foco = document.activeElement;
  if (el && foco instanceof HTMLElement && foco.closest(".operative") && !el.contains(foco)) foco.blur();
}

function actualizar(): void {
  clearTimeout(espera);
  if (!MOVIL.matches) return;
  if (!visible || !centrada) return destapar(null);
  const objetivo = centrada;
  espera = window.setTimeout(() => destapar(objetivo), ESPERA_MS);
}

const observaFiguras = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      const el = e.target as HTMLElement;
      if (e.isIntersecting && e.intersectionRatio >= UMBRAL_CENTRADA) centrada = el;
      else if (el === centrada) centrada = null;
    }
    actualizar();
  },
  { root: pista, threshold: [0, UMBRAL_CENTRADA, 1] },
);
figuras.forEach((f) => observaFiguras.observe(f));

new IntersectionObserver(
  ([e]) => {
    visible = e.intersectionRatio >= UMBRAL_VISIBLE;
    actualizar();
  },
  { threshold: [0, UMBRAL_VISIBLE, 1] },
).observe(pista);

MOVIL.addEventListener("change", () => {
  if (!MOVIL.matches) destapar(null);
  actualizar();
});

// ---------- Flechas ----------
const centroDe = (el: HTMLElement) => el.offsetLeft + el.offsetWidth / 2;

function indiceActual(): number {
  const medio = pista.scrollLeft + pista.clientWidth / 2;
  let mejor = 0;
  let distancia = Infinity;
  figuras.forEach((f, i) => {
    const d = Math.abs(centroDe(f) - medio);
    if (d < distancia) [mejor, distancia] = [i, d];
  });
  return mejor;
}

function ir(direccion: -1 | 1): void {
  const i = Math.max(0, Math.min(figuras.length - 1, indiceActual() + direccion));
  pista.scrollTo({ left: centroDe(figuras[i]) - pista.clientWidth / 2, behavior: "smooth" });
}

function sincronizarFlechas(): void {
  const max = pista.scrollWidth - pista.clientWidth;
  anterior.disabled = pista.scrollLeft <= 2;
  siguiente.disabled = pista.scrollLeft >= max - 2;
}

anterior.addEventListener("click", () => ir(-1));
siguiente.addEventListener("click", () => ir(1));
pista.addEventListener("scroll", sincronizarFlechas, { passive: true });
window.addEventListener("resize", sincronizarFlechas);
sincronizarFlechas();
