// Selector de entradas: con una sola columna (≤ 900 px, móvil y tablet) cada entrada es un desplegable cerrado, para ver
// las tres de un vistazo sin tanto scroll (y que nadie se quede solo con la primera, la más barata). En escritorio van
// abiertas y la cabecera no despliega nada. Sin JS, todas abiertas: el HTML trae `open`.
// En un archivo aparte (no en línea) para que la política de seguridad (CSP) solo admita scripts de nuestro dominio.
const unaColumna = window.matchMedia("(max-width: 900px)");
const tarifas = document.querySelectorAll("details.tarifa");

function ajustar() {
  for (const tarifa of tarifas) {
    tarifa.open = !unaColumna.matches;
    tarifa.querySelector("summary").tabIndex = unaColumna.matches ? 0 : -1;
  }
}

for (const tarifa of tarifas) {
  tarifa.querySelector("summary").addEventListener("click", (e) => {
    if (!unaColumna.matches) e.preventDefault();
  });
}
ajustar();
unaColumna.addEventListener("change", ajustar);
