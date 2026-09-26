// Menú desplegable: abrir/cerrar con la hamburguesa, la X, Escape, un enlace o un clic fuera.
import { requerido } from "./lib/medios";

const menu = requerido<HTMLElement>("#menu");
const hamburguesa = requerido<HTMLButtonElement>(".burger");
const cerrar = requerido<HTMLButtonElement>(".menu-close", menu);
const estaAbierto = () => menu.classList.contains("open");

function abrir(abierto: boolean): void {
  menu.classList.toggle("open", abierto);
  menu.inert = !abierto; // cerrado: no recibe foco ni lo leen los lectores de pantalla
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
// Si el foco sale del menú con Tab (hacia la página), se cierra: si no, el panel seguiría abierto
// tapando el contenido que se está recorriendo con el teclado.
menu.addEventListener("focusout", (e) => {
  const destino = e.relatedTarget as Node | null;
  if (estaAbierto() && destino && !menu.contains(destino) && !hamburguesa.contains(destino)) abrir(false);
});
document.addEventListener("click", (e) => {
  const destino = e.target as Node;
  if (estaAbierto() && !menu.contains(destino) && !hamburguesa.contains(destino)) abrir(false);
});
