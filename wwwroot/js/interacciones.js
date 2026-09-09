let transiciones = [];
let mostrarIndicadorInteraccion = false;
let transicionEnCurso = false;
let opacidadFade = 0;
let fadeActivo = false;

function cargarTransiciones() {

    transiciones = [];

    if (!mapa || !mapa.layers) {
        return;
    }

    const capaTransiciones = mapa.layers.find(
        capa => capa.name === "Transiciones"
    );

    if (!capaTransiciones || !capaTransiciones.objects) {
        return;
    }

    transiciones = capaTransiciones.objects;

    console.log("TRANSICIONES CARGADAS:", transiciones);
}

function jugadorEnTransicion(transicion) {

    const jugadorIzquierda = jugador.x;
    const jugadorDerecha = jugador.x + jugador.ancho / escala;

    const jugadorArriba = jugador.y + (jugador.alto / escala) / 2;
    const jugadorAbajo = jugador.y + jugador.alto / escala;

    const transicionIzquierda = transicion.x;
    const transicionDerecha = transicion.x + transicion.width;

    const transicionArriba = transicion.y;
    const transicionAbajo = transicion.y + transicion.height;

    return (
        jugadorIzquierda < transicionDerecha &&
        jugadorDerecha > transicionIzquierda &&
        jugadorArriba < transicionAbajo &&
        jugadorAbajo > transicionArriba
    );
}

function obtenerTransicionActual() {

    for (const transicion of transiciones) {

        if (jugadorEnTransicion(transicion)) {
            return transicion;
        }
    }

    return null;
}
function jugadorEnTransicionActual() {
    return obtenerTransicionActual() !== null;
}

function actualizarInteraccion() {

    const transicionActual = obtenerTransicionActual();

    mostrarIndicadorInteraccion = transicionActual !== null;
}

document.addEventListener("keydown", function (e) {

    if (e.key.toLowerCase() !== "e") {
        return;
    }

    const transicionActual = obtenerTransicionActual();

    if (!transicionActual) {
        return;
    }

    ejecutarTransicion(transicionActual);
});

function ejecutarTransicion(transicion) {

    if (transicionEnCurso) {
        return;
    }

    const mapaDestino = transicion.properties.find(
        propiedad => propiedad.name === "MapaDestino"
    );

    const spawnX = transicion.properties.find(
        propiedad => propiedad.name === "SpawnX"
    );

    const spawnY = transicion.properties.find(
        propiedad => propiedad.name === "SpawnY"
    );

    if (!mapaDestino || !spawnX || !spawnY) {
        console.error("La transición no tiene todas las propiedades necesarias.");
        return;
    }

    transicionEnCurso = true;

    iniciarFadeTransicion(
        mapaDestino.value,
        Number(spawnX.value),
        Number(spawnY.value)
    );
}

function iniciarFadeTransicion(mapaDestino, spawnX, spawnY) {

    fadeActivo = true;
    opacidadFade = 0;

    const intervalo = setInterval(function () {

        opacidadFade += 0.05;

        if (opacidadFade >= 1) {

            opacidadFade = 1;

            clearInterval(intervalo);

            cambiarMapa(
                mapaDestino,
                spawnX,
                spawnY
            );

            iniciarFadeSalida();
        }

    }, 25);
}

function iniciarFadeSalida() {

    const intervalo = setInterval(function () {

        opacidadFade -= 0.05;

        if (opacidadFade <= 0) {

            opacidadFade = 0;
            fadeActivo = false;
            transicionEnCurso = false;

            clearInterval(intervalo);
        }

    }, 25);
}

function dibujarIndicadorInteraccion() {
    if (!mostrarIndicadorInteraccion) return;

    const tamaño = 28;

    const jugadorPantallaX =
        jugador.x * escala - camara.x;

    const jugadorPantallaY =
        jugador.y * escala - camara.y;

    const x =
        jugadorPantallaX +
        jugador.ancho / 2 -
        tamaño / 2;

    const y =
        jugadorPantallaY -
        tamaño -
        10;

    ctx.fillStyle = "red";
    ctx.fillRect(x, y, tamaño, tamaño);

    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        "E",
        x + tamaño / 2,
        y + tamaño / 2
    );
}
function dibujarFade() {

    if (!fadeActivo) {
        return;
    }

    ctx.fillStyle = `rgba(0, 0, 0, ${opacidadFade})`;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}