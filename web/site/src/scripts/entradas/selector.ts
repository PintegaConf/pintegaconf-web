// Selector de entradas: con una sola columna (móvil y tablet) cada entrada es un desplegable cerrado, para ver las tres
// de un vistazo sin tanto scroll (y que nadie se quede solo con la primera, la más barata). En escritorio van abiertas y
// la cabecera no despliega nada. Sin JS, todas abiertas: el HTML trae `open`.
import { UNA_COLUMNA, requerido } from "../lib/medios";

const tarifas = document.querySelectorAll<HTMLDetailsElement>("details.tarifa");

function ajustar() {
  for (const tarifa of tarifas) {
    tarifa.open = !UNA_COLUMNA.matches;
    requerido<HTMLElement>("summary", tarifa).tabIndex = UNA_COLUMNA.matches ? 0 : -1;
  }
}

for (const tarifa of tarifas) {
  requerido<HTMLElement>("summary", tarifa).addEventListener("click", (e) => {
    if (!UNA_COLUMNA.matches) e.preventDefault();
  });
}
ajustar();
UNA_COLUMNA.addEventListener("change", ajustar);
