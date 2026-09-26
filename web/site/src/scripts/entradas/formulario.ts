// Formulario de compra SIN pasarela: valida en el navegador y avisa de que la venta abrirá pronto.
// No envía los datos a ningún sitio. Cuando haya Stripe, aquí se redirigirá a Stripe Checkout
// (la tarjeta nunca pasa por nuestra web).
//
// Errores accesibles (WCAG 3.3.1, 3.3.3, 4.1.2): cada campo obligatorio con error se marca con
// aria-invalid="true" y su mensaje (enlazado por aria-describedby) dice qué falta y cómo arreglarlo.
// El foco va al primer campo con error. El resultado final se anuncia en la zona role="status".
import { requerido } from "../lib/medios";

const formulario = requerido<HTMLFormElement>("[data-formulario-compra]");
const estado = requerido<HTMLElement>(".note", formulario);
const campo = (n: string) => formulario.elements.namedItem(n) as HTMLInputElement;

const validaciones: { nombre: string; mensaje: (c: HTMLInputElement) => string | null }[] = [
  { nombre: "nombre", mensaje: (c) => (c.value.trim() ? null : "Escribe tu nombre.") },
  { nombre: "apellidos", mensaje: (c) => (c.value.trim() ? null : "Escribe tus apellidos.") },
  {
    nombre: "email",
    mensaje: (c) =>
      !c.value.trim() ? "Escribe tu email." : c.validity.valid ? null : "El email no es válido. Debe tener la forma nombre@dominio.es.",
  },
];

function marcar(c: HTMLInputElement, mensaje: string | null): void {
  const error = document.getElementById(`${c.id}-error`);
  if (mensaje) c.setAttribute("aria-invalid", "true");
  else c.removeAttribute("aria-invalid");
  if (error) error.textContent = mensaje ?? "";
}

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  let primero: HTMLInputElement | null = null;
  for (const v of validaciones) {
    const c = campo(v.nombre);
    const mensaje = v.mensaje(c);
    marcar(c, mensaje);
    if (mensaje && !primero) primero = c;
  }
  if (primero) {
    estado.textContent = "";
    primero.focus();
    return;
  }
  estado.textContent = "¡Gracias! La venta de entradas abrirá muy pronto.";
});

// Al corregir un campo con error, el error desaparece en cuanto el valor es válido
for (const v of validaciones) {
  const c = campo(v.nombre);
  c.addEventListener("input", () => {
    if (c.getAttribute("aria-invalid") === "true") marcar(c, v.mensaje(c));
  });
}
