// Entrada estilo Wallet: el nombre del formulario aparece en la entrada y, con ratón, la entrada
// se inclina en 3D siguiendo el puntero. Si se usa el ticket clásico, no hay nada que hacer.
import { MENOS_MOVIMIENTO, PUNTERO_FINO } from "../lib/medios";

const INCLINACION_Y = 14; // grados máximos a izquierda/derecha
const INCLINACION_X = 10; // grados máximos arriba/abajo

const pase = document.querySelector<HTMLElement>(".pass");
const formulario = document.querySelector<HTMLFormElement>("[data-formulario-compra]");
const nombre = document.querySelector<HTMLElement>("[data-pase-nombre]");

if (pase && formulario && nombre) {
  // ---------- Nombre en vivo (textContent: nunca se interpreta como HTML) ----------
  const campos = ["nombre", "apellidos"].map((n) => formulario.elements.namedItem(n) as HTMLInputElement);
  const sincronizar = () => {
    nombre.textContent = campos.map((c) => c.value.trim()).filter(Boolean).join(" ") || "Tu nombre aquí";
  };
  campos.forEach((c) => c.addEventListener("input", sincronizar));

  // ---------- Inclinación 3D (solo con ratón y sin "reducir movimiento") ----------
  if (PUNTERO_FINO.matches && !MENOS_MOVIMIENTO.matches) {
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
}
