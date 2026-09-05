// ============================================================
// CHRONOS - JUEGO
// ============================================================
//
// Estructura:
//
// 1. CONFIGURACIÓN
// 2. CANVAS
// 3. JUGADOR
// 4. NPC
// 5. TECLAS
// 6. CÁMARA
// 7. DIÁLOGOS
// 8. MAPA
// 9. TILESETS
// 10. MOVIMIENTO
// 11. INTERACCIONES
// 12. DIBUJO
// 13. LOOP PRINCIPAL
// 14. RESIZE
//
// ============================================================


// ============================================================
// 1. CONFIGURACIÓN
// ============================================================

const tamañoTile = 32;

// Escala visual.
// El mapa original utiliza tiles de 32x32.
// En pantalla los mostramos a 64x64.

const escala = 2;

const tamañoTilePantalla =
    tamañoTile * escala;


// ============================================================
// 2. CANVAS
// ============================================================

const canvas =
    document.getElementById("juego");

const ctx =
    canvas.getContext("2d");

canvas.width =
    window.innerWidth;

canvas.height =
    window.innerHeight;


// ============================================================
// 3. JUGADOR
// ============================================================

const jugador = {

    x: 100,
    y: 100,

    ancho: 64,
    alto: 64,

    velocidad: 4

};


// ============================================================
// 4. NPC
// ============================================================

const npc = {

    x: 500,
    y: 400,

    ancho: 64,
    alto: 64,

    nombre: "Anciano"

};


// ============================================================
// 5. TECLAS
// ============================================================

const teclas = {};


// Tecla presionada
document.addEventListener("keydown", function (e) {

    teclas[e.key.toLowerCase()] = true;


    // Evitar que las flechas muevan la página
    if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
    ) {

        e.preventDefault();

    }

});


// Tecla soltada
document.addEventListener("keyup", function (e) {

    teclas[e.key.toLowerCase()] = false;

});


// ============================================================
// 6. CÁMARA
// ============================================================

const camara = {

    x: 0,
    y: 0

};


// ============================================================
// 7. DIÁLOGOS
// ============================================================

let dialogoAbierto = false;

let dialogoActual = null;

let indiceDialogo = 0;


// ------------------------------------------------------------
// Abrir diálogo
// ------------------------------------------------------------

function abrirDialogo(nombre) {

    if (
        typeof dialogos === "undefined"
    ) {

        console.error(
            "No existe dialogos.js"
        );

        return;

    }


    if (!dialogos[nombre]) {

        console.error(
            "No existe el diálogo:",
            nombre
        );

        return;

    }


    dialogoActual =
        dialogos[nombre];

    indiceDialogo = 0;

    dialogoAbierto = true;

    mostrarDialogo();

}


// ------------------------------------------------------------
// Mostrar diálogo
// ------------------------------------------------------------

function mostrarDialogo() {

    if (!dialogoActual) {
        return;
    }


    if (
        indiceDialogo >=
        dialogoActual.length
    ) {

        cerrarDialogo();

        return;

    }


    const dialogo =
        dialogoActual[indiceDialogo];


    const caja =
        document.getElementById("dialogo");

    const nombre =
        document.getElementById(
            "nombrePersonaje"
        );

    const texto =
        document.getElementById("texto");

    const imagen =
        document.getElementById(
            "imagenPersonaje"
        );


    if (
        !caja ||
        !nombre ||
        !texto
    ) {

        return;

    }


    caja.style.display = "flex";


    nombre.textContent =
        dialogo.personaje;


    texto.textContent =
        dialogo.texto;


    // Imagen del personaje
    if (
        imagen &&
        dialogo.imagen
    ) {

        imagen.style.backgroundImage =
            `url('/img/personajes/${dialogo.imagen}')`;

        imagen.style.backgroundSize =
            "contain";

        imagen.style.backgroundRepeat =
            "no-repeat";

        imagen.style.backgroundPosition =
            "center";

        imagen.textContent = "";

    }

}


// ------------------------------------------------------------
// Avanzar diálogo
// ------------------------------------------------------------

document.addEventListener(
    "keydown",
    function (e) {

        if (!dialogoAbierto) {
            return;
        }


        if (
            e.key === "Enter" ||
            e.key === " " ||
            e.key.toLowerCase() === "e"
        ) {

            indiceDialogo++;

            mostrarDialogo();

        }

    }
);


// ------------------------------------------------------------
// Cerrar diálogo
// ------------------------------------------------------------

function cerrarDialogo() {

    dialogoAbierto = false;

    dialogoActual = null;

    indiceDialogo = 0;


    const caja =
        document.getElementById("dialogo");


    if (caja) {

        caja.style.display = "none";

    }

}


// ============================================================
// 8. MAPA
// ============================================================

let mapa = null;

let imagenesTilesets = {};

const rutaMapa =
    "/Maps/mapasJson/AncientGreek.tmj";


// ------------------------------------------------------------
// Cargar mapa
// ------------------------------------------------------------

function cargarMapa() {

    fetch(rutaMapa)

        .then(respuesta => {

            console.log(
                "Respuesta del mapa:",
                respuesta.status
            );


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudo cargar el mapa"
                );

            }


            return respuesta.json();

        })

        .then(datos => {

            mapa = datos;


            console.log(
                "MAPA CARGADO:",
                mapa
            );


            console.log(
                "Capas:",
                mapa.layers.length
            );


            console.log(
                "Tilesets:",
                mapa.tilesets.length
            );


            console.log(
                "Tamaño:",
                mapa.width,
                "x",
                mapa.height
            );


            cargarTilesets();

        })

        .catch(error => {

            console.error(
                "ERROR CARGANDO MAPA:",
                error
            );

        });

}


// ============================================================
// 9. TILESETS
// ============================================================

// ------------------------------------------------------------
// Cargar tilesets
// ------------------------------------------------------------

function cargarTilesets() {

    let cargados = 0;


    mapa.tilesets.forEach(
        function (tilesetReferencia, indice) {

            let ruta = null;


            // ------------------------------------------------
            // TILESET 1
            // TERRENO
            // ------------------------------------------------

            if (indice === 0) {

                ruta =
                    "/Maps/AncientGreek/terrain_32px.png";

            }


            // ------------------------------------------------
            // TILESET 2
            // EDIFICIOS
            // ------------------------------------------------

            else if (indice === 1) {

                ruta =
                    "/Maps/AncientGreek/buildings_32px.png";

            }


            // ------------------------------------------------
            // TILESET 3
            // BARCO
            // ------------------------------------------------

            else if (indice === 2) {

                ruta =
                    "/Maps/mapasJson/ship_big_128x256.png";

            }


            if (!ruta) {

                cargados++;

                return;

            }


            const imagen =
                new Image();


            imagen.onload =
                function () {

                    imagenesTilesets[indice] =
                        imagen;


                    console.log(
                        "Tileset cargado:",
                        indice,
                        ruta
                    );


                    cargados++;


                    if (
                        cargados ===
                        mapa.tilesets.length
                    ) {

                        console.log(
                            "TODOS LOS TILESETS CARGADOS"
                        );


                        iniciarJuego();

                    }

                };


            imagen.onerror =
                function () {

                    console.error(
                        "NO SE PUDO CARGAR TILESET:",
                        ruta
                    );


                    cargados++;


                    if (
                        cargados ===
                        mapa.tilesets.length
                    ) {

                        iniciarJuego();

                    }

                };


            imagen.src = ruta;

        }
    );

}


// ------------------------------------------------------------
// Encontrar el tileset correspondiente a un GID
// ------------------------------------------------------------

function obtenerTileset(gid) {

    let elegido = null;

    let indice = -1;


    for (
        let i = 0;
        i < mapa.tilesets.length;
        i++
    ) {

        const tileset =
            mapa.tilesets[i];


        if (
            gid >=
            tileset.firstgid
        ) {

            elegido =
                tileset;

            indice =
                i;

        }

        else {

            break;

        }

    }


    if (!elegido) {

        return null;

    }


    return {

        tileset: elegido,

        indice: indice

    };

}


// ============================================================
// 10. MOVIMIENTO
// ============================================================

function moverJugador() {

    let movimientoX = 0;

    let movimientoY = 0;


    // W
    if (teclas["w"]) {

        movimientoY -=
            jugador.velocidad;

    }


    // S
    if (teclas["s"]) {

        movimientoY +=
            jugador.velocidad;

    }


    // A
    if (teclas["a"]) {

        movimientoX -=
            jugador.velocidad;

    }


    // D
    if (teclas["d"]) {

        movimientoX +=
            jugador.velocidad;

    }


    // Flecha arriba
    if (teclas["arrowup"]) {

        movimientoY -=
            jugador.velocidad;

    }


    // Flecha abajo
    if (teclas["arrowdown"]) {

        movimientoY +=
            jugador.velocidad;

    }


    // Flecha izquierda
    if (teclas["arrowleft"]) {

        movimientoX -=
            jugador.velocidad;

    }


    // Flecha derecha
    if (teclas["arrowright"]) {

        movimientoX +=
            jugador.velocidad;

    }


    // Movimiento diagonal
    if (
        movimientoX !== 0 &&
        movimientoY !== 0
    ) {

        movimientoX *= 0.707;

        movimientoY *= 0.707;

    }


    jugador.x +=
        movimientoX;

    jugador.y +=
        movimientoY;


    limitarJugador();

}


// ------------------------------------------------------------
// Limitar jugador dentro del mapa
// ------------------------------------------------------------

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


// ============================================================
// 11. INTERACCIONES
// ============================================================

// ------------------------------------------------------------
// Comprobar NPC
// ------------------------------------------------------------

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


// ============================================================
// 12. DIBUJO
// ============================================================
//
// TODO LO RELACIONADO CON DIBUJAR ESTÁ ACÁ.
//
// ============================================================


// ------------------------------------------------------------
// Dibujar un TILE
// ------------------------------------------------------------

function dibujarTile(
    gid,
    x,
    y
) {

    if (!gid || gid === 0) {

        return;

    }


    // ========================================================
    // FLAGS DE TILED
    // ========================================================
    //
    // Tiled utiliza los bits más altos del GID para guardar
    // transformaciones:
    //
    // Horizontal
    // Vertical
    // Diagonal
    //
    // Los guardamos antes de obtener el GID real.
    // ========================================================

    const FLIPPED_HORIZONTALLY_FLAG =
        0x80000000;

    const FLIPPED_VERTICALLY_FLAG =
        0x40000000;

    const FLIPPED_DIAGONALLY_FLAG =
        0x20000000;


    const flipHorizontal =
        (gid &
            FLIPPED_HORIZONTALLY_FLAG) !== 0;


    const flipVertical =
        (gid &
            FLIPPED_VERTICALLY_FLAG) !== 0;


    const flipDiagonal =
        (gid &
            FLIPPED_DIAGONALLY_FLAG) !== 0;


    // ========================================================
    // GID REAL
    // ========================================================

    const gidReal =
        gid & 0x1FFFFFFF;


    if (!gidReal) {

        return;

    }


    // ========================================================
    // BUSCAR TILESET
    // ========================================================

    const resultado =
        obtenerTileset(gidReal);


    if (!resultado) {

        return;

    }


    const tileset =
        resultado.tileset;


    const indiceTileset =
        resultado.indice;


    const imagen =
        imagenesTilesets[indiceTileset];


    if (!imagen) {

        return;

    }


    // ========================================================
    // GID DENTRO DEL TILESET
    // ========================================================

    const gidLocal =
        gidReal -
        tileset.firstgid;


    // ========================================================
    // COLUMNAS
    // ========================================================

    let columnas =
        tileset.columns;


    if (!columnas) {

        columnas =
            Math.floor(
                imagen.width /
                tamañoTile
            );

    }


    if (columnas <= 0) {

        return;

    }


    // ========================================================
    // POSICIÓN EN EL PNG
    // ========================================================

    const columna =
        gidLocal %
        columnas;


    const fila =
        Math.floor(
            gidLocal /
            columnas
        );


    const sourceX =
        columna *
        tamañoTile;


    const sourceY =
        fila *
        tamañoTile;


    // ========================================================
    // COMPROBAR QUE EXISTE
    // ========================================================

    if (
        sourceX < 0 ||
        sourceY < 0 ||
        sourceX + tamañoTile >
            imagen.width ||
        sourceY + tamañoTile >
            imagen.height
    ) {

        return;

    }


    // ========================================================
    // GUARDAR ESTADO
    // ========================================================

    ctx.save();


    // ========================================================
    // CENTRO DEL TILE
    // ========================================================

    ctx.translate(

        x +
            tamañoTilePantalla / 2,

        y +
            tamañoTilePantalla / 2

    );


    // ========================================================
    // TRANSFORMACIÓN DE TILED
    // ========================================================
    //
    // El flip diagonal de Tiled se combina con los flips
    // horizontal/vertical.
    //
    // Esta combinación permite reproducir los caminos que
    // fueron colocados rotados o espejados en Tiled.
    // ========================================================

    if (flipDiagonal) {

        ctx.rotate(
            Math.PI / 2
        );

        ctx.scale(
            -1,
            1
        );

    }


    if (flipHorizontal) {

        ctx.scale(
            -1,
            1
        );

    }


    if (flipVertical) {

        ctx.scale(
            1,
            -1
        );

    }


    // ========================================================
    // DIBUJAR
    // ========================================================

    ctx.drawImage(

        imagen,

        sourceX,
        sourceY,

        tamañoTile,
        tamañoTile,

        -tamañoTilePantalla / 2,
        -tamañoTilePantalla / 2,

        tamañoTilePantalla,
        tamañoTilePantalla

    );


    // ========================================================
    // RESTAURAR
    // ========================================================

    ctx.restore();

}


// ------------------------------------------------------------
// Dibujar una capa
// ------------------------------------------------------------

function dibujarCapa(capa) {

    if (
        capa.type !==
        "tilelayer"
    ) {

        return;

    }


    if (!capa.data) {

        return;

    }


    const ancho =
        capa.width;


    // ========================================================
    // RECORRER TODOS LOS TILES
    // ========================================================

    for (
        let i = 0;
        i < capa.data.length;
        i++
    ) {

        const gid =
            capa.data[i];


        if (!gid || gid === 0) {

            continue;

        }


        // Posición del tile
        const tileX =
            i % ancho;


        const tileY =
            Math.floor(
                i / ancho
            );


        // Posición en pantalla
        const pantallaX =
            tileX *
            tamañoTilePantalla -
            camara.x;


        const pantallaY =
            tileY *
            tamañoTilePantalla -
            camara.y;


        // ====================================================
        // OPTIMIZACIÓN
        // ====================================================

        if (
            pantallaX +
                tamañoTilePantalla <
                0 ||
            pantallaY +
                tamañoTilePantalla <
                0 ||
            pantallaX >
                canvas.width ||
            pantallaY >
                canvas.height
        ) {

            continue;

        }


        dibujarTile(

            gid,

            pantallaX,

            pantallaY

        );

    }

}


// ------------------------------------------------------------
// Dibujar mapa completo
// ------------------------------------------------------------

function dibujarMapa() {

    if (!mapa) {

        return;

    }


    // ========================================================
    // TODAS LAS CAPAS DE TILED
    // ========================================================

    mapa.layers.forEach(
        function (capa) {

            if (
                capa.type ===
                "tilelayer"
            ) {

                dibujarCapa(capa);

            }

        }
    );

}


// ------------------------------------------------------------
// Dibujar jugador
// ------------------------------------------------------------

function dibujarJugador() {

    const pantallaX =
        jugador.x *
        escala -
        camara.x;


    const pantallaY =
        jugador.y *
        escala -
        camara.y;


    // TEMPORAL
    // Más adelante ponemos el sprite real.

    ctx.fillStyle =
        "blue";


    ctx.fillRect(

        pantallaX,
        pantallaY,

        jugador.ancho,
        jugador.alto

    );

}


// ------------------------------------------------------------
// Dibujar NPC
// ------------------------------------------------------------

function dibujarNPC() {

    const pantallaX =
        npc.x *
        escala -
        camara.x;


    const pantallaY =
        npc.y *
        escala -
        camara.y;


    // TEMPORAL
    // Más adelante ponemos el sprite real.

    ctx.fillStyle =
        "red";


    ctx.fillRect(

        pantallaX,
        pantallaY,

        npc.ancho,
        npc.alto

    );

}


// ============================================================
// 13. LOOP PRINCIPAL
// ============================================================

function loop() {

    // ========================================================
    // LIMPIAR PANTALLA
    // ========================================================

    ctx.clearRect(

        0,
        0,

        canvas.width,
        canvas.height

    );


    // ========================================================
    // FONDO
    // ========================================================

    ctx.fillStyle =
        "#222";


    ctx.fillRect(

        0,
        0,

        canvas.width,
        canvas.height

    );


    // ========================================================
    // MOVIMIENTO
    // ========================================================

    if (!dialogoAbierto) {

        moverJugador();

        comprobarNPC();

    }


    // ========================================================
    // CÁMARA
    // ========================================================

    actualizarCamara();


    // ========================================================
    // MAPA
    // ========================================================

    dibujarMapa();


    // ========================================================
    // NPC
    // ========================================================

    dibujarNPC();


    // ========================================================
    // JUGADOR
    // ========================================================

    dibujarJugador();


    // ========================================================
    // SIGUIENTE FRAME
    // ========================================================

    requestAnimationFrame(
        loop
    );

}


// ============================================================
// ACTUALIZAR CÁMARA
// ============================================================

function actualizarCamara() {

    if (!mapa) {

        return;

    }


    // ========================================================
    // CENTRAR EN EL JUGADOR
    // ========================================================

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


    // ========================================================
    // TAMAÑO TOTAL DEL MAPA
    // ========================================================

    const anchoMapa =
        mapa.width *
        tamañoTilePantalla;


    const altoMapa =
        mapa.height *
        tamañoTilePantalla;


    // ========================================================
    // LÍMITES HORIZONTALES
    // ========================================================

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
            (anchoMapa -
            canvas.width) / 2;

    }


    // ========================================================
    // LÍMITES VERTICALES
    // ========================================================

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
            (altoMapa -
            canvas.height) / 2;

    }

}


// ============================================================
// 14. RESIZE
// ============================================================

window.addEventListener(
    "resize",
    function () {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;

    }
);


// ============================================================
// INICIAR JUEGO
// ============================================================

function iniciarJuego() {

    console.log(
        "INICIANDO JUEGO"
    );


    requestAnimationFrame(
        loop
    );

}


// ============================================================
// INICIO
// ============================================================

cargarMapa();