let colisiones = [];

function cargarColisiones() {

    const capaColisiones =
        mapa.layers.find(
            capa =>
                capa.name === "Colisiones"
        );


    if (!capaColisiones) {

        console.error(
            "No se encontró la capa Colisiones"
        );

        return;

    }


    colisiones =
        capaColisiones.objects;


    console.log(
        "Colisiones cargadas:",
        colisiones.length
    );

}


function hayColision(x, y) {

    // La colisión empieza en la mitad del personaje
    const jugadorIzquierda = x;

    const jugadorDerecha =
        x + jugador.ancho / escala;

    const jugadorArriba =
        y + (jugador.alto / escala) / 2;

    const jugadorAbajo =
        y + jugador.alto / escala;


    for (const colision of colisiones) {

        const colisionIzquierda =
            colision.x;

        const colisionDerecha =
            colision.x + colision.width;

        const colisionArriba =
            colision.y;

        const colisionAbajo =
            colision.y + colision.height;


        if (
            jugadorIzquierda < colisionDerecha &&
            jugadorDerecha > colisionIzquierda &&
            jugadorArriba < colisionAbajo &&
            jugadorAbajo > colisionArriba
        ) {

            return true;

        }

    }


    return false;

}


function limitarJugador() {

    if (!mapa) {

        return;

    }


    const anchoMapa =
        mapa.width *
        tamañoTile;


    const altoMapa =
        mapa.height *
        tamañoTile;


    if (jugador.x < 0) {

        jugador.x = 0;

    }


    if (jugador.y < 0) {

        jugador.y = 0;

    }


    if (
        jugador.x >
        anchoMapa -
        jugador.ancho / escala
    ) {

        jugador.x =
            anchoMapa -
            jugador.ancho / escala;

    }


    if (
        jugador.y >
        altoMapa -
        jugador.alto / escala
    ) {

        jugador.y =
            altoMapa -
            jugador.alto / escala;

    }

}