let npcs = [];

let puedeHablar = true;
let npcAnimaciones = [];

function obtenerRutaMapaActual() {
    if (typeof rutaMapa !== "undefined" && rutaMapa) {
        return rutaMapa;
    }

    if (typeof window !== "undefined") {
        const parametros = new URLSearchParams(window.location.search);
        const mapaDesdeQuery = parametros.get("mapa");
        if (mapaDesdeQuery) {
            return mapaDesdeQuery;
        }
    }

    return "/Maps/mapasJson/AncientGreek.tmj";
}

function cargarNPCs() {

    npcs = [];
    const rutaActual = obtenerRutaMapaActual();

    if (rutaActual === "/Maps/mapasJson/labo.tmj") {

        npcs = [
            {
                x: 350,
                y: 450,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "Investigadora",
                imagen: "/sprites/npcs/Investigadora.png",
                dialogoInicial: "InvestigadoraInicial"
            }
        ];

    }

    else if (rutaActual === "/Maps/mapasJson/IntroRev.tmj") {

        npcs = [
            {
                x: 410,
                y: 160,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "Trabajador",
                imagen: "/sprites/npcs/stranger.png",
                dialogoInicial: "TrabajadorFabrica",
                dialogos: [
                    {
                        condicion: () => progreso.reparoMaquina && progreso.habloConIngenieroIndustrial,
                        dialogo: "TrabajadorFabricaResuelto"
                    },
                    {
                        condicion: () => progreso.habloConIngenieroIndustrial,
                        dialogo: "TrabajadorFabricaDespues"
                    }
                ],
                alTerminar: () => {
                    progreso.habloConIngenieroIndustrial = true;
                    if (typeof marcarEstadoModificado === "function") {
                        marcarEstadoModificado();
                    }
                }
            }
        ];

    }

    else if (rutaActual === "/Maps/mapasJson/recepcion.tmj") {

        npcs = [
            {
                x: 150,
                y: 120,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "recepcionista",
                imagen: "/sprites/npcs/recepcionista.png",
                dialogoInicial: "recepcionista",
                alTerminar: () => {
                    progreso.habloConEncargado = true;
                    if (typeof marcarEstadoModificado === "function") {
                        marcarEstadoModificado();
                    }
                }
            }
        ];

    }

    else if (rutaActual === "/Maps/mapasJson/AncientGreek.tmj") {

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
                    if (typeof marcarEstadoModificado === "function") {
                        marcarEstadoModificado();
                    }
                }
            },
            {
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

                    if (typeof marcarEstadoModificado === "function") {
                        marcarEstadoModificado();
                    }
                }
            },
            {
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
                    },
                    {
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
                        if (typeof marcarEstadoModificado === "function") {
                            marcarEstadoModificado();
                        }
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
                            if (typeof marcarEstadoModificado === "function") {
                                marcarEstadoModificado();
                            }
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
                        if (typeof marcarEstadoModificado === "function") {
                            marcarEstadoModificado();
                        }
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

                    marcarEstadoModificado();
                }
            },
            {
                x: progreso.guardiaX ?? 1250,
                y: progreso.guardiaY ?? 600,
                ancho: 64,
                alto: 64,
                tamañoVisual: 160,
                nombre: "Guardia",
                imagen: "/sprites/npcs/Guardia.png",
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
                    if (progreso.tienePermisoEscriba) {
                        iniciarDesbloqueoGuardia();
                    }
                    if (typeof marcarEstadoModificado === "function") {
                        marcarEstadoModificado();
                    }
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

 

function buscarTransicionPorDestino(destinoMapa) {
    if (!transiciones) return null;

    return transiciones.find(function (t) {
        return (
            t.properties &&
            t.properties.find(p => p.name === "MapaDestino" && p.value === destinoMapa)
        );
    });
}

function iniciarDesbloqueoGuardia() {
    const guardia = npcs.find(n => n.nombre === "Guardia");

    if (!guardia) return;

    if (progreso.guardiaLlegado) {
        guardia.moviendose = false;
        return;
    }

    const trans = buscarTransicionPorDestino("/Maps/mapasJson/CastilloPiso2.tmj");

    console.log("iniciarDesbloqueoGuardia: trans encontrada=", trans);

    if (!trans) return;

    guardia.objetivoX = trans.x + (trans.width || 0) / 2 + 100;
    guardia.objetivoY = trans.y + (trans.height || 0) / 2;
    guardia.moviendose = true;
    guardia.velocidad = 1.2;

    console.log("Guardia moviéndose hacia:", guardia.objetivoX, guardia.objetivoY);
}

function actualizarMovimientosNPCs() {
    for (const npc of npcs) {
        if (!npc.moviendose) continue;

        const dx = npc.objetivoX - npc.x;
        const dy = npc.objetivoY - npc.y;
        const distancia = Math.hypot(dx, dy);

        if (distancia < 2) {
            npc.x = npc.objetivoX;
            npc.y = npc.objetivoY;
            npc.moviendose = false;
            if (npc.nombre === "Guardia") {
                progreso.guardiaX = npc.x;
                progreso.guardiaY = npc.y;
                progreso.guardiaLlegado = true;
                if (typeof marcarEstadoModificado === "function") {
                    marcarEstadoModificado();
                }
                console.log("Guardia ha llegado a la puerta. progreso.guardiaLlegado=true");
                try {
                    const trans = buscarTransicionPorDestino("/Maps/mapasJson/CastilloPiso2.tmj");

                    if (trans) {
                        trans.properties = trans.properties || [];

                        const prop = trans.properties.find(p => p.name === "Desbloqueada");
                        if (prop) {
                            prop.value = true;
                        } else {
                            trans.properties.push({ name: "Desbloqueada", value: true });
                        }

                        console.log('Transición a CastilloPiso2 marcada como Desbloqueada');
                    } else {
                        console.warn('No se encontró la transición para marcar como desbloqueada');
                    }
                }
                catch (e) {
                    console.error('Error marcando transición desbloqueada:', e);
                }
            }
            continue;
        }

        const nx = dx / distancia;
        const ny = dy / distancia;

        npc.x += nx * (npc.velocidad || 1);
        npc.y += ny * (npc.velocidad || 1);

        if (npc.nombre === "Guardia") {
            progreso.guardiaX = npc.x;
            progreso.guardiaY = npc.y;
        }
    }
}


function dibujarNPCs() {

    actualizarMovimientosNPCs();

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