let frameAnimacion = 0;

let tiempoAnimacion = 0;

let introAnimacionNormal = false;
let animacionDespertarActiva = false;

const velocidadAnimacion = 8;

const jugador = {
    x: 944,
    y: 944,
    ancho: 84,
    alto: 84,
    velocidad: 4,
    direccion: "abajo",
    moviendose: false
};

const imagenJugador = new Image();

let cheatTranspasarParedes = false;
let cheatActivo = false;
let inventarioBackupCheat = null;
let progresoObjetosBackupCheat = null;
let velocidadBaseCheat = null;

imagenJugador.src = "/sprites/Player.png";

function obtenerPosicionSeguraMasCercana(xInicio, yInicio, maxRadio = 300, paso = 4) {
    for (let radio = 0; radio <= maxRadio; radio += paso) {
        const pasos = Math.max(8, Math.ceil((Math.PI * 2 * radio) / 12));

        for (let i = 0; i < pasos; i++) {
            const angulo = (i / pasos) * Math.PI * 2;
            const xPrueba = xInicio + Math.cos(angulo) * radio;
            const yPrueba = yInicio + Math.sin(angulo) * radio;
            const anchoJugador = jugador.ancho / escala;
            const altoJugador = jugador.alto / escala;

            const colisionEnCaja =
                hayColision(xPrueba, yPrueba) ||
                hayColision(xPrueba + anchoJugador, yPrueba) ||
                hayColision(xPrueba, yPrueba + altoJugador) ||
                hayColision(xPrueba + anchoJugador, yPrueba + altoJugador);

            if (!colisionEnCaja) {
                return { x: xPrueba, y: yPrueba };
            }
        }
    }

    return { x: xInicio, y: yInicio };
}

function activate() {
    if (cheatActivo) {
        inventario = inventarioBackupCheat ? JSON.parse(JSON.stringify(inventarioBackupCheat)) : [];

        if (progreso && typeof progreso === "object") {
            progreso.objetosRecogidos = progresoObjetosBackupCheat
                ? JSON.parse(JSON.stringify(progresoObjetosBackupCheat))
                : {};
        }

        cheatTranspasarParedes = false;
        if (velocidadBaseCheat !== null) {
            jugador.velocidad = velocidadBaseCheat;
        }

        if (hayColision(jugador.x, jugador.y)) {
            const posicionSegura = obtenerPosicionSeguraMasCercana(jugador.x, jugador.y);
            jugador.x = posicionSegura.x;
            jugador.y = posicionSegura.y;
        }

        cheatActivo = false;

        if (typeof marcarEstadoModificado === "function") {
            marcarEstadoModificado();
        }

        console.log("Cheats desactivados.");
        return false;
    }

    inventarioBackupCheat = JSON.parse(JSON.stringify(inventario || []));
    progresoObjetosBackupCheat = progreso && typeof progreso === "object" && progreso.objetosRecogidos
        ? JSON.parse(JSON.stringify(progreso.objetosRecogidos))
        : {};
    velocidadBaseCheat = jugador.velocidad;

    cheatActivo = true;
    cheatTranspasarParedes = true;
    jugador.velocidad = 8;

    const idsObjetos = Object.values(objetos || {}).map(objeto => objeto?.id).filter(Boolean);

    for (const idObjeto of idsObjetos) {
        const yaExiste = inventario.some(objeto => objeto.id === idObjeto);
        if (!yaExiste) {
            inventario.push({ id: idObjeto, cantidad: 1 });
        }

        if (progreso && typeof progreso === "object") {
            progreso.objetosRecogidos ??= {};
            progreso.objetosRecogidos[idObjeto] = true;
        }
    }

    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }

    console.log("Cheats activados.");
    return true;
}

function toggleCheats() {
    return activate();
}

window.toggleCheats = toggleCheats;
window.activate = activate;

document.addEventListener("keydown", function (e) {
    if (e.repeat) {
        return;
    }

    if (e.ctrlKey && (e.key === "F1" || e.code === "F1")) {
        e.preventDefault();
        e.stopPropagation();
        activate();
    }
});

function moverJugador() {
    const posicionAnteriorX = jugador.x;
    const posicionAnteriorY = jugador.y;

    let movimientoX = 0;
    let movimientoY = 0;

    jugador.moviendose = false;

    if (
        teclas["w"] ||
        teclas["arrowup"]
    ) {
        movimientoY = -jugador.velocidad;
        jugador.direccion = "arriba";
        jugador.moviendose = true;
    }

    else if (
        teclas["s"] ||
        teclas["arrowdown"]
    ) {
        movimientoY = jugador.velocidad;
        jugador.direccion = "abajo";
        jugador.moviendose = true;
    }

    else if (
        teclas["a"] ||
        teclas["arrowleft"]
    ) {
        movimientoX = -jugador.velocidad;
        jugador.direccion = "izquierda";
        jugador.moviendose = true;
    }

    else if (
        teclas["d"] ||
        teclas["arrowright"]
    ) {
        movimientoX = jugador.velocidad;
        jugador.direccion = "derecha";
        jugador.moviendose = true;
    }

    const nuevaX = jugador.x + movimientoX;
    const nuevaY = jugador.y + movimientoY;

    if (
        !hayColision(
            nuevaX,
            jugador.y
        )
    ) {
        jugador.x = nuevaX;
    }

    if (
        !hayColision(
            jugador.x,
            nuevaY
        )
    ) {
        jugador.y = nuevaY;
    }

    limitarJugador();
    limitarJugador();

    if (
        jugador.x !== posicionAnteriorX ||
        jugador.y !== posicionAnteriorY
    ) {
        marcarEstadoModificado();
    }
}

function dibujarJugador() {
    const filas = {
        abajo: 0,
        arriba: 1,
        derecha: 3,
        izquierda: 2
    };

    const usaAnimacionDespertar = animacionDespertarActiva || (modoIntroduccion && !introAnimacionNormal);
    const fila = usaAnimacionDespertar ? 4 : filas[jugador.direccion];

    const pantallaX =
        jugador.x * escala -
        camara.x;

    const pantallaY =
        jugador.y * escala -
        camara.y;

    const debeAnimarCaminata = jugador.moviendose || usaAnimacionDespertar;

    if (debeAnimarCaminata) {
        tiempoAnimacion++;

        const velocidadAnimacionActual =
            introAnimacionNormal
                ? 9999
                : (animacionDespertarActiva ? 18 : (modoIntroduccion ? 18 : Math.max(4, 16 - jugador.velocidad * 2)));

        if (
            tiempoAnimacion >=
            velocidadAnimacionActual
        ) {
            tiempoAnimacion = 0;
            frameAnimacion++;

            if (animacionDespertarActiva || (modoIntroduccion && !introAnimacionNormal)) {
                if (frameAnimacion >= 3) {
                    frameAnimacion = 0;
                }
            }
            else if (frameAnimacion >= 4) {
                frameAnimacion = 0;
            }
        }
    }
    else {
        frameAnimacion = 0;
        tiempoAnimacion = 0;
    }

    ctx.drawImage(
        imagenJugador,
        frameAnimacion * 16,
        fila * 16 + 1,
        16,
        15,
        pantallaX,
        pantallaY,
        jugador.ancho,
        jugador.alto
    );
}

function mirarNPC(npc) {
    const diferenciaX =
        npc.x - jugador.x;

    const diferenciaY =
        npc.y - jugador.y;

    if (
        Math.abs(diferenciaX) >
        Math.abs(diferenciaY)
    ) {
        if (diferenciaX > 0) {
            jugador.direccion = "derecha";
        }
        else {
            jugador.direccion = "izquierda";
        }
    }
    else {
        if (diferenciaY > 0) {
            jugador.direccion = "abajo";
        }
        else {
            jugador.direccion = "arriba";
        }
    }

    jugador.moviendose = false;
    frameAnimacion = 0;
    tiempoAnimacion = 0;
}