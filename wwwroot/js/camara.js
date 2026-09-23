const camara = {

    x: 0,

    y: 0

};


function actualizarCamara() {

    if (!mapa) {

        return;

    }


    camara.x =

        jugador.x *
        escala -

        canvas.width / 2 +

        jugador.ancho / 2;


    camara.y =

        jugador.y *
        escala -

        canvas.height / 2 +

        jugador.alto / 2;


    const anchoMapa =
        mapa.width *
        tamañoTilePantalla;


    const altoMapa =
        mapa.height *
        tamañoTilePantalla;


    if (
        anchoMapa >
        canvas.width
    ) {

        if (
            camara.x < 0
        ) {

            camara.x = 0;

        }


        if (
            camara.x >
            anchoMapa -
            canvas.width
        ) {

            camara.x =
                anchoMapa -
                canvas.width;

        }

    }

    else {

        camara.x =
            (
                anchoMapa -
                canvas.width
            ) / 2;

    }


    if (
        altoMapa >
        canvas.height
    ) {

        if (
            camara.y < 0
        ) {

            camara.y = 0;

        }


        if (
            camara.y >
            altoMapa -
            canvas.height
        ) {

            camara.y =
                altoMapa -
                canvas.height;

        }

    }

    else {

        camara.y =
            (
                altoMapa -
                canvas.height
            ) / 2;

    }


    // Posiciones enteras para que los tiles no dejen líneas entre ellos
    camara.x =
        Math.round(camara.x);

    camara.y =
        Math.round(camara.y);

}