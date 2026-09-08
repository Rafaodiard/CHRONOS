let npcs = [];

let puedeHablar = true;
let npcAnimaciones = [];
let mostrarIndicadorNPC = false;

const imagenTeclaE = new Image();
imagenTeclaE.src = "/sprites/ui/SpriteSheet.png";


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

            {
                x: 800,
                y: 500,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "Soldado",
                imagen: "/sprites/npcs/soldado.png",
                dialogo: "soldado"
            }
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
                dialogo: "sacerdote"
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


function actualizarIndicadorNPC() {

    if (dialogoAbierto) {

        mostrarIndicadorNPC = false;

        return;
    }

    const npcCercano =
        obtenerNPCCercano();

    mostrarIndicadorNPC =
        npcCercano !== null;
}


function dibujarIndicadorNPC() {

    if (!mostrarIndicadorNPC) {
        return;
    }

    const tamaño = 40;

    const x =
        canvas.width / 2 -
        tamaño / 2;

    const y =
        canvas.height / 2 -
        70;

    if (
        imagenTeclaE.complete &&
        imagenTeclaE.naturalWidth > 0
    ) {

        const teclaPresionada =
            teclas["e"];

        const sourceX =
            teclaPresionada ? 78 : 56;

        const sourceY = 68;

        const sourceWidth = 21;
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
}
function hayNPCCercano() {
    return obtenerNPCCercano() !== null;
}


cargarNPCs();