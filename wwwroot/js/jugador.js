

let frameAnimacion = 0;

let tiempoAnimacion = 0;

const velocidadAnimacion = 8;




const jugador = {

    x: 944,

    y: 944,

    ancho: 84,

    alto: 84,

    velocidad: 10,

    direccion: "abajo",

    moviendose: false
    

};




const imagenJugador = new Image();

imagenJugador.src =
    "/sprites/Player.png";



function moverJugador() {

    let movimientoX = 0;

    let movimientoY = 0;


    jugador.moviendose = false;




    if (
        teclas["w"] ||
        teclas["arrowup"]
    ) {

        movimientoY =
            -jugador.velocidad;

        jugador.direccion =
            "arriba";

        jugador.moviendose =
            true;

    }




    else if (
        teclas["s"] ||
        teclas["arrowdown"]
    ) {

        movimientoY =
            jugador.velocidad;

        jugador.direccion =
            "abajo";

        jugador.moviendose =
            true;

    }



    else if (
        teclas["a"] ||
        teclas["arrowleft"]
    ) {

        movimientoX =
            -jugador.velocidad;

        jugador.direccion =
            "izquierda";

        jugador.moviendose =
            true;

    }




    else if (
        teclas["d"] ||
        teclas["arrowright"]
    ) {

        movimientoX =
            jugador.velocidad;

        jugador.direccion =
            "derecha";

        jugador.moviendose =
            true;

    }



    const nuevaX =
        jugador.x + movimientoX;

    const nuevaY =
        jugador.y + movimientoY;



    if (
        !hayColision(
            nuevaX,
            jugador.y
        )
    ) {

        jugador.x =
            nuevaX;

    }




    if (
        !hayColision(
            jugador.x,
            nuevaY
        )
    ) {

        jugador.y =
            nuevaY;

    }




    limitarJugador();

    limitarJugador();

}



function dibujarJugador() {

    const filas = {

        abajo: 0,

        arriba: 1,

        derecha: 3,

        izquierda: 2

    };


    const fila =
        filas[jugador.direccion];


    const pantallaX =
        jugador.x * escala -
        camara.x;


    const pantallaY =
        jugador.y * escala -
        camara.y;




    if (jugador.moviendose) {

        tiempoAnimacion++;


        const velocidadAnimacionActual =
            Math.max(
                4,
                16 - jugador.velocidad * 2
            );


        if (
            tiempoAnimacion >=
            velocidadAnimacionActual
        ) {

            tiempoAnimacion = 0;

            frameAnimacion++;


            if (
                frameAnimacion >= 4
            ) {

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

            jugador.direccion =
                "derecha";

        } else {

            jugador.direccion =
                "izquierda";

        }

    } else {

        if (diferenciaY > 0) {

            jugador.direccion =
                "abajo";

        } else {

            jugador.direccion =
                "arriba";

        }

    }


    jugador.moviendose = false;

    frameAnimacion = 0;

    tiempoAnimacion = 0;
}