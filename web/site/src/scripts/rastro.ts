// Rastro de la píntega (components/Rastro.astro). Se calcula un camino que baja por toda la página y se
// colocan pisadas a lo largo de él, alternando pata derecha e izquierda. Al hacer scroll, la «cabeza» del
// rastro va por el 75 % de la ventana: se pisan las huellas hasta ahí y las de atrás se van borrando.
// Al bajar, cada pisada nueva sale encendida (brasa) y suelta chispas, y si el rastro entra o sale de
// debajo de un panel, su borde se enciende por ese punto.
// Solo cambia con el scroll del visitante (no se mueve solo) y con «reducir movimiento» no se crea.
import { MENOS_MOVIMIENTO, requerido } from "./lib/medios";

/** Punto del camino para el avance t (px desde arriba del rastro): paseo libre en curvas por todo el
 *  ancho, dos ondas de distinto tamaño (elegido por Matías entre zigzag, bucles y serpenteo). */
function camino(t: number, ancho: number): [x: number, y: number] {
  return [ancho / 2 + (ancho / 2 - 40) * (0.65 * Math.sin(t / 420) + 0.35 * Math.sin(t / 155 + 2)), t];
}

const RASTRO = 14;          // pisadas visibles a la vez
const CABEZA = 0.75;        // la última pisada va por esta altura de la ventana
const CALIENTES = 2;        // las pisadas más nuevas siguen encendidas
const CHISPAS = 4;          // chispas por pisada nueva

type Lado = "arriba" | "abajo" | "izq" | "der";
interface Caja { el: HTMLElement; x: number; y: number; ancho: number; alto: number }

const capa = requerido<HTMLElement>(".rastro");

let huellas: HTMLElement[] = [];
let avances: number[] = [];   // t de cada pisada, de menor a mayor
let xs: number[] = [];        // posición de cada pisada dentro del rastro
let ys: number[] = [];
let cajas: Caja[] = [];       // paneles, en coordenadas del rastro
let cabeza = -1;              // índice de la última pisada visible
let arriba = 0;               // posición del rastro en la página

function construir() {
  const ancho = capa.clientWidth;
  const alto = capa.clientHeight;
  const paso = 80;                              // distancia entre pisadas
  const abierto = 24;                           // cuánto se separa cada pata del centro del camino
  huellas = [];
  avances = [];
  xs = [];
  ys = [];
  cabeza = -1;
  const rc = capa.getBoundingClientRect();
  arriba = rc.top + scrollY;
  cajas = [...document.querySelectorAll<HTMLElement>("#contenido .panel")].map((el) => {
    const r = el.getBoundingClientRect();
    return { el, x: r.left - rc.left, y: r.top - rc.top, ancho: r.width, alto: r.height };
  });

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
    huella.append(document.createElement("i"));
    // a un lado del camino (perpendicular a la marcha) y con la pata un poco abierta hacia fuera
    const hx = x - (dy / largo) * abierto * lado;
    const hy = y + (dx / largo) * abierto * lado;
    huella.style.left = `${hx}px`;
    huella.style.top = `${hy}px`;
    huella.style.rotate = `${Math.atan2(dy, dx) + lado * 0.25}rad`;
    huellas.push(huella);
    avances.push(t);
    xs.push(hx);
    ys.push(hy);
  }
  capa.replaceChildren(...huellas);
}

/** Chispas que salen de la pisada i hacia arriba, cada una con su dirección. Se quitan al apagarse. */
function chispas(i: number) {
  for (let n = 0; n < CHISPAS; n++) {
    const chispa = document.createElement("span");
    chispa.className = "chispa";
    chispa.style.left = `${xs[i]}px`;
    chispa.style.top = `${ys[i]}px`;
    const angulo = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
    const distancia = 25 + Math.random() * 40;
    chispa.style.setProperty("--dx", `${Math.cos(angulo) * distancia}px`);
    chispa.style.setProperty("--dy", `${Math.sin(angulo) * distancia}px`);
    chispa.addEventListener("animationend", () => chispa.remove(), { once: true });
    capa.append(chispa);
  }
}

const dentro = (c: Caja, i: number) => xs[i] >= c.x && xs[i] <= c.x + c.ancho && ys[i] >= c.y && ys[i] <= c.y + c.alto;

/** Si entre la pisada i-1 y la i el rastro entra o sale de un panel, enciende su borde por ese punto. */
function cruces(i: number) {
  if (i < 1) return;
  for (const c of cajas) {
    if (dentro(c, i - 1) === dentro(c, i)) continue;
    const fuera = dentro(c, i) ? i - 1 : i;     // la pisada de fuera dice por qué lado ha cruzado
    const x = xs[fuera] - c.x;
    const y = ys[fuera] - c.y;
    const lado: Lado = y > c.alto ? "abajo" : y < 0 ? "arriba" : x < 0 ? "izq" : "der";
    const destello = document.createElement("span");
    destello.className = `destello ${lado}`;
    destello.setAttribute("aria-hidden", "true");
    const pos = lado === "abajo" || lado === "arriba" ? Math.min(Math.max(x, 0), c.ancho) : Math.min(Math.max(y, 0), c.alto);
    destello.style.setProperty("--pos", `${pos}px`);
    destello.addEventListener("animationend", () => destello.remove(), { once: true });
    c.el.append(destello);
  }
}

function pintar() {
  const t = scrollY + innerHeight * CABEZA - arriba;
  let nueva = cabeza;
  while (nueva + 1 < avances.length && avances[nueva + 1] <= t) nueva++;
  while (nueva >= 0 && avances[nueva] > t) nueva--;
  // al bajar, chispas y cruces solo de las últimas pisadas nuevas (un scroll rápido no las dispara todas)
  for (let i = Math.max(cabeza + 1, nueva - 2); i <= nueva; i++) {
    chispas(i);
    cruces(i);
  }
  // solo se tocan las pisadas que cambian: las del rastro anterior y las del nuevo
  const desde = Math.max(0, Math.min(nueva, cabeza) - RASTRO);
  const hasta = Math.min(huellas.length - 1, Math.max(nueva, cabeza));
  for (let i = desde; i <= hasta; i++) {
    const edad = nueva - i;
    const viva = edad >= 0 && edad < RASTRO;
    huellas[i].classList.toggle("pisada", viva);
    huellas[i].classList.toggle("caliente", viva && edad < CALIENTES);
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
      if (!huellas.length) {
        construir();
        // la primera vez se pinta sin chispas ni destellos: no es una pisada nueva, es dónde está ya el rastro
        cabeza = -1;
        const t = scrollY + innerHeight * CABEZA - arriba;
        while (cabeza + 1 < avances.length && avances[cabeza + 1] <= t) cabeza++;
        cabeza = Math.max(-1, cabeza - RASTRO);
      }
      pintar();
    });
  };
  addEventListener("scroll", () => programar(false), { passive: true });
  // cambia el alto de la página (fuentes, imágenes, desplegables) o el ancho de la ventana: camino nuevo
  new ResizeObserver(() => programar(true)).observe(capa);
}
