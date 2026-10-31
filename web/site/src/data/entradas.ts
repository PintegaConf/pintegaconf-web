// Tipos de entrada = tarifas de Weezevent. Precios finales: IVA y comisión de Weezevent incluidos.
// `tienda`: enlace al módulo filtrado de esa tarifa (Weezevent → Canales de venta → Módulos de venta de entradas →
// Nuevo widget filtrado; la URL que va entre data-src="…" y data-width): la tienda se abre con esa tarifa ya elegida.
// Si cambia algo, cambiarlo también en la web temporal (web/temporal/index.html, sección Entradas).

import { evento, fecha, mayuscula } from "./evento";

// Venta abierta en Weezevent. Mientras sea false, las entradas se ven con su precio pero los talones dicen «Muy pronto a
// la venta» y no enlazan (con la venta cerrada, Weezevent enseña una página en blanco). Al abrir la venta, ponerlo a
// true y, en la web temporal, quitar la clase venta-pronto de <html>.
export const ventaAbierta: boolean = false;

const BASE = [
  { texto: `${mayuscula(fecha(evento.preEvento.fecha, "dia"))} · pre-evento`, incluido: true },
  { texto: `${mayuscula(fecha(evento.charlas.fecha, "dia"))} · charlas`, incluido: true },
];

export const entradas = [
  {
    nombre: "Chispa",
    precio: 30,
    resumen: "Sin post-evento",   // lo que la distingue: se ve con el desplegable cerrado (móvil)
    incluye: [...BASE, { texto: "Sin post-evento", incluido: false }],
    tienda: "https://widget.weezevent.com/ticket/3dc446fe-73e3-42d7-81bb-ea62f7945ecf?id_evenement=2561671&locale=es-ES&code=42734",
  },
  {
    nombre: "Llama",
    precio: 40,
    resumen: "Con post-evento",
    incluye: [...BASE, { texto: "Post-evento del sábado", incluido: true }],
    tienda: "https://widget.weezevent.com/ticket/f2d3c92d-3014-4ac0-bbba-a48f554f7780?id_evenement=2561671&locale=es-ES&code=42734",
  },
  {
    nombre: "Hoguera",
    precio: 60,
    resumen: "Con post-evento y regalo",
    incluye: [...BASE, { texto: "Post-evento del sábado", incluido: true }, { texto: "Regalo de Píntega Conf", incluido: true }],
    tienda: "https://widget.weezevent.com/ticket/79abd7ec-4040-4d6a-b9e9-31f136fc9728?id_evenement=2561671&locale=es-ES&code=42734",
  },
];
