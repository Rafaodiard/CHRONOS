let npcs = [];

let puedeHablar = true;
let npcAnimaciones = [];




function cargarNPCs() {

    npcs = [];

    if (rutaMapa === "/Maps/mapasJson/AncientGreek.tmj") {

        npcs = [
            {
                x: 1275,
                y: 1130,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "Anciano",
                imagen: "/sprites/npcs/elder.png",
                dialogoInicial: "Anciano",
                alTerminar: () => {
                progreso.habloConAnciano = true;
    }
                
            },{
                x: 230,
                y: 1550,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "Pescador",
                imagen: "/sprites/npcs/Pescador.png",
                dialogoInicial: "PescadorInicial",
                dialogos:
                [
                    {
                        condicion: () => progreso.encontroLlaveBronce,
                        dialogo: "PescadorConLlave"
                    },{
                        condicion: () => progreso.habloConAnciano,
                        dialogo: "PescadorConAnciano"
                    }
                ]
            },{
                x: 650,
                y: 1350,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "Comerciante",
                imagen: "/sprites/npcs/Comerciante.png",
                dialogoInicial: "ComercianteInicial",
                dialogos:
                [
                    {
                        condicion: ()=> progreso.habloConComerciante,
                        dialogo: "ComercianteFinal"
                    },{
                        condicion: () => progreso.consiguioJarraAntigua,
                        dialogo: "ComercianteConJarra"
                    }
                ],                   
                alTerminar: () => {
                        if (progreso.consiguiJarraAntigua) {
                            progreso.habloConComerciante = true;
                        }
                    }
            },
            {
                x: 650,
                y: 1350,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "Alfarero",
                imagen: "/sprites/npcs/Alfarero.png",
                dialogoInicial: "AlfareroInicial",
                dialogos:
                [
                    {
                        condicion: ()=> progreso.habloConComerciante,
                        dialogo: "ComercianteFinal"
                    },
                ],                   

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
                dialogoInicial: "SacerdoteInicial"
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

function obtenerDialogoNPC(npc) {

    if (!npc.dialogos) {
        return npc.dialogoInicial;
    }

    for (const dialogo of npc.dialogos) {
        if (dialogo.condicion()) {
            return dialogo.dialogo;
        }
    }

    return npc.dialogoInicial;
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
        npcDialogoActual = npcCercano;

        abrirDialogo(
            obtenerDialogoNPC(npcCercano)
        );
    }
}



function hayNPCCercano() {
    return obtenerNPCCercano() !== null;
}


cargarNPCs();