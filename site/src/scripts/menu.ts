// Menú desplegable: abrir/cerrar con la hamburguesa, la X, Escape, un enlace o un clic fuera.
import { requerido } from "./lib/medios";

const menu = requerido<HTMLElement>("#menu");
const hamburguesa = requerido<HTMLButtonElement>(".burger");
const cerrar = requerido<HTMLButtonElement>(".menu-close", menu);
const estaAbierto = () => menu.classList.contains("open");

function abrir(abierto: boolean): void {
  menu.classList.toggle("open", abierto);
  hamburguesa.setAttribute("aria-expanded", String(abierto));
  hamburguesa.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  if (abierto) menu.querySelector("a")?.focus({ preventScroll: true });
}

hamburguesa.addEventListener("click", () => abrir(!estaAbierto()));
cerrar.addEventListener("click", () => {
  abrir(false);
  hamburguesa.focus();
});
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => abrir(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && estaAbierto()) {
    abrir(false);
    hamburguesa.focus();
  }
});
document.addEventListener("click", (e) => {
  const destino = e.target as Node;
  if (estaAbierto() && !menu.contains(destino) && !hamburguesa.contains(destino)) abrir(false);
});
