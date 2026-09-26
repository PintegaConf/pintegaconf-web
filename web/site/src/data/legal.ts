// Datos legales del titular de la web. La LSSI (art. 10) obliga a publicarlos en el aviso legal y el
// RGPD (art. 13) a identificar al responsable del tratamiento en la política de privacidad.
//
// PENDIENTE: rellenar con los datos reales de quien organiza (asociación, empresa o persona). Mientras
// falte alguno, las páginas legales muestran el aviso de BORRADOR y el build lo avisa por consola.
// Los textos legales deberían revisarlos una persona experta antes de publicarlos.
import { evento } from "./evento";

export const titular = {
  /** Nombre o razón social, p. ej. "Asociación Píntega Conf". */
  nombre: null as string | null,
  /** NIF / CIF. */
  nif: null as string | null,
  /** Domicilio (calle, número, código postal, ciudad). */
  domicilio: null as string | null,
  /** Inscripción registral, si la hay (p. ej. registro de asociaciones de Galicia y número). */
  registro: null as string | null,
  email: evento.email,
};

/** Empresa que aloja la web (encargada del tratamiento). Pendiente de elegir el hosting. */
export const alojamiento = null as string | null;

/** Fecha de la última revisión de los textos legales. */
export const ACTUALIZADO = "2026-09-26";

/** ¿Están todos los datos obligatorios? (el registro es opcional) */
export const datosLegalesCompletos = Boolean(titular.nombre && titular.nif && titular.domicilio && alojamiento);

if (!datosLegalesCompletos) {
  console.warn("[legal] Faltan datos del titular o del alojamiento en src/data/legal.ts: las páginas legales se publican como BORRADOR.");
}
