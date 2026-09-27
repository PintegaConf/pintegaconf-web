// Datos legales del titular de la web. La LSSI (art. 10) obliga a publicarlos en el aviso legal y el
// RGPD (art. 13) a identificar al responsable del tratamiento en la política de privacidad.
//
// Organiza la Asociación Sysarmy Galicia, igual que Lareira Conf (datos tomados de la política de
// privacidad de lareiraconf.es, confirmados por la organización). Mientras falte algún dato obligatorio
// (ahora solo el alojamiento), las páginas legales muestran el aviso de BORRADOR y el build lo avisa por consola.
// Los textos legales deberían revisarlos una persona experta antes de publicarlos.
export const titular = {
  /** Nombre o razón social. */
  nombre: "Asociación Sysarmy Galicia" as string | null,
  /** NIF / CIF. */
  nif: "G21961842" as string | null,
  /** Domicilio (calle, número, localidad). */
  domicilio: "Travesía de Arteixo 5, 3.º derecha, Arteixo (A Coruña)" as string | null,
  /** Inscripción registral, si la hay (p. ej. registro de asociaciones de Galicia y número). */
  registro: null as string | null,
  /** Email de la asociación para privacidad, derechos RGPD y denuncias del código de conducta
   *  (el mismo que usa Lareira Conf). Las consultas generales del evento van a evento.email. */
  email: "administracion@sysarmygalicia.com",
};

/** Empresa que aloja la web (encargada del tratamiento). Pendiente de elegir el hosting. */
export const alojamiento = null as string | null;

/** Fecha de la última revisión de los textos legales. */
export const ACTUALIZADO = "2026-09-27";

/** ¿Están todos los datos obligatorios? (el registro es opcional) */
export const datosLegalesCompletos = Boolean(titular.nombre && titular.nif && titular.domicilio && alojamiento);

if (!datosLegalesCompletos) {
  console.warn("[legal] Faltan datos del titular o del alojamiento en src/data/legal.ts: las páginas legales se publican como BORRADOR.");
}
