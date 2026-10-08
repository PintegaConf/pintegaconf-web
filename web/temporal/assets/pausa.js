// Pausar / reanudar las animaciones (franjas y orbe). Con "reducir movimiento" ya no se animan y el botón no se muestra.
// En un archivo aparte (no en línea) para que la política de seguridad (CSP) solo admita scripts de nuestro dominio.
const boton = document.querySelector(".pausa");
boton.addEventListener("click", () => {
  const pausada = document.documentElement.classList.toggle("sin-animacion");
  boton.textContent = pausada ? "Reanudar animación" : "Pausar animación";
});
