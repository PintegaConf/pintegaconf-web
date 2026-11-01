// Ventanas de los ponentes (<dialog>). Los botones abren con commandfor + command="show-modal" y cada
// ventana se cierra con Esc, con el botón Cerrar (form method="dialog") o con clic fuera (closedby="any"),
// todo nativo en los navegadores recientes. Esto solo cubre a los que aún no lo traen (p. ej. Safari antiguos).

if (!("command" in HTMLButtonElement.prototype)) {
  for (const boton of document.querySelectorAll<HTMLButtonElement>("#ponentes button[commandfor]")) {
    const ventana = document.getElementById(boton.getAttribute("commandfor") ?? "");
    if (ventana instanceof HTMLDialogElement) boton.addEventListener("click", () => ventana.showModal());
  }
}

if (!("closedBy" in HTMLDialogElement.prototype)) {
  for (const ventana of document.querySelectorAll<HTMLDialogElement>("#ponentes dialog[closedby]")) {
    // La ventana no tiene padding: un clic cuyo destino es el propio <dialog> cae en el fondo (::backdrop)
    ventana.addEventListener("click", (e) => {
      if (e.target === ventana) ventana.close();
    });
  }
}
