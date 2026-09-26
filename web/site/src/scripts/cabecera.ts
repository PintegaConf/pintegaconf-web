// Cabecera fija: sombra al hacer scroll y sección activa marcada en la navegación.
import "./tema";
import { requerido } from "./lib/medios";

const cabecera = requerido<HTMLElement>(".site-header");
const alHacerScroll = () => cabecera.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", alHacerScroll, { passive: true });
alHacerScroll();

// Sección activa: la que ocupa la franja central de la pantalla
const enlaces = [...document.querySelectorAll<HTMLAnchorElement>(".topnav a")];
const porId = new Map(enlaces.map((a) => [a.hash.slice(1), a]));
const observador = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      const enlace = porId.get(e.target.id);
      if (!enlace || !e.isIntersecting) continue;
      enlaces.forEach((l) => l.removeAttribute("aria-current"));
      enlace.setAttribute("aria-current", "true");
    }
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
porId.forEach((_, id) => {
  const seccion = document.getElementById(id);
  if (seccion) observador.observe(seccion);
});
