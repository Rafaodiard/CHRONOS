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
let introduccionDialogoIniciada = false;

if (modoIntroduccion) {
    progreso.introduccionCompletada = false;
    localStorage.removeItem("chronosIntroduccionCompletada");
}


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

    if (!modoIntroduccion && !transicionEnCurso && !dialogoAbierto && !acertijoAbierto && !bibliotecaAbierta && !palancasAbierto) {

        moverJugador();

        comprobarNPC();

        comprobarObjetos(); 
        comprobarInteractuables();
        comprobarPalancas();
        comprobarAcertijos();
        actualizarInteraccion();

        actualizarIndicadorE(
            hayNPCCercano() ||
            jugadorEnTransicionActual() ||
            mostrarIndicadorObjeto ||     
            mostrarIndicadorInteractuable ||
            mostrarIndicadorAcertijo ||
            mostrarIndicadorPalanca

        );
    }

    actualizarCamara();

    dibujarMapa();

    dibujarObjetosMapa();

    dibujarPalancas();

    dibujarNPCs();

    dibujarJugador();

    dibujarEstructurasDelante();

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

const mapaInicial = modoIntroduccion
    ? "/Maps/mapasJson/labo.tmj"
    : parametrosJuego.get("mapa")
    || "/Maps/mapasJson/AncientGreek.tmj";

if (modoIntroduccion || mapaInicial === "/Maps/mapasJson/labo.tmj") {
    jugador.x = 400;
    jugador.y = 400;
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
    localStorage.setItem("chronosIntroduccionCompletada", "true");

    const anio = document.getElementById("introduccionAnio");
    if (anio) {
        anio.textContent = "";
    }
    anio?.classList.add("transicionando");

    const pantalla = document.getElementById("transicionEpoca");
    const nombre = document.getElementById("transicionEpocaNombre");
    const anioDestino = document.getElementById("transicionEpocaAnio");

    if (pantalla && nombre && anioDestino) {
        nombre.textContent = "Antigua Grecia";
        anioDestino.textContent = "Año 450 a. C.";
        pantalla.classList.add("visible");
    }

    setTimeout(() => {
        window.location.href = "/Juego?mapa=/Maps/mapasJson/AncientGreek.tmj";
    }, 2200);
}

cargarMapa(mapaInicial);

