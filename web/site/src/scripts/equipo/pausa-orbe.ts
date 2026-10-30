// Botones para pausar y reanudar las animaciones de los orbes: en la portada flota y en el equipo gira
// la corona de llamas del fondo. Duran más de 5 s y van en paralelo al contenido, así que tienen que
// poder pararse (WCAG 2.2.2). Cada botón apunta con aria-controls a su sección, y el CSS para la
// animación con la clase .orbe-pausado en esa sección.
import { requerido } from "../lib/medios";

for (const boton of document.querySelectorAll<HTMLButtonElement>(".pausa-orbe")) {
  const seccion = requerido<HTMLElement>(`#${boton.getAttribute("aria-controls")}`);
  const texto = requerido<HTMLElement>(".pausa-texto", boton);

  boton.addEventListener("click", () => {
    const pausado = seccion.classList.toggle("orbe-pausado");
    texto.textContent = pausado ? "Reanudar animación" : "Pausar animación";
  });
}
