// Rastro de la píntega (components/Rastro.astro). Se calcula un camino que baja por toda la página y se
// colocan pisadas a lo largo de él, alternando pata derecha e izquierda. Al hacer scroll, la «cabeza» del
// rastro va por el 75 % de la ventana: se pisan las huellas hasta ahí y las de atrás se van borrando.
// Solo cambia con el scroll del visitante (no se mueve solo) y con «reducir movimiento» no se crea.
import { MENOS_MOVIMIENTO, requerido } from "./lib/medios";

/** Punto del camino para el avance t (px desde arriba del rastro): paseo libre en curvas por todo el
 *  ancho, dos ondas de distinto tamaño (elegido por Matías entre zigzag, bucles y serpenteo). */
function camino(t: number, ancho: number): [x: number, y: number] {
  return [ancho / 2 + (ancho / 2 - 40) * (0.65 * Math.sin(t / 420) + 0.35 * Math.sin(t / 155 + 2)), t];
}

const RASTRO = 14;          // pisadas visibles a la vez
const CABEZA = 0.75;        // la última pisada va por esta altura de la ventana

const capa = requerido<HTMLElement>(".rastro");

let huellas: HTMLElement[] = [];
let avances: number[] = [];   // t de cada pisada, de menor a mayor
let cabeza = -1;              // índice de la última pisada visible
let arriba = 0;               // posición del rastro en la página

function construir() {
  const ancho = capa.clientWidth;
  const alto = capa.clientHeight;
  const paso = 80;                              // distancia entre pisadas
  const abierto = 24;                           // cuánto se separa cada pata del centro del camino
  huellas = [];
  avances = [];
  cabeza = -1;
  arriba = capa.getBoundingClientRect().top + scrollY;

  let [px, py] = camino(0, ancho);
  let recorrido = 0;
  let lado = 1;
  for (let t = 2; t < alto; t += 2) {
    const [x, y] = camino(t, ancho);
    const dx = x - px;
    const dy = y - py;
    const largo = Math.hypot(dx, dy) || 1;
    px = x;
    py = y;
    recorrido += largo;
    if (recorrido < paso || y < 0 || y > alto) continue;
    recorrido = 0;
    lado = -lado;
    const huella = document.createElement("span");
    huella.className = lado < 0 ? "huella izq" : "huella";
    // a un lado del camino (perpendicular a la marcha) y con la pata un poco abierta hacia fuera
    huella.style.left = `${x - (dy / largo) * abierto * lado}px`;
    huella.style.top = `${y + (dx / largo) * abierto * lado}px`;
    huella.style.rotate = `${Math.atan2(dy, dx) + lado * 0.25}rad`;
    huellas.push(huella);
    avances.push(t);
  }
  capa.replaceChildren(...huellas);
}

function pintar() {
  const t = scrollY + innerHeight * CABEZA - arriba;
  let nueva = cabeza;
  while (nueva + 1 < avances.length && avances[nueva + 1] <= t) nueva++;
  while (nueva >= 0 && avances[nueva] > t) nueva--;
  // solo se tocan las pisadas que cambian: las del rastro anterior y las del nuevo
  const desde = Math.max(0, Math.min(nueva, cabeza) - RASTRO);
  const hasta = Math.min(huellas.length - 1, Math.max(nueva, cabeza));
  for (let i = desde; i <= hasta; i++) {
    const edad = nueva - i;
    const viva = edad >= 0 && edad < RASTRO;
    huellas[i].classList.toggle("pisada", viva);
    huellas[i].style.opacity = viva ? String(1 - edad / RASTRO) : "";
  }
  cabeza = nueva;
}

if (!MENOS_MOVIMIENTO.matches) {
  let pendiente = false;
  const programar = (rehacer: boolean) => {
    if (rehacer) huellas.length = 0;
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => {
      pendiente = false;
      if (!huellas.length) construir();
      pintar();
    });
  };
  addEventListener("scroll", () => programar(false), { passive: true });
  // cambia el alto de la página (fuentes, imágenes, desplegables) o el ancho de la ventana: camino nuevo
  new ResizeObserver(() => programar(true)).observe(capa);
}
