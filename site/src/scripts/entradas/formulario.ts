// Formulario de compra SIN pasarela: valida en el navegador y avisa de que la venta abrirá pronto.
// No envía los datos a ningún sitio. Cuando haya Stripe, aquí se redirigirá a Stripe Checkout
// (la tarjeta nunca pasa por nuestra web).
import { requerido } from "../lib/medios";

const formulario = requerido<HTMLFormElement>("[data-formulario-compra]");
const aviso = requerido<HTMLElement>(".note", formulario);
const campo = (n: string) => formulario.elements.namedItem(n) as HTMLInputElement;

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = campo("nombre");
  const email = campo("email");
  if (!nombre.value.trim() || !email.value || !email.validity.valid) {
    aviso.textContent = "Rellena al menos nombre y un email válido.";
    (!nombre.value.trim() ? nombre : email).focus();
    return;
  }
  aviso.textContent = "¡Gracias! La venta de entradas abrirá muy pronto.";
});
