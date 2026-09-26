# Propuestas de mejora — web Pintega Conf '27

Revisión de la web actual (formato Penpot) con criterios de buenas prácticas: claridad, conversión (entradas, patrocinio, ponentes) e impresión de marca. Ordenadas por impacto.

## Prioridad alta

1. **Un "hero" que responda en 5 segundos a qué, cuándo, dónde y qué hago.** Ahora lo primero que se lee es "PINTEGA CONF es la evolución de Lareira Conf". Arriba del todo debería ir: logo, una frase de valor ("La conferencia tech de las comunidades de Galicia", por ejemplo), **fecha y ciudad**, y dos botones: *Consigue tu entrada* (principal) y *Ver agenda* (secundario).
2. **Confirmar la fecha.** El diseño dice 21 de marzo y la descripción del proyecto dice 9 y 10 de marzo. Una fecha incoherente es lo que más desconfianza genera.
3. **Nada de huecos grises en la versión pública.** Los rectángulos "Tu logo" y los ponentes "Próximamente" transmiten que está a medias. Mejor convertirlos en llamadas a la acción que además sirven a los objetivos del proyecto:
   - Ponentes vacíos → **"Call for papers abierto — propón tu charla"**.
   - Patrocinadores vacíos → **"Patrocina Pintega Conf — descarga el dossier"**, con los niveles (Dragón, Basilisco, Tritón…) explicados: qué incluye cada uno.
   - Colaboradores/Comunidades vacías → ocultar la sección hasta tener al menos 3 logos.
4. **Navegación visible en escritorio.** La hamburguesa esconde las secciones en pantallas grandes, donde hay sitio de sobra. Menú horizontal fijo arriba (Agenda · Ponentes · Patrocinadores · Equipo · FAQ) con el botón **Entradas** destacado en amarillo; hamburguesa solo en móvil.
5. **Entradas: precio y claridad antes que formulario.** Ahora se piden datos personales sin decir cuánto cuesta ni qué incluye. Mostrar tipos de entrada (early bird / general / estudiante), precio, qué incluye (comida, camiseta, networking) y plazas; el botón lleva a la plataforma de venta (Entradium, Eventbrite, Tito…), que ya gestiona pagos, facturas y RGPD.

## Prioridad media

6. **Legibilidad del texto.** Roboto Mono a 14 px y justificado cansa en párrafos largos. Propuesta: texto a 16–18 px, alineado a la izquierda, líneas de 60–75 caracteres, y la mono solo para detalles (fechas, horas, etiquetas). El propio manual de marca sugiere Roboto (sans) para textos.
7. **Orden de las secciones según lo que busca la gente:** Hero → Qué es → Ponentes → Agenda → Entradas → Patrocinadores → Comunidades → Equipo → FAQ. El equipo es un detalle bonito, pero no es lo que decide la compra.
8. **Información práctica:** lugar con mapa, cómo llegar, accesibilidad, código de conducta y FAQ (las FAQ ya están enlazadas en el pie, pero no existen).
9. **Prueba social:** cifras reales de Lareira Conf (asistentes, charlas, comunidades), fotos de ediciones anteriores y alguna cita real de asistentes o ponentes.
10. **Crecer en redes (objetivo del proyecto):** enlaces a redes en cabecera y pie, y un "Avísame cuando salgan las entradas / ponentes" con email. Captar ese contacto es más valioso que un seguidor.
11. **Cabecera más compacta.** 325 px de blanco antes del contenido empujan lo importante fuera de la primera pantalla, sobre todo en portátiles.

## Técnico (SEO, rendimiento, accesibilidad, legal)

12. **SEO y compartir:** título y meta descripción, imagen Open Graph (sirven los banners de LinkedIn/Twitter que ya tenéis), favicon con la salamandra y datos estructurados `Event` de schema.org para que Google muestre fecha y lugar.
13. **Rendimiento:** sacar las imágenes del HTML a archivos (ahora van incrustadas, ~330 KB), servirlas en WebP con carga diferida y alojar las fuentes en el propio servidor.
14. **Accesibilidad:** revisar contraste de grises sobre fondo oscuro, textos alternativos de logos de patrocinadores, y que todo se pueda usar con teclado (el equipo ya lo permite).
15. **Legal:** si hay formulario o cookies de analítica, las páginas de privacidad y cookies tienen que existir y el banner de cookies debe permitir rechazar.
16. **Móvil:** en patrocinadores salen 12 cajas en columna; mejor 2 por fila y logos más pequeños.

> Nota (sep 2026): ya aplicados el hero nuevo (#1), la fecha confirmada 9–10 abril 2027 (#2) y el menú horizontal en escritorio (#4). Para entradas se usará Stripe, no Eventbrite (#5). Los huecos de ponentes/patrocinadores se mantienen por decisión del usuario (#3).
