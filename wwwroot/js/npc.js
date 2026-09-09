let npcs = [];

let puedeHablar = true;
let npcAnimaciones = [];




function cargarNPCs() {

    npcs = [];

    if (rutaMapa === "/Maps/mapasJson/AncientGreek.tmj") {

        npcs = [
            {
                x: 700,
                y: 500,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "Anciano",
                imagen: "/sprites/npcs/elder.png",
                dialogo: "Anciano"
            },

        ];

    }

    else if (rutaMapa === "/Maps/mapasJson/TemploGrecia.tmj") {

        npcs = [
            {
                x: 300,
                y: 400,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "Sacerdote",
                imagen: "/sprites/npcs/elder.png",
                dialogo: "Sacerdote"
            }
        ];

    }

    inicializarNPCs();
}


function inicializarNPCs() {

    npcAnimaciones = npcs.map(function (npc) {

        const imagen = new Image();

        imagen.onload = function () {
            console.log("NPC cargado:", npc.nombre);
        };

        imagen.onerror = function () {
            console.error("No se pudo cargar:", npc.imagen);
        };

        imagen.src = npc.imagen;

        return {
            imagen: imagen,
            frame: 0,
            ultimoFrame: performance.now()
        };
    });
}


function actualizarAnimacionesNPC() {

    const ahora = performance.now();

    npcs.forEach(function (npc, indice) {

        const animacion =
            npcAnimaciones[indice];

        if (!animacion) {
            return;
        }

        if (
            ahora -
            animacion.ultimoFrame >= 150
        ) {

            animacion.frame++;

            if (animacion.frame >= 4) {
                animacion.frame = 0;
            }

            animacion.ultimoFrame = ahora;
        }
    });
}


function dibujarNPCs() {

    actualizarAnimacionesNPC();

    npcs.forEach(function (npc, indice) {

        const animacion =
            npcAnimaciones[indice];

        if (
            !animacion ||
            !animacion.imagen.complete ||
            animacion.imagen.naturalWidth === 0
        ) {
            return;
        }

        const pantallaX =
            npc.x * escala -
            camara.x;

        const pantallaY =
            npc.y * escala -
            camara.y;

        ctx.drawImage(

            animacion.imagen,

            animacion.frame * 32,
            0,
            32,
            32,

            pantallaX,
            pantallaY,

            npc.tamañoVisual,
            npc.tamañoVisual
        );
    });
}


function obtenerNPCCercano() {

    for (const npc of npcs) {

        const distanciaX =
            Math.abs(jugador.x - npc.x);

        const distanciaY =
            Math.abs(jugador.y - npc.y);

        if (
            distanciaX < 80 &&
            distanciaY < 80
        ) {
            return npc;
        }
    }

    return null;
}


function comprobarNPC() {

    if (
        dialogoAbierto ||
        !puedeHablar
    ) {
        return;
    }

    const npcCercano =
        obtenerNPCCercano();

    if (
        npcCercano &&
        teclas["e"]
    ) {

        teclas["e"] = false;

        puedeHablar = false;

        mirarNPC(npcCercano);

        abrirDialogo(
            npcCercano.dialogo
        );
    }
}



function hayNPCCercano() {
    return obtenerNPCCercano() !== null;
}


cargarNPCs();