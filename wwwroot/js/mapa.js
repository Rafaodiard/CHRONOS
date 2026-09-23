let mapa = null;

let imagenesTilesets = {};

let rutaMapa =
    "/Maps/mapasJson/AncientGreek.tmj";

function normalizarRutaMapa(ruta) {

    if (!ruta) {
        return ruta;
    }

    const segmentos = ruta
        .replace(/\\/g, "/")
        .trim()
        .split("/");

    const rutaNormalizada = [];

    for (const segmento of segmentos) {
        if (!segmento || segmento === ".") {
            continue;
        }

        if (segmento === "..") {
            rutaNormalizada.pop();
            continue;
        }

        rutaNormalizada.push(segmento);
    }

    return "/" + rutaNormalizada.join("/");
}

async function cargarMapa(nuevaRuta = rutaMapa) {
    rutaMapa = normalizarRutaMapa(nuevaRuta);
    actualizarMusicaMapa(rutaMapa);

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
        cargarMaquinasMapa();
        cargarPalancasMapa();
        cargarAcertijosMapa();
        cargarReguladorMaquina();
        cargarPanelDescargaMapa();
        cargarTilesets();
    }
    catch (error) {
        console.error("ERROR AL CARGAR MAPA:", error);
    }
}

async function cargarTilesets() {
    if (!mapa.tilesets || mapa.tilesets.length === 0) {
        iniciarJuego();
        return;
    }

    const tilesetsCargados = mapa.tilesets.map(
        async (tilesetReferencia, indice) => {
            try {
                const rutaImagen = await obtenerRutaImagenTileset(
                    tilesetReferencia
                );

                console.log("Cargando imagen:", rutaImagen);

                const imagen = await cargarImagen(rutaImagen);

                imagenesTilesets[indice] = imagen;
                console.log("Tileset cargado:", indice, rutaImagen);
            }
            catch (error) {
                console.error("ERROR AL CARGAR TILESET:", error);
            }
        }
    );

    await Promise.all(tilesetsCargados);

    console.log("TODOS LOS TILESETS CARGADOS");
    iniciarJuego();
}

async function obtenerRutaImagenTileset(tilesetReferencia) {
    const rutaBaseMapa = rutaMapa.substring(
        0,
        rutaMapa.lastIndexOf("/")
    );

    if (tilesetReferencia.image) {
        return normalizarRutaMapa(
            `${rutaBaseMapa}/${tilesetReferencia.image}`
        );
    }

    if (!tilesetReferencia.source) {
        throw new Error("El tileset no tiene source ni image");
    }

    const rutaTSX = normalizarRutaMapa(
        `${rutaBaseMapa}/${tilesetReferencia.source}`
    );

    console.log("Cargando TSX:", rutaTSX);

    const respuestaTSX = await fetch(rutaTSX);

    if (!respuestaTSX.ok) {
        throw new Error("No se pudo cargar el TSX: " + rutaTSX);
    }

    const xml = new DOMParser().parseFromString(
        await respuestaTSX.text(),
        "application/xml"
    );

    const imagenTSX = xml.querySelector("image");
    const rutaImagen = imagenTSX?.getAttribute("source");

    if (!rutaImagen) {
        throw new Error("El TSX no contiene una imagen");
    }

    const rutaBaseTSX = rutaTSX.substring(
        0,
        rutaTSX.lastIndexOf("/")
    );

    return normalizarRutaMapa(
        `${rutaBaseTSX}/${rutaImagen}`
    );
}

function cargarImagen(rutaImagen) {
    return new Promise((resolve, reject) => {
        const imagen = new Image();

        imagen.onload = () => resolve(imagen);
        imagen.onerror = () => reject(
            new Error("No se pudo cargar la imagen: " + rutaImagen)
        );
        imagen.src = rutaImagen;
    });
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


    // Sin suavizado para que no se mezclen los bordes de los tiles
    ctx.imageSmoothingEnabled = false;


    mapa.layers.forEach(
        function (capa) {

            if (

                capa.type ===
                "tilelayer" &&

                (
                    capa.name !== "PuertaOculta" ||
                    progreso.palancasResueltas
                ) &&

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
    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }

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