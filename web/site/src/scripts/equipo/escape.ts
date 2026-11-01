// Escape cierra la figura destapada del equipo (WCAG 1.4.13: el contenido que aparece al pasar el ratón
// o al enfocar se tiene que poder descartar sin mover el puntero ni el foco).
//
// Añade .cerrada a la persona destapada; el CSS de Equipo.astro no destapa a quien la tenga. Se quita
// al volver a enfocarla (focusin) o cuando el ratón o el carrusel destapan a otra persona
// (revelado.ts y carrusel.ts).
import { requerido } from "../lib/medios";

const pista = requerido<HTMLElement>("#equipo .formation-inner");

document.addEventListener("keydown", (e) => {
  // Con una ventana abierta, Escape solo la cierra (lo hace el navegador): la persona sigue destapada
  if (e.key !== "Escape" || document.querySelector("dialog[open]")) return;
  pista.querySelectorAll<HTMLElement>(".operative").forEach((op) => {
    if (op.classList.contains("is-active") || op.matches(":focus-within")) op.classList.add("cerrada");
  });
});

pista.addEventListener("focusin", (e) => {
  (e.target as HTMLElement).closest(".operative")?.classList.remove("cerrada");
});
