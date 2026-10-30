// Entrada estilo Wallet: con ratón, la entrada se inclina en 3D siguiendo el puntero.
// Si se usa el ticket clásico, no hay nada que hacer.
import { MENOS_MOVIMIENTO, PUNTERO_FINO } from "../lib/medios";

const INCLINACION_Y = 14; // grados máximos a izquierda/derecha
const INCLINACION_X = 10; // grados máximos arriba/abajo

const pase = document.querySelector<HTMLElement>(".pass");

if (pase && PUNTERO_FINO.matches && !MENOS_MOVIMIENTO.matches) {
  pase.addEventListener("pointermove", (e) => {
    const r = pase.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    pase.classList.add("is-tilting");
    pase.style.setProperty("--ry", `${(px - 0.5) * INCLINACION_Y}deg`);
    pase.style.setProperty("--rx", `${(0.5 - py) * INCLINACION_X}deg`);
    pase.style.setProperty("--mx", `${px * 100}%`);
    pase.style.setProperty("--my", `${py * 100}%`);
  });
  pase.addEventListener("pointerleave", () => {
    pase.classList.remove("is-tilting");
    pase.style.setProperty("--rx", "0deg");
    pase.style.setProperty("--ry", "0deg");
  });
}
