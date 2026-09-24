const tamañoTile = 32;
const escala = 2;
const tamañoTilePantalla = tamañoTile * escala;


const canvas =
    document.getElementById("juego");

const ctx =
    canvas.getContext("2d");

canvas.width =
    window.innerWidth;

canvas.height =
    window.innerHeight;


const teclas = {};

const parametrosJuego = new URLSearchParams(window.location.search);
const modoIntroduccion = parametrosJuego.get("introduccion")?.toLowerCase() === "true";
const spawnXTexto = parametrosJuego.get("spawnX");
const spawnYTexto = parametrosJuego.get("spawnY");
const spawnXInicial = spawnXTexto !== null && spawnXTexto !== "" ? Number(spawnXTexto) : Number.NaN;
const spawnYInicial = spawnYTexto !== null && spawnYTexto !== "" ? Number(spawnYTexto) : Number.NaN;
let introduccionDialogoIniciada = false;
let menuPausaAbierto = false;

if (modoIntroduccion) {
    progreso.introduccionCompletada = false;
    localStorage.removeItem("chronosIntroduccionCompletada");
}


// Cierra la UI que esté abierta. Devuelve true si cerró alguna.
function cerrarUIAbierta() {
    if (inventarioAbierto) { cerrarInventario(); return true; }
    if (acertijoAbierto) { cerrarAcertijo(); return true; }
    if (bibliotecaAbierta) { cerrarBiblioteca(); return true; }
    if (palancasAbierto) { cerrarMenuPalancas(); return true; }
    if (engranajesAbierto) { cerrarMenuEngranajes(); return true; }
    if (panelDescargaAbierto) { cerrarPanelDescarga(); return true; }
    if (maquinaPanelAbierto) { cerrarPanelMaquina(); return true; }
    return false;
}

// Escape se maneja acá en fase de captura, antes que cualquier otro listener,
// para que cerrar una UI no termine abriendo también el menú de pausa.
document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") {
        return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();

    if (menuPausaAbierto) {
        cerrarMenuPausa();
        return;
    }

    if (dialogoAbierto) {
        return;
    }

    if (cerrarUIAbierta()) {
        return;
    }

    abrirMenuPausa();
}, true);

document.addEventListener("keydown", function (e) {
    const tecla = e.key.toLowerCase();

    if ((dialogoAbierto || bibliotecaAbierta || palancasAbierto) && tecla === "e") {
        return;
    }

    teclas[tecla] = true;

    if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
    ) {
        e.preventDefault();
    }
});


document.addEventListener("keyup", function (e) {
    const tecla = e.key.toLowerCase();

    teclas[tecla] = false;


});

function loop() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#222";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (!modoIntroduccion && !transicionEnCurso && !dialogoAbierto && !acertijoAbierto && !bibliotecaAbierta && !palancasAbierto && !panelDescargaAbierto && !menuPausaAbierto) {

        if (!bloqueoFragmentoActivo && !fragmentoSecuenciaActiva) {
            moverJugador();

            comprobarNPC();

            comprobarObjetos(); 
            comprobarInteractuables();
            comprobarReguladorMaquina();
            comprobarPanelDescarga();
            comprobarPalancas();
            comprobarAcertijos();
            actualizarInteraccion();

            actualizarIndicadorE(
                hayNPCCercano() ||
                jugadorEnTransicionActual() ||
                mostrarIndicadorObjeto ||     
                mostrarIndicadorInteractuable ||
                mostrarIndicadorAcertijo ||
                mostrarIndicadorPalanca ||
                mostrarIndicadorPanelDescarga

            );
        } else {
            Object.keys(teclas).forEach(tecla => {
                teclas[tecla] = false;
            });
            actualizarIndicadorE(false);
        }
    }

    actualizarCamara();
    aplicarTemblorCamara();

    dibujarMapa();

    dibujarObjetosMapa();

    dibujarPalancas();

    dibujarNPCs();

    dibujarJugador();

    dibujarEstructurasDelante();

    actualizarYDibujarEfectosVisuales();

    dibujarIndicadorE();

    dibujarFade();

    requestAnimationFrame(loop);
}

window.addEventListener(
    "resize",
    function () {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;

    }
);
function abrirMenuPausa() {
    const menu = document.getElementById("menuPausa");

    if (!menu) {
        return;
    }

    menuPausaAbierto = true;
    menu.style.display = "flex";
    menu.setAttribute("aria-hidden", "false");

    Object.keys(teclas).forEach(tecla => {
        teclas[tecla] = false;
    });
}

function cerrarMenuPausa() {
    const menu = document.getElementById("menuPausa");

    menuPausaAbierto = false;

    if (menu) {
        menu.style.display = "none";
        menu.setAttribute("aria-hidden", "true");
    }
}

function mostrarMensajeGuardadoPausa() {
    const mensaje = document.getElementById("mensajeGuardadoPausa");
    if (!mensaje) {
        return;
    }

    mensaje.classList.remove("visible");
    void mensaje.offsetWidth;
    mensaje.classList.add("visible");

    clearTimeout(mensaje._timeoutGuardado);
    mensaje._timeoutGuardado = setTimeout(() => {
        mensaje.classList.remove("visible");
    }, 1500);
}

function mostrarErrorGuardadoPausa(mensaje = "No se pudo guardar la partida.") {
    const estado = document.getElementById("mensajeGuardadoPausa");
    if (!estado) {
        console.error(mensaje);
        return;
    }

    estado.textContent = mensaje;
    estado.classList.remove("visible");
    void estado.offsetWidth;
    estado.classList.add("visible");
    estado.style.color = "#ff9a9a";

    clearTimeout(estado._timeoutGuardado);
    estado._timeoutGuardado = setTimeout(() => {
        estado.textContent = "Partida guardada";
        estado.style.color = "#8bedd5";
        estado.classList.remove("visible");
    }, 1800);
}

let juegoIniciado = false;

function iniciarJuego() {

    console.log("INICIANDO JUEGO");

    if (juegoIniciado) {
        return;
    }

    juegoIniciado = true;

    if (modoIntroduccion && !progreso.introduccionCompletada) {
        iniciarIntroduccionLaboratorio();
    }

    requestAnimationFrame(loop);
}

let mapaInicial = parametrosJuego.get("mapa")
    || (modoIntroduccion ? "/Maps/mapasJson/labo.tmj" : "/Maps/mapasJson/AncientGreek.tmj");

async function cargarPartida() {
    if (modoIntroduccion) {
        console.log("Nueva introducción: se ignora la partida guardada.");
        const spawnXIntro = Number.isFinite(spawnXInicial) ? spawnXInicial : 470;
        const spawnYIntro = Number.isFinite(spawnYInicial) ? spawnYInicial : 470;
        jugador.x = spawnXIntro;
        jugador.y = spawnYIntro;
        await cargarMapa("/Maps/mapasJson/labo.tmj");
        return;
    }

    if (Number.isFinite(spawnXInicial) && Number.isFinite(spawnYInicial)) {
        jugador.x = spawnXInicial;
        jugador.y = spawnYInicial;
    }

    const respuesta = await fetch("/Juego/ObtenerEstado");

    if (!respuesta.ok) {
        console.error("No se pudo obtener la partida.");
        await cargarMapa(mapaInicial);
        return;
    }

    const estado = await respuesta.json();

    if (estado) {
        jugador.x = estado.PosicionX;
        jugador.y = estado.PosicionY;

        if (estado.MapaActual) {
            mapaInicial = estado.MapaActual;
        }

        inventario = (estado.Inventario || []).map(objeto => ({
            id: objeto.Id,
            cantidad: objeto.Cantidad
        }));

        Object.assign(progreso, estado.Progreso || {});

        console.log("PARTIDA CARGADA:", estado);
    }

    await cargarMapa(mapaInicial);
}
function iniciarIntroduccionLaboratorio() {
    if (introduccionDialogoIniciada) return;

    introduccionDialogoIniciada = true;

    const anio = document.getElementById("introduccionAnio");
    anio?.classList.add("visible");

    setTimeout(() => {
        anio?.classList.remove("visible");
        abrirDialogo("IntroduccionLaboratorio", {
            alTerminar: terminarIntroduccionLaboratorio
        });
    }, 1400);
}

function terminarIntroduccionLaboratorio() {
    progreso.introduccionCompletada = true;
    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }
    localStorage.setItem("chronosIntroduccionCompletada", "true");

    const anio = document.getElementById("introduccionAnio");
    if (anio) {
        anio.textContent = "";
    }
    anio?.classList.add("transicionando");

    const pantalla = document.getElementById("transicionEpoca");
    const nombre = document.getElementById("transicionEpocaNombre");
    const anioDestino = document.getElementById("transicionEpocaAnio");
    const mapaDestino = "/Maps/mapasJson/AncientGreek.tmj";

    mapaInicial = mapaDestino;
    rutaMapa = mapaDestino;
    jugador.x = 944;
    jugador.y = 944;

    if (pantalla && nombre && anioDestino) {
        nombre.textContent = "Antigua Grecia";
        anioDestino.textContent = "Año 450 a. C.";
        pantalla.classList.add("visible");
    }

    setTimeout(() => {
        window.location.href = "/Juego?mapa=" + encodeURIComponent(mapaDestino) + "&spawnX=944&spawnY=944";
    }, 2200);
}

cargarPartida().then(() => {
    iniciarJuego();
});
let guardadoPendiente = null;

function marcarEstadoModificado() {
    clearTimeout(guardadoPendiente);

    guardadoPendiente = setTimeout(() => {
        guardarEstado();
    }, 500);
}
async function guardarEstado() {
    console.log("ANTES DE GUARDAR:");
    console.log("Jugador:", jugador.x, jugador.y);
    console.log("Mapa:", rutaMapa);

    if (typeof progreso === "object" && progreso) {
        progreso.palancasEstado = JSON.parse(JSON.stringify(estadosPaneles || {}));
    }

    const estado = {
        posicionX: jugador.x,
        posicionY: jugador.y,
        mapaActual: rutaMapa,
        inventario: inventario,
        progreso: progreso
    };

    const respuesta = await fetch("/Juego/GuardarEstado", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(estado)
    });

    if (!respuesta.ok) {
        console.error("No se pudo guardar la partida.");
        return false;
    }

    console.log("PARTIDA GUARDADA:", estado);
    return true;
}
window.guardarEstado = guardarEstado;