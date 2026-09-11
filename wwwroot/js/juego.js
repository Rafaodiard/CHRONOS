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


document.addEventListener("keydown", function (e) {
    const tecla = e.key.toLowerCase();

    if (dialogoAbierto && tecla === "e") {
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

    if (!dialogoAbierto) {

        moverJugador();

        comprobarNPC();

        comprobarObjetos(); 
        comprobarInteractuables();
        actualizarInteraccion();

        actualizarIndicadorE(
            hayNPCCercano() ||
            jugadorEnTransicionActual() ||
            mostrarIndicadorObjeto ||     
            mostrarIndicadorInteractuable

        );
    }

    actualizarCamara();

    dibujarMapa();

    dibujarObjetosMapa();

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
    requestAnimationFrame(loop);
}

cargarMapa("/Maps/mapasJson/AncientGreek.tmj");

