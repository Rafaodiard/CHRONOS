const imagenTeclaE = new Image();

imagenTeclaE.src = "/sprites/ui/Teclado.png";

let mostrarIndicadorE = false;

let frameTeclaE = 0;
let tiempoTeclaE = 0;

const velocidadAnimacionE = 90;


function actualizarIndicadorE(mostrar) {

    mostrarIndicadorE = mostrar;

}


function animarIndicadorE() {

    if (!mostrarIndicadorE) {
        frameTeclaE = 0;
        tiempoTeclaE = 0;
        return;
    }

    tiempoTeclaE++;

    if (tiempoTeclaE >= velocidadAnimacionE) {

        tiempoTeclaE = 0;

        frameTeclaE++;

        if (frameTeclaE >= 2) {
            frameTeclaE = 0;
        }
    }
}


function dibujarIndicadorE() {

    if (!mostrarIndicadorE) {
        return;
    }

    if (
        !imagenTeclaE.complete ||
        imagenTeclaE.naturalWidth === 0
    ) {
        return;
    }

    animarIndicadorE();

    const tamaño = 40;
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

    let sourceX;
    let sourceWidth;
    let sourceHeight;

    if (frameTeclaE === 0) {

        sourceX = 59.2;
        sourceWidth = 15.5;
        sourceHeight = 18;

    } else {

        sourceX = 75;
        sourceWidth = 15;
        sourceHeight = 18;

    }

    ctx.drawImage(
        imagenTeclaE,
        sourceX,
        68,
        sourceWidth,
        sourceHeight,
        x,
        y,
        tamaño,
        tamaño
    );
}