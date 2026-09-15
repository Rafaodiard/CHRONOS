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
                progreso.habloConAnciano = true;}
                
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
                        condicion: () => !progreso.habloConAnciano,
                        dialogo: "PescadorInicial"
                    },
                    {
                        condicion: () =>
                            progreso.habloConAnciano &&
                            tieneObjeto("llave_bronce") &&
                            !progreso.habloConPescadorDespuesDeAnciano,
                        dialogo: "PescadorConAncianoYLlave"
                    },
                    {
                        condicion: () =>
                            progreso.habloConAnciano &&
                            tieneObjeto("llave_bronce") &&
                            progreso.habloConPescadorDespuesDeAnciano,
                        dialogo: "PescadorConLlave"
                    },
                    {
                        condicion: () => progreso.habloConAnciano,
                        dialogo: "PescadorConAnciano"
                    }
                ],
                alTerminar: () => {
                    progreso.habloConPescador = true;

                    if (progreso.habloConAnciano) {
                        progreso.habloConPescadorDespuesDeAnciano = true;
                    }
                }
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
                        condicion: () => tieneObjeto("vasija_antigua"),
                        dialogo: "ComercianteConJarra"
                    }
                ],                   
                alTerminar: () => {
                        if (
                            tieneObjeto("vasija_antigua") &&
                            !tieneObjeto("sello_del_templo")
                        ) {
                            quitarObjeto("vasija_antigua");
                            agregarObjeto("sello_del_templo");
                            progreso.habloConComerciante = true;
                        }
                    }
            },
            {
                x: 1350,
                y: 570,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "Alfarero",
                imagen: "/sprites/npcs/Alfarero.png",
                dialogoInicial: "AlfareroInicial",
                dialogos:
                [
                    {
                        condicion: () => tieneObjeto("vasija_rota"),
                        dialogo: "AlfareroConVasija"
                    },
                ],                  
                    alTerminar: () => {
                        if (
                            tieneObjeto("vasija_rota") &&
                            !progreso.consiguioJarraAntigua
                        ) {
                            quitarObjeto("vasija_rota");
                            agregarObjeto("vasija_antigua");
                            progreso.consiguioVasijaRota = true;
                            progreso.consiguioJarraAntigua = true;
                        }
                    } 

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
                dialogoInicial: "SacerdoteConInformacion",
                dialogos:
                [
                    {
                        condicion: () => progreso.puedeEntrarTemplo,
                        dialogo: "SacerdoteConAcertijo"
                    }
                ],
                alTerminar: () => {
                    if (
                        progreso.puedeEntrarTemplo &&
                        !tieneObjeto("llave_templo")
                    ) {
                        agregarObjeto("llave_templo");
                        progreso.habloConSacerdote = true;
                    }
                }
            }
        ];

    }

    else if (rutaMapa === "/Maps/mapasJson/CastilloPrincipal.tmj") {

        npcs = [
            {
                x: 345,
                y: 1075,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "Escriba",
                imagen: "/sprites/npcs/bibliotecario.png",
                dialogoInicial: "EscribaInicial",
                dialogos: [
                    {
                        condicion: () => progreso.tienePermisoEscriba,
                        dialogo: "EscribaConPermiso"
                    },
                    {
                        condicion: () => tieneObjeto("Documento1") && !progreso.habloConEscriba,
                        dialogo: "EscribaConDocumento"
                    },
                    {
                        condicion: () => tieneObjeto("Documento1"),
                        dialogo: "EscribaDocumentoEncontrado"
                    },
                    {
                        condicion: () => progreso.habloConEscriba,
                        dialogo: "EscribaSinDocumento"
                    }
                ],
                alTerminar: () => {
                    progreso.habloConEscriba = true;

                    if (
                        tieneObjeto("Documento1") &&
                        !progreso.tienePermisoEscriba
                    ) {
                        quitarObjeto("Documento1");
                        progreso.tienePermisoEscriba = true;
                    }
                }
            },
            {
                x: 1200,
                y: 400,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "Guardia",
                imagen: "/sprites/npcs/stranger.png",
                dialogoInicial: "GuardiaInicial",
                dialogos: [
                    {
                        condicion: () => progreso.tienePermisoEscriba,
                        dialogo: "GuardiaConPermiso"
                    },
                    {
                        condicion: () => progreso.habloConGuardia,
                        dialogo: "GuardiaSinPermiso"
                    }
                ],
                alTerminar: () => {
                    progreso.habloConGuardia = true;
                }
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

        abrirDialogo(
            obtenerDialogoNPC(npcCercano),
            npcCercano
        );
    }
}



function hayNPCCercano() {
    return obtenerNPCCercano() !== null;
}


cargarNPCs();