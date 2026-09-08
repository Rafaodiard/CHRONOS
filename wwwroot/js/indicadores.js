const imagenTeclaE = new Image();

imagenTeclaE.src = "/sprites/ui/SpriteSheet.png";

let mostrarIndicadorE = false;


function actualizarIndicadorE(mostrar) {
    mostrarIndicadorE = mostrar;
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

    const tamaño = 40;

    const x =
        canvas.width / 2 -
        tamaño / 2;

    const y =
        canvas.height / 2 -
        70;

    const teclaPresionada =
        teclas["e"];

    const sourceX =
        teclaPresionada ? 77 : 59;

    const sourceY = 68;

    const sourceWidth = 18;
    const sourceHeight = 18;

    ctx.drawImage(
        imagenTeclaE,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        x,
        y,
        tamaño,
        tamaño
    );
}