let mapa = null;

let imagenesTilesets = {};

let rutaMapa =
    "/Maps/mapasJson/AncientGreek.tmj";

function normalizarRutaMapa(ruta) {

    if (!ruta) {
        return ruta;
    }

    let rutaNormalizada = ruta.replace(/\\/g, "/").trim();

    while (rutaNormalizada.startsWith("./")) {
        rutaNormalizada = rutaNormalizada.substring(2);
    }

    if (!rutaNormalizada.startsWith("/")) {
        rutaNormalizada = "/" + rutaNormalizada;
    }

    return rutaNormalizada;
}


async function cargarMapa(nuevaRuta = rutaMapa) {
    rutaMapa = normalizarRutaMapa(nuevaRuta);

    try {
        const respuesta = await fetch(rutaMapa);

        console.log("Respuesta del mapa:", respuesta.status);

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el mapa");
        }

        mapa = await respuesta.json();

        console.log("MAPA CARGADO:", mapa);
        console.log("Capas:", mapa.layers);
        console.log("Tilesets:", mapa.tilesets);
        console.log("Tamaño:", mapa.width, "x", mapa.height);
        console.log("BUSCANDO TRANSICIONES...");
        cargarColisiones();
        cargarTransiciones();
        cargarNPCs();
        cargarObjetosMapa();
        cargarInteractuablesMapa();
        cargarAcertijosMapa();
        cargarTilesets();

    } catch (error) {
        console.error("ERROR AL CARGAR MAPA:", error);
    }
}


async function cargarTilesets() {

    let cargados = 0;

    if (!mapa.tilesets || mapa.tilesets.length === 0) {
        iniciarJuego();
        return;
    }

    for (let i = 0; i < mapa.tilesets.length; i++) {

        const tilesetReferencia = mapa.tilesets[i];

        try {

            // Ruta del archivo .tsx indicada por el mapa
            let rutaTSX = tilesetReferencia.source;

            // Obtenemos la carpeta donde está el .tmj
            let partesRutaMapa = rutaMapa.split("/");
            partesRutaMapa.pop();

            let rutaBase = partesRutaMapa.join("/");

            // Unimos la carpeta del mapa con la ruta del TSX
            let rutaCompletaTSX =
                rutaBase + "/" + rutaTSX;

            // Normalizamos ../ y ./ 
            let segmentosTSX = rutaCompletaTSX.split("/");
            let resultadoTSX = [];

            for (let segmento of segmentosTSX) {

                if (segmento === "..") {
                    resultadoTSX.pop();
                }
                else if (segmento !== "." && segmento !== "") {
                    resultadoTSX.push(segmento);
                }
            }

            rutaCompletaTSX =
                "/" + resultadoTSX.join("/");

            console.log(
                "Cargando TSX:",
                rutaCompletaTSX
            );


            // ==========================================
            // CARGAR EL ARCHIVO TSX
            // ==========================================

            const respuestaTSX =
                await fetch(rutaCompletaTSX);

            if (!respuestaTSX.ok) {
                throw new Error(
                    "No se pudo cargar el TSX: " +
                    rutaCompletaTSX
                );
            }

            const textoTSX =
                await respuestaTSX.text();


            // ==========================================
            // LEER EL XML DEL TSX
            // ==========================================

            const parser =
                new DOMParser();

            const xml =
                parser.parseFromString(
                    textoTSX,
                    "application/xml"
                );

            const imagenTSX =
                xml.querySelector("image");

            if (!imagenTSX) {
                throw new Error(
                    "El TSX no contiene una imagen"
                );
            }

            const rutaImagen =
                imagenTSX.getAttribute("source");


            // ==========================================
            // CONSTRUIR RUTA DE LA IMAGEN
            // ==========================================

            let partesRutaTSX =
                rutaCompletaTSX.split("/");

            partesRutaTSX.pop();

            let rutaImagenCompleta =
                partesRutaTSX.join("/") +
                "/" +
                rutaImagen;


            // Normalizamos ../ y ./
            let segmentosImagen =
                rutaImagenCompleta.split("/");

            let resultadoImagen = [];

            for (let segmento of segmentosImagen) {

                if (segmento === "..") {
                    resultadoImagen.pop();
                }
                else if (
                    segmento !== "." &&
                    segmento !== ""
                ) {
                    resultadoImagen.push(segmento);
                }
            }

            rutaImagenCompleta =
                "/" + resultadoImagen.join("/");


            console.log(
                "Cargando imagen:",
                rutaImagenCompleta
            );


            // ==========================================
            // CARGAR IMAGEN DEL TILESET
            // ==========================================

            const imagen =
                new Image();

            imagen.onload = function () {

                imagenesTilesets[i] =
                    imagen;

                console.log(
                    "Tileset cargado:",
                    i,
                    rutaImagenCompleta
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


            imagen.onerror = function () {

                console.error(
                    "NO SE PUDO CARGAR LA IMAGEN:",
                    rutaImagenCompleta
                );

                cargados++;

                if (
                    cargados ===
                    mapa.tilesets.length
                ) {
                    iniciarJuego();
                }
            };


            imagen.src =
                rutaImagenCompleta;

        }
        catch (error) {

            console.error(
                "ERROR AL CARGAR TILESET:",
                error
            );

            cargados++;

            if (
                cargados ===
                mapa.tilesets.length
            ) {
                iniciarJuego();
            }
        }
    }
}

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

        tileset:
            elegido,

        indice:
            indice

    };

}


function dibujarTile(
    gid,
    x,
    y
) {

    if (
        !gid ||
        gid === 0
    ) {

        return;

    }


    const FLIPPED_HORIZONTALLY_FLAG =
        0x80000000;

    const FLIPPED_VERTICALLY_FLAG =
        0x40000000;

    const FLIPPED_DIAGONALLY_FLAG =
        0x20000000;


    const flipHorizontal =
        (
            gid &
            FLIPPED_HORIZONTALLY_FLAG
        ) !== 0;


    const flipVertical =
        (
            gid &
            FLIPPED_VERTICALLY_FLAG
        ) !== 0;


    const flipDiagonal =
        (
            gid &
            FLIPPED_DIAGONALLY_FLAG
        ) !== 0;


    const gidReal =
        gid & 0x1FFFFFFF;


    if (!gidReal) {

        return;

    }


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


    const gidLocal =
        gidReal -
        tileset.firstgid;


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


    ctx.save();


    ctx.translate(

        x +
        tamañoTilePantalla / 2,

        y +
        tamañoTilePantalla / 2

    );


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


    ctx.restore();

}


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


    for (
        let i = 0;
        i < capa.data.length;
        i++
    ) {

        const gid =
            capa.data[i];


        if (
            !gid ||
            gid === 0
        ) {

            continue;

        }


        const tileX =
            i % ancho;


        const tileY =
            Math.floor(
                i / ancho
            );


        const pantallaX =
            tileX *
            tamañoTilePantalla -
            camara.x;


        const pantallaY =
            tileY *
            tamañoTilePantalla -
            camara.y;


        if (

            pantallaX +
            tamañoTilePantalla < 0 ||

            pantallaY +
            tamañoTilePantalla < 0 ||

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


function dibujarMapa() {

    if (!mapa) {

        return;

    }


    mapa.layers.forEach(
        function (capa) {

            if (

                capa.type ===
                "tilelayer" &&

                capa.name !==
                "EdificiosDelante" &&

                capa.name !==
                "ArbolesDelante"

            ) {

                dibujarCapa(
                    capa
                );

            }

        }
    );

}
function cambiarMapa(nuevaRuta, nuevaX, nuevaY) {
    rutaMapa = normalizarRutaMapa(nuevaRuta);

    jugador.x = nuevaX;
    jugador.y = nuevaY;

    mapa = null;
    colisiones = [];
    imagenesTilesets = {};

    cargarMapa(rutaMapa);
}
function dibujarEstructurasDelante() {

    if (!mapa || !mapa.layers) {
        return;
    }

    for (const capa of mapa.layers) {

        if (capa.type !== "tilelayer") {
            continue;
        }

        if (
            capa.name === "EdificiosDelante" ||
            capa.name === "ArbolesDelante" ||
            capa.name === "estructurasDelante"
        ) {
            dibujarCapa(capa);
        }
    }
}