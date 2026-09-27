// Equipo: botón para pausar y reanudar el giro de la corona de llamas del fondo.
// La animación dura más de 5 s y va en paralelo al contenido, así que tiene que poder pararse
// (WCAG 2.2.2). El CSS la para con la clase .orbe-pausado en #equipo.
import { requerido } from "../lib/medios";

const seccion = requerido<HTMLElement>("#equipo");
const boton = requerido<HTMLButtonElement>("#equipo .pausa-orbe");
const texto = requerido<HTMLElement>(".pausa-texto", boton);

boton.addEventListener("click", () => {
  const pausado = seccion.classList.toggle("orbe-pausado");
  texto.textContent = pausado ? "Reanudar animación" : "Pausar animación";
});
