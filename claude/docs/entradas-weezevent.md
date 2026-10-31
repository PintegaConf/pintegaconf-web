# Venta de entradas con Weezevent

**Decisión (30-10-2026, Matías):** las entradas se venden con **Weezevent**, no con Stripe. Una plataforma de una empresa
ya trae el panel, los QR, las facturas y los reembolsos, y no hay tiempo para desarrollar y mantener lo mismo sobre Stripe.
(Antes se había descartado Weezevent por la comisión.)

## Cómo va en la web

- La web **enlaza** a la tienda de Weezevent desde un selector propio: las tres entradas (Chispa 30 €, Llama 40 € y Hoguera
  60 €) como entradas de papel, y el talón «Comprar …» de cada una abre su **módulo filtrado** de Weezevent, con esa tarifa ya
  elegida. El botón «Compra tu entrada» de la portada lleva a esa sección. No usamos su iframe ni su script (su widget solo
  deja cambiar el color principal, el fondo, el tamaño y el idioma): la CSP no cambia, la tarjeta nunca pasa por nuestra web, la accesibilidad de un iframe ajeno no la
  controlamos y el pago con 3D Secure dentro de un iframe en el móvil suele dar problemas.
- **Carga:** nuestra web es estática (nginx). El pico de la apertura lo recibe la tienda de Weezevent, no nuestro servidor.
- La confirmación de la compra la dan la página final y el email de Weezevent. En la web explicamos los pasos: elegir → pagar
  (factura si hace falta) → llega un email con la entrada y su QR (así se sabe que la compra ha terminado).
- Enlaces: **puestos** (1-11-2026), uno por entrada, en `web/site/src/data/entradas.ts` y en `web/temporal/index.html`. Son los
  módulos filtrados de Chispa, Llama y Hoguera del evento 2561671 (`widget.weezevent.com/ticket/<clave>?id_evenement=2561671&locale=es-ES&code=42734`).
  Para hacer uno nuevo: **Canales de venta → Módulos de venta de entradas → Crear nuevo módulo → Nuevo widget filtrado** (nombre,
  evento, la tarifa y el idioma **español**); del código que da, la URL entre `data-src="…"` y `data-width`. Su script (`weez.js`) no se usa.
- **Early bird:** cada entrada tiene además su tarifa early bird (31-10-2026; precio y plazo sin pasar a la web todavía). Para que
  el enlace no cambie, el módulo de cada entrada debe llevar sus dos tarifas, y la normal empezar «sustituyendo» a la early bird
  (que necesita fecha de fin o cupo; las dos visibles en Internet). Si el módulo solo admite una tarifa, al acabar el early bird
  hay que crear módulos nuevos y cambiar los tres enlaces.
- Precios en Weezevent: **precio fijo** de 30, 40 y 60 € (es el precio final con IVA) **sin «+ comisiones»**: la comisión sale
  de lo que nos pagan (0,99 €, 1,00 € y 1,50 €). IVA del evento: el que diga la gestora (previsiblemente el 21 %, tipo general).

## Qué cubre Weezevent de lo que pedimos

Comprobado en sus páginas oficiales (oct 2026). Lo que pone «comprobar» hay que verlo en el panel o preguntarlo a Weezevent.

| Necesidad | Cómo se resuelve |
|---|---|
| **Cobro sin cientos de movimientos** (la gestora) | Weezevent cobra a los compradores y nos transfiere lo vendido **cada 15 días (días 1 y 16)**, ya sin su comisión. El primer pago tarda algo más (controles de seguridad). Cada transferencia tiene su justificante en *Facturación → Historial de transferencias*, y Weezevent nos factura su comisión. Al banco llega un ingreso por quincena, no uno por entrada. |
| **Facturas automáticas** | Opción «solicitud de factura» en la tienda: opcional (la que viene por defecto), obligatoria o desactivada. El comprador la pide al pagar y le llega por email. Se puede reenviar desde el panel si no la pidió. La emite Weezevent **«en nombre y por cuenta del organizador»**, con los datos de nuestra cuenta de organizador (lo dicen sus condiciones, CGUS art. 3, y su ayuda en español; solo la página francesa de contabilidad habla de Weezevent como distribuidor). **Confirmar con la gestora** que le vale y qué tipo de IVA aplicar. |
| **Panel: abrir y cerrar la venta, modificar, reembolsar** | Panel de organizador: tarifas, cupos y fechas de venta, pedidos y participantes (comprobar). Reembolsos totales o parciales a petición del organizador, sin tener que justificarlos (CGUS, art. 7). **La comisión de Weezevent no se devuelve** en los reembolsos. |
| **QR para registrar a la gente** | Cada entrada lleva su código y se valida en la puerta con la app de control de acceso de Weezevent (comprobar el nombre de la app, si funciona sin conexión y cuántos móviles se pueden usar a la vez). |
| **Precio** | 2,5 % por entrada vendida en línea, con un mínimo de 0,99 € IVA incluido, sin cuota. Se puede repercutir al comprador como gastos de gestión. |
| **SLA / carga** | **No publican SLA ni porcentaje de disponibilidad.** Sus condiciones excluyen su responsabilidad por cortes no programados que no sean culpa suya. Estado del servicio: status.weezevent.com. La **cola virtual** para aperturas con mucha demanda va en la oferta a medida, con presupuesto. Para el aforo del Rectorado debería bastar la tienda normal. Si se espera avalancha, pedirles presupuesto y un compromiso de disponibilidad por escrito. |

Fuentes: [comptabilité](https://weezevent.com/fr/comptabilite/), [CGUS](https://weezevent.com/fr/cgus/),
[tarifas](https://weezevent.com/fr/tarifs/), [precio en España](https://weezevent.com/es/),
[solicitud de factura](https://support.weezevent.com/fr/activer-demande-facture-billetterie),
[historial de transferencias](https://support.weezevent.com/fr/acceder-historique-reversements). La ayuda se ha mudado a
[help.weezevent.com](https://help.weezevent.com/es/) (support.weezevent.com da un bucle de redirecciones): [solicitud de factura](https://help.weezevent.com/es/articles/13407789-configurar-la-solicitud-de-factura-para-tu-taquilla-virtual),
[módulo filtrado](https://help.weezevent.com/es/articles/13407221-compartir-un-enlace-de-tarifa-privada-a-traves-de-un-modulo-filtrado),
[idioma del módulo](https://help.weezevent.com/es/articles/13407736-mi-modulo-de-venta-de-entradas-en-varios-idiomas),
[tarifas](https://help.weezevent.com/es/articles/13407208-crear-y-configurar-los-precios-de-mi-evento),
[email de confirmación](https://help.weezevent.com/es/articles/13428214-personaliza-tu-correo-electronico-de-confirmacion).

## Antes de abrir la venta

1. Cuenta de organizador a nombre del titular (**Asociación Sysarmy Galicia**): datos fiscales, IBAN y la verificación que pida Weezevent.
2. Evento y tarifas: precio, cupos, fechas de venta, qué incluye la entrada (¿pre-evento del viernes?) y gastos de gestión, sí o no.
3. Activar la solicitud de factura y poner el IVA que diga la gestora.
4. Personalizar el microsite (banner, colores, URL, idioma español) y poner info@pintegaconf.es como contacto del evento. **El idioma
   de la tienda viene en francés**: cambiarlo en *Opciones de venta de entradas → Visualización del módulo*. El email de confirmación
   con nuestra marca es una opción **de pago** (presupuesto, 3-5 días laborables; el pie de Weezevent no se puede quitar).
5. Condiciones de venta y de reembolso, y aviso de privacidad (Weezevent trata los datos de los compradores por nuestra cuenta).
   Basarlos en los textos de Lareira y no inventar datos.
6. Compra real de prueba de principio a fin y reembolso después: comprobar la página final, el email, el QR, la factura, el reembolso y el escaneo con la app.
7. Poner los enlaces de los tres módulos filtrados en las dos webs (PR #26), quitarle el borrador y probar en Safari y en el iPhone.
8. ~~Web completa (Astro): formulario y menciones a Stripe~~ **Hecho en la PR #26:** pasos y enlace a Weezevent, y FAQ, seguridad,
   privacidad, cookies y distintivo del pie hablan de Weezevent. Falta la revisión legal de privacidad y cookies.
