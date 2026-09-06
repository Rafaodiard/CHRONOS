const npc = {

    x: 500,

    y: 400,

    ancho: 64,

    alto: 64,

    nombre: "Anciano"

};


function comprobarNPC() {

    const distanciaX =
        Math.abs(
            jugador.x -
            npc.x
        );


    const distanciaY =
        Math.abs(
            jugador.y -
            npc.y
        );


    if (

        distanciaX < 80 &&

        distanciaY < 80

    ) {

        if (teclas["e"]) {

            teclas["e"] = false;


            abrirDialogo(
                "npcPrueba"
            );

        }

    }

}


function dibujarNPC() {

    const pantallaX =
        npc.x *
        escala -
        camara.x;


    const pantallaY =
        npc.y *
        escala -
        camara.y;


    ctx.fillStyle =
        "red";


    ctx.fillRect(

        pantallaX,

        pantallaY,

        npc.ancho,

        npc.alto

    );

}