// Tema claro/oscuro. El tema guardado ya lo aplica un script en línea del <head> (Base.astro)
// antes de pintar; aquí se gestionan los botones y se guarda la elección.
//
//   html[data-theme]           elección manual del visitante ("light" | "dark"), si la hay
//   html[data-effective-theme] tema que se está viendo (manual o el del sistema), para los iconos

type Tema = "light" | "dark";

const raiz = document.documentElement;
const sistemaClaro = window.matchMedia("(prefers-color-scheme: light)");
const botones = document.querySelectorAll<HTMLButtonElement>("[data-tema-boton]");

const temaActual = (): Tema =>
  raiz.dataset.theme === "light" || raiz.dataset.theme === "dark" ? raiz.dataset.theme : sistemaClaro.matches ? "light" : "dark";

function pintar(): void {
  const tema = temaActual();
  const siguiente = tema === "light" ? "oscuro" : "claro";
  raiz.dataset.effectiveTheme = tema;
  botones.forEach((b) => {
    b.setAttribute("aria-label", `Cambiar a modo ${siguiente}`);
    b.title = `Modo ${siguiente}`;
    if (b.hasAttribute("data-tema-texto")) b.textContent = `Modo ${siguiente}`;
  });
}

function alternar(): void {
  const tema: Tema = temaActual() === "light" ? "dark" : "light";
  raiz.dataset.theme = tema;
  try {
    localStorage.setItem("theme", tema);
  } catch {
    // Navegación privada o almacenamiento bloqueado: el cambio vale para esta visita
  }
  pintar();
}

botones.forEach((b) => b.addEventListener("click", alternar));
sistemaClaro.addEventListener("change", pintar);
pintar();
