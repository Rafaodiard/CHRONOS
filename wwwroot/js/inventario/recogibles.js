let objetosMapa = [];

let imagenesObjetos = [];

let mostrarIndicadorObjeto = false;


function cargarObjetosMapa() {

    objetosMapa = [];
    imagenesObjetos = [];

    if (!mapa || !mapa.layers) {
        return;
    }

    const capaObjetos = mapa.layers.find(
        capa => capa.name === "Objetos"
    );

    if (!capaObjetos || !capaObjetos.objects) {
        return;
    }

    const objetosRecogidos = progreso?.objetosRecogidos || {};
    objetosMapa = capaObjetos.objects.filter(function (objeto) {
        const idObjeto = obtenerIdObjeto(objeto);
        return !idObjeto || !objetosRecogidos[idObjeto];
    });

    imagenesObjetos = objetosMapa.map(function (objeto) {

        const propiedadImagen =
            objeto.properties?.find(
                propiedad => propiedad.name === "Imagen"
            );

        const imagen = new Image();

        if (propiedadImagen) {
            imagen.src = propiedadImagen.value;
        }

        return imagen;
    });

    console.log(
        "OBJETOS DEL MAPA:",
        objetosMapa
    );
}


function obtenerObjetoCercano() {

    for (const objeto of objetosMapa) {

        const distanciaX =
            Math.abs(jugador.x - objeto.x);

        const distanciaY =
            Math.abs(jugador.y - objeto.y);

        if (
            distanciaX < 40 &&
            distanciaY < 40
        ) {
            return objeto;
        }
    }

    return null;
}


function obtenerIdObjeto(objeto) {

    const propiedad =
        objeto.properties?.find(
            propiedad => propiedad.name === "id"
        );

    return propiedad
        ? propiedad.value
        : null;
}


function recogerObjeto(objeto) {

    const indice =
        objetosMapa.indexOf(objeto);

    if (indice === -1) {
        return;
    }

    const idObjeto =
        obtenerIdObjeto(objeto);

    if (!idObjeto) {

        console.error(
            "El objeto no tiene una propiedad Id:",
            objeto
        );

        return;
    }

    agregarObjeto(idObjeto);

    if (progreso && typeof progreso === "object") {
        progreso.objetosRecogidos ??= {};
        progreso.objetosRecogidos[idObjeto] = true;
    }

    objetosMapa.splice(indice, 1);
    imagenesObjetos.splice(indice, 1);
    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }

    console.log(
        "OBJETO RECOGIDO:",
        idObjeto
    );
}


function comprobarObjetos() {

    if (dialogoAbierto) {

        mostrarIndicadorObjeto = false;

        return;
    }

    const objetoCercano =
        obtenerObjetoCercano();

    mostrarIndicadorObjeto =
        objetoCercano !== null;

    if (
        objetoCercano &&
        teclas["e"]
    ) {

        teclas["e"] = false;

        recogerObjeto(objetoCercano);
    }
}


function dibujarObjetosMapa() {

    objetosMapa.forEach(
        function (objeto, indice) {

            const imagen =
                imagenesObjetos[indice];

            if (
                !imagen ||
                !imagen.complete ||
                imagen.naturalWidth === 0
            ) {
                return;
            }

            const pantallaX =
                objeto.x * escala -
                camara.x;

            const pantallaY =
                objeto.y * escala -
                camara.y;

            ctx.drawImage(
                imagen,

                pantallaX,
                pantallaY,

                objeto.width * escala,
                objeto.height * escala
            );
        }
    );
}