// Auditoría de accesibilidad de la web compilada (dist/). Uso:  npm run a11y   (hace build antes)
//
// Para cada página, en escritorio (1440×900) y móvil (375×800), en tema oscuro y claro:
//   1. axe-core con las reglas de WCAG 2.0, 2.1 y 2.2 (A y AA) + buenas prácticas.
//   2. En la portada, también con el menú desplegable abierto.
// Y un recorrido REAL con la tecla Tab (Chrome recibe pulsaciones de teclado de verdad) que comprueba
// en cada elemento enfocado: que tiene nombre accesible, que el foco se ve (outline o sombra), que no
// queda tapado por la cabecera fija (WCAG 2.4.11) y que mide al menos 24×24 px (WCAG 2.5.8, salvo
// enlaces dentro de texto).
//
// Necesita Google Chrome. Ruta por defecto en macOS y Linux; se puede indicar con CHROME_PATH.
// Sale con código 1 si hay algún problema (para la CI).
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync, mkdtempSync, rmSync, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, extname, normalize } from "node:path";

const PUERTO_WEB = 4399;
const PUERTO_CDP = 9339;
const BASE = `http://127.0.0.1:${PUERTO_WEB}`;
// Otra web (p. ej. la temporal): A11Y_DIST=../temporal A11Y_PAGINAS=/ node tests/accesibilidad.mjs
const PAGINAS = process.env.A11Y_PAGINAS?.split(",") ?? ["/", "/faq/", "/aviso-legal/", "/privacidad/", "/cookies/"];
const WEB_PRINCIPAL = !process.env.A11Y_DIST;
const PANTALLAS = [
  { nombre: "escritorio", width: 1440, height: 900, mobile: false },
  { nombre: "móvil", width: 375, height: 800, mobile: true },
];
const TEMAS = ["dark", "light"];
const ETIQUETAS_AXE = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
const MAX_TABS = 200;

const CHROME =
  process.env.CHROME_PATH ??
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium"].find(existsSync);
if (!CHROME) {
  console.error("No encuentro Google Chrome. Indica su ruta con CHROME_PATH.");
  process.exit(2);
}
const AXE = readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- Servidor estático mínimo de dist/ (sin depender de astro preview) ----------
const DIST = process.env.A11Y_DIST ? new URL(process.env.A11Y_DIST.replace(/\/?$/, "/"), `file://${process.cwd()}/`).pathname : new URL("../dist/", import.meta.url).pathname;
const TIPOS = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain" };
const servidor = createServer((req, res) => {
  let ruta = normalize(decodeURIComponent(new URL(req.url, BASE).pathname)).replace(/^(\.\.[/\\])+/, "");
  let archivo = join(DIST, ruta);
  if (existsSync(archivo) && statSync(archivo).isDirectory()) archivo = join(archivo, "index.html");
  if (!archivo.startsWith(DIST) || !existsSync(archivo)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "Content-Type": TIPOS[extname(archivo)] ?? "application/octet-stream" });
  res.end(readFileSync(archivo));
});

// ---------- Chrome ----------
const perfil = mkdtempSync(join(tmpdir(), "a11y-chrome-"));
const procesos = [];
function lanzar(cmd, args) {
  const p = spawn(cmd, args, { stdio: "ignore" });
  procesos.push(p);
  return p;
}
async function esperarUrl(url, intentos = 60) {
  for (let i = 0; i < intentos; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return r;
    } catch {}
    await espera(250);
  }
  throw new Error(`No responde ${url}`);
}
async function cerrar() {
  await Promise.all(procesos.map((p) => new Promise((ok) => { p.once("exit", ok); p.kill(); setTimeout(ok, 3000); })));
  servidor.close();
  rmSync(perfil, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

// ---------- Cliente mínimo del protocolo de Chrome (CDP) ----------
class Pestana {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pendientes = new Map();
    this.eventos = new Map();
    ws.addEventListener("message", (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && this.pendientes.has(msg.id)) {
        const { ok, ko } = this.pendientes.get(msg.id);
        this.pendientes.delete(msg.id);
        msg.error ? ko(new Error(msg.error.message)) : ok(msg.result);
      } else if (msg.method && this.eventos.has(msg.method)) {
        this.eventos.get(msg.method)();
        this.eventos.delete(msg.method);
      }
    });
  }
  enviar(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((ok, ko) => this.pendientes.set(id, { ok, ko }));
  }
  alEvento(method) {
    return new Promise((ok) => this.eventos.set(method, ok));
  }
  async evaluar(expresion) {
    const r = await this.enviar("Runtime.evaluate", { expression: expresion, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  }
  async abrir(url, pantalla, tema) {
    await this.enviar("Emulation.setDeviceMetricsOverride", { width: pantalla.width, height: pantalla.height, deviceScaleFactor: 1, mobile: pantalla.mobile });
    const cargada = this.alEvento("Page.loadEventFired");
    await this.enviar("Page.navigate", { url });
    await cargada;
    await this.evaluar(`document.documentElement.dataset.theme = ${JSON.stringify(tema)}; document.fonts.ready.then(() => true)`);
    await espera(700); // transiciones de color del tema (0,4 s)
  }
  async tecla(key, code, keyCode) {
    // Enter necesita el carácter "\r" para activar botones y enlaces (como una pulsación real)
    const texto = key === "Enter" ? { text: "\r", unmodifiedText: "\r" } : {};
    await this.enviar("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode: keyCode, ...texto });
    await this.enviar("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: keyCode });
  }
}

// ---------- Pruebas ----------
async function axe(p) {
  const res = await p.evaluar(`(async () => {
    if (!window.axe) { ${AXE} }
    const r = await axe.run(document, { runOnly: { type: "tag", values: ${JSON.stringify(ETIQUETAS_AXE)} }, resultTypes: ["violations"] });
    return r.violations.map(v => ({ id: v.id, impacto: v.impact, ayuda: v.help, nodos: v.nodes.map(n => n.target.join(" ")).slice(0, 5), total: v.nodes.length }));
  })()`);
  return res;
}

// Describe el elemento enfocado y comprueba foco visible, no tapado, nombre y tamaño
const INSPECCIONAR_FOCO = `(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
  const etiqueta = el.labels && el.labels.length ? [...el.labels].map(l => l.innerText).join(" ") : "";
  const nombre = (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") && document.getElementById(el.getAttribute("aria-labelledby"))?.innerText || etiqueta || el.innerText || el.getAttribute("alt") || el.getAttribute("title") || "").trim().replace(/\\s+/g, " ");
  const tieneFoco = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== "none");
  const cx = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1), cy = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
  const enPunto = document.elementFromPoint(cx, cy);
  const visibleEnPunto = !!enPunto && (el === enPunto || el.contains(enPunto) || enPunto.contains(el));
  // Tapado por la cabecera fija = en su centro lo que hay encima es la cabecera (no el propio elemento)
  const tapadoPorCabecera = !visibleEnPunto && !!enPunto?.closest(".site-header") && !el.closest(".site-header");
  const enTexto = el.tagName === "A" && ["P", "LI", "SMALL", "SPAN"].includes(el.parentElement?.tagName) && (el.parentElement.innerText || "").trim().length > (el.innerText || "").trim().length + 5;
  const id = el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\\s+/).filter(c => !c.startsWith("astro-")).slice(0, 2).join(".") : "");
  return { id, nombre: nombre.slice(0, 50), tieneFoco, tapadoPorCabecera, visibleEnPunto, ancho: Math.round(r.width), alto: Math.round(r.height), enTexto };
})()`;

async function recorridoTab(p) {
  const pasos = [];
  const problemas = [];
  for (let i = 0; i < MAX_TABS; i++) {
    await p.tecla("Tab", "Tab", 9);
    // La web usa desplazamiento suave: esperar a que la página (y el carrusel) dejen de moverse
    await p.evaluar(`new Promise(ok => { let ult = "", quietos = 0; const t = setInterval(() => {
      const c = document.querySelector("#equipo .formation-inner"); const pos = scrollY + "," + (c ? c.scrollLeft : 0);
      quietos = pos === ult ? quietos + 1 : 0; ult = pos; if (quietos >= 3) { clearInterval(t); ok(true); } }, 60); })`);
    const f = await p.evaluar(INSPECCIONAR_FOCO);
    if (!f) break; // el foco ha salido de la página: fin del recorrido
    if (pasos.length && pasos[0].id === f.id && pasos[0].nombre === f.nombre) break; // ha dado la vuelta
    pasos.push(f);
    const fallos = [];
    if (!f.nombre) fallos.push("sin nombre accesible");
    if (!f.tieneFoco) fallos.push("foco no visible");
    if (f.tapadoPorCabecera) fallos.push("tapado por la cabecera fija");
    if (!f.visibleEnPunto && !f.tapadoPorCabecera) fallos.push("tapado por otro elemento o fuera de pantalla");
    if (!f.enTexto && (f.ancho < 24 || f.alto < 24)) fallos.push(`objetivo pequeño (${f.ancho}×${f.alto})`);
    if (fallos.length) problemas.push(`Tab ${pasos.length}: ${f.id} «${f.nombre}» → ${fallos.join(", ")}`);
  }
  return { pasos, problemas };
}

// ---------- Comportamientos concretos (lo que axe no puede comprobar) ----------
async function comportamientos(p) {
  const problemas = [];
  // 1. Escritorio: el teclado destapa a una persona y Escape la vuelve a tapar sin mover el foco (WCAG 1.4.13)
  await p.abrir(BASE + "/", PANTALLAS[0], "dark");
  await p.evaluar(`document.querySelector("#equipo .dossier").focus()`);
  await espera(1500);
  const destapada = await p.evaluar(`getComputedStyle(document.querySelector("#equipo .operative .layer-hood")).opacity`);
  await p.tecla("Escape", "Escape", 27);
  await espera(800);
  const trasEscape = await p.evaluar(`({ capucha: getComputedStyle(document.querySelector("#equipo .operative .layer-hood")).opacity,
    foco: document.activeElement === document.querySelector("#equipo .dossier") })`);
  if (destapada !== "0") problemas.push(`Equipo: el foco con teclado no destapa a la persona (opacidad capucha ${destapada})`);
  if (trasEscape.capucha !== "1") problemas.push(`Equipo: Escape no vuelve a tapar a la persona (opacidad capucha ${trasEscape.capucha})`);
  if (!trasEscape.foco) problemas.push("Equipo: Escape ha movido el foco");

  // 2. Móvil: la flecha "siguiente" no pierde el foco al llegar al final (aria-disabled, no disabled)
  await p.abrir(BASE + "/", PANTALLAS[1], "dark");
  await p.evaluar(`document.querySelector("#equipo").scrollIntoView(); document.querySelector("#equipo .nav-next").focus()`);
  for (let i = 0; i < 8; i++) {
    await p.tecla("Enter", "Enter", 13);
    await espera(700);
  }
  const final = await p.evaluar(`(() => { const t = document.querySelector("#equipo .formation-inner"); const ops = [...t.querySelectorAll(".operative")];
    const mid = t.getBoundingClientRect().left + t.clientWidth / 2;
    const centro = ops.map(o => { const r = o.getBoundingClientRect(); return [o.querySelector(".info-name").textContent, Math.abs(r.left + r.width / 2 - mid)]; }).sort((a, b) => a[1] - b[1])[0][0];
    return { foco: document.activeElement?.classList.contains("nav-next"), aria: document.querySelector("#equipo .nav-next").getAttribute("aria-disabled"),
      depuracion: "centrada=" + centro + " scrollLeft=" + Math.round(t.scrollLeft) + " max=" + (t.scrollWidth - t.clientWidth) }; })()`);
  if (!final.foco) problemas.push("Carrusel: la flecha «siguiente» pierde el foco al llegar al final");
  if (final.aria !== "true") problemas.push(`Carrusel: al final, «siguiente» debería tener aria-disabled="true" (tiene ${final.aria}; ${final.depuracion})`);
  // 3. Menú (móvil): abierto, salir de él con Tab lo cierra
  await p.abrir(BASE + "/", PANTALLAS[1], "dark");
  await p.evaluar(`document.querySelector(".burger").click()`);
  await espera(300);
  for (let i = 0; i < 12; i++) await p.tecla("Tab", "Tab", 9);
  await espera(300);
  const menu = await p.evaluar(`({ abierto: document.getElementById("menu").classList.contains("open"), fuera: !document.getElementById("menu").contains(document.activeElement) })`);
  if (menu.fuera && menu.abierto) problemas.push("Menú: el foco ha salido del menú con Tab pero sigue abierto");

  // 4. Formulario: enviarlo vacío marca los obligatorios, asocia el error y lleva el foco al primero
  for (const tema of TEMAS) {
    await p.abrir(BASE + "/", PANTALLAS[0], tema);
    await p.evaluar(`document.querySelector("[data-formulario-compra] button[type=submit]").focus()`);
    await p.tecla("Enter", "Enter", 13);
    await espera(300);
    const f = await p.evaluar(`(() => { const f = document.querySelector("[data-formulario-compra]");
      const ob = [...f.querySelectorAll("input[required]")];
      return { metodo: f.getAttribute("method"), foco: document.activeElement?.id,
        invalidos: ob.filter(i => i.getAttribute("aria-invalid") === "true").map(i => i.id),
        conMensaje: ob.filter(i => document.getElementById(i.getAttribute("aria-describedby"))?.textContent.trim()).map(i => i.id) }; })()`);
    if (f.metodo !== "post") problemas.push(`Formulario: method debería ser post (tiene ${f.metodo})`);
    if (f.invalidos.length !== 3) problemas.push(`Formulario (${tema}): enviado vacío, marca ${f.invalidos.length} campos inválidos en vez de 3`);
    if (f.conMensaje.length !== 3) problemas.push(`Formulario (${tema}): ${f.conMensaje.length} de 3 errores tienen mensaje asociado`);
    if (f.foco !== "f-nombre") problemas.push(`Formulario (${tema}): el foco va a ${f.foco} en vez de al primer error`);
    const fallos = await axe(p); // con los mensajes de error a la vista (contraste, etc.)
    fallos.forEach((v) => problemas.push(`Formulario con errores (${tema}): [${v.impacto}] ${v.id}: ${v.ayuda} → ${v.nodos.join(" | ")}`));
  }
  return problemas;
}

// ---------- Ejecución ----------
let totalProblemas = 0;
try {
  if (!existsSync(join(DIST, "index.html"))) throw new Error("No existe dist/: ejecuta antes npm run build (o usa npm run a11y)");
  await new Promise((ok) => servidor.listen(PUERTO_WEB, "127.0.0.1", ok));
  lanzar(CHROME, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${PUERTO_CDP}`, `--user-data-dir=${perfil}`, "--no-first-run", "about:blank"]);
  const objetivos = await (await esperarUrl(`http://127.0.0.1:${PUERTO_CDP}/json/list`)).json();
  const ws = new WebSocket(objetivos.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((ok) => ws.addEventListener("open", ok));
  const p = new Pestana(ws);
  await p.enviar("Page.enable");

  for (const ruta of PAGINAS) {
    for (const pantalla of PANTALLAS) {
      for (const tema of TEMAS) {
        await p.abrir(BASE + ruta, pantalla, tema);
        const fallos = await axe(p);
        let fallosMenu = [];
        if (WEB_PRINCIPAL && ruta === "/" && pantalla.mobile) {
          await p.evaluar(`document.querySelector(".burger").click()`);
          await espera(600);
          fallosMenu = (await axe(p)).map((v) => ({ ...v, ayuda: "[menú abierto] " + v.ayuda }));
        }
        const todos = [...fallos, ...fallosMenu];
        totalProblemas += todos.length;
        const etiqueta = `${ruta} · ${pantalla.nombre} · ${tema === "dark" ? "oscuro" : "claro"}`;
        console.log(`${todos.length ? "✗" : "✓"} axe  ${etiqueta}${todos.length ? "" : " — sin incidencias"}`);
        for (const v of todos) console.log(`    [${v.impacto}] ${v.id}: ${v.ayuda} (${v.total}) → ${v.nodos.join(" | ")}`);
      }
      // Recorrido con Tab (en tema oscuro; el orden y el foco no dependen del tema)
      await p.abrir(BASE + ruta, pantalla, "dark");
      const { pasos, problemas } = await recorridoTab(p);
      totalProblemas += problemas.length;
      console.log(`${problemas.length ? "✗" : "✓"} Tab  ${ruta} · ${pantalla.nombre} — ${pasos.length} paradas${problemas.length ? "" : ", todas correctas"}`);
      problemas.forEach((x) => console.log("    " + x));
      if (process.env.A11Y_DETALLE) pasos.forEach((f, i) => console.log(`      ${i + 1}. ${f.id} «${f.nombre}»`));
    }
  }
  const extra = WEB_PRINCIPAL ? await comportamientos(p) : [];
  totalProblemas += extra.length;
  if (WEB_PRINCIPAL) console.log(`${extra.length ? "✗" : "✓"} Comportamientos (Escape del equipo, flechas del carrusel, menú, errores del formulario)${extra.length ? "" : " — correctos"}`);
  extra.forEach((x) => console.log("    " + x));
  ws.close();
} catch (e) {
  console.error("Error en la auditoría:", e);
  totalProblemas++;
} finally {
  await cerrar();
}
console.log(totalProblemas ? `\n${totalProblemas} problema(s) de accesibilidad.` : "\nAccesibilidad: sin problemas detectados.");
process.exit(totalProblemas ? 1 : 0);
