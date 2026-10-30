# Venta de entradas con Weezevent

**Decisión (30-10-2026, Matías):** las entradas se venden con **Weezevent**, no con Stripe. Una plataforma de una empresa
ya trae el panel, los QR, las facturas y los reembolsos, y no hay tiempo para desarrollar y mantener lo mismo sobre Stripe.
(Antes se había descartado Weezevent por la comisión.)

## Cómo va en la web

- La web **enlaza** a la tienda de Weezevent (botón «Compra tu entrada» en la portada y en la caja de Entradas). No usamos su
  iframe ni su script: la CSP no cambia, la tarjeta nunca pasa por nuestra web, la accesibilidad de un iframe ajeno no la
  controlamos y el pago con 3D Secure dentro de un iframe en el móvil suele dar problemas.
- **Carga:** nuestra web es estática (nginx). El pico de la apertura lo recibe la tienda de Weezevent, no nuestro servidor.
- La confirmación de la compra la dan la página final y el email de Weezevent. En la web explicamos los pasos: elegir → pagar
  (factura si hace falta) → llega un email con la entrada y su QR (así se sabe que la compra ha terminado).
- URL de la tienda: **pendiente**. Está como `PENDIENTE-URL-WEEZEVENT` en `evento.tiendaEntradas` (`web/site/src/data/evento.ts`)
  y dos veces en `web/temporal/index.html`. PR #26 en borrador hasta tenerla.

## Qué cubre Weezevent de lo que pedimos

Comprobado en sus páginas oficiales (oct 2026). Lo que pone «comprobar» hay que verlo en el panel o preguntarlo a Weezevent.

| Necesidad | Cómo se resuelve |
|---|---|
| **Cobro sin cientos de movimientos** (la gestora) | Weezevent cobra a los compradores y nos transfiere lo vendido **cada 15 días (días 1 y 16)**, ya sin su comisión. El primer pago tarda algo más (controles de seguridad). Cada transferencia tiene su justificante en *Facturación → Historial de transferencias*, y Weezevent nos factura su comisión. Al banco llega un ingreso por quincena, no uno por entrada. |
| **Facturas automáticas** | Opción «solicitud de factura» en la tienda: opcional (la que viene por defecto), obligatoria o desactivada. El comprador la pide al pagar y le llega por email. Se puede reenviar desde el panel si no la pidió. **Ojo:** la web de Weezevent dice que la emite Weezevent como distribuidor, pero sus condiciones (CGUS, art. 3) dicen que la emite «en nombre y por cuenta del organizador». **Preguntar a la gestora** cuál de las dos cosas le vale y qué tipo de IVA aplicar. |
| **Panel: abrir y cerrar la venta, modificar, reembolsar** | Panel de organizador: tarifas, cupos y fechas de venta, pedidos y participantes (comprobar). Reembolsos totales o parciales a petición del organizador, sin tener que justificarlos (CGUS, art. 7). **La comisión de Weezevent no se devuelve** en los reembolsos. |
| **QR para registrar a la gente** | Cada entrada lleva su código y se valida en la puerta con la app de control de acceso de Weezevent (comprobar el nombre de la app, si funciona sin conexión y cuántos móviles se pueden usar a la vez). |
| **Precio** | 2,5 % por entrada vendida en línea, con un mínimo de 0,99 € IVA incluido, sin cuota. Se puede repercutir al comprador como gastos de gestión. |
| **SLA / carga** | **No publican SLA ni porcentaje de disponibilidad.** Sus condiciones excluyen su responsabilidad por cortes no programados que no sean culpa suya. Estado del servicio: status.weezevent.com. La **cola virtual** para aperturas con mucha demanda va en la oferta a medida, con presupuesto. Para el aforo del Rectorado debería bastar la tienda normal. Si se espera avalancha, pedirles presupuesto y un compromiso de disponibilidad por escrito. |

Fuentes: [comptabilité](https://weezevent.com/fr/comptabilite/), [CGUS](https://weezevent.com/fr/cgus/),
[tarifas](https://weezevent.com/fr/tarifs/), [precio en España](https://weezevent.com/es/),
[solicitud de factura](https://support.weezevent.com/fr/activer-demande-facture-billetterie),
[historial de transferencias](https://support.weezevent.com/fr/acceder-historique-reversements).

## Antes de abrir la venta

1. Cuenta de organizador a nombre del titular (**Asociación Sysarmy Galicia**): datos fiscales, IBAN y la verificación que pida Weezevent.
2. Evento y tarifas: precio, cupos, fechas de venta, qué incluye la entrada (¿pre-evento del viernes?) y gastos de gestión, sí o no.
3. Activar la solicitud de factura y poner el IVA que diga la gestora.
4. Personalizar la tienda y el email de confirmación (logo, colores, pasos e info@pintegaconf.es para dudas).
5. Condiciones de venta y de reembolso, y aviso de privacidad (Weezevent trata los datos de los compradores por nuestra cuenta).
   Basarlos en los textos de Lareira y no inventar datos.
6. Compra real de prueba de principio a fin y reembolso después: comprobar la página final, el email, el QR, la factura, el reembolso y el escaneo con la app.
7. Poner la URL de la tienda en la web (PR #26), quitarle el borrador y probar en Safari y en el iPhone.
8. ~~Web completa (Astro): formulario y menciones a Stripe~~ **Hecho en la PR #26:** pasos y enlace a Weezevent, y FAQ, seguridad,
   privacidad, cookies y distintivo del pie hablan de Weezevent. Falta la revisión legal de privacidad y cookies.
