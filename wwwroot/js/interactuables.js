let interactuablesMapa = [];

let mostrarIndicadorInteractuable = false;


// =========================================================
// CARGAR INTERACTUABLES
// =========================================================

function cargarInteractuablesMapa() {

    interactuablesMapa = [];

    if (!mapa || !mapa.layers) {
        return;
    }

    const capaInteractuables = mapa.layers.find(
        capa => capa.name === "Interactuables"
    );

    if (
        !capaInteractuables ||
        !capaInteractuables.objects
    ) {
        return;
    }

    interactuablesMapa =
        capaInteractuables.objects;

    console.log(
        "INTERACTUABLES CARGADOS:",
        interactuablesMapa
    );
}


// =========================================================
// OBTENER INTERACTUABLE CERCANO
// =========================================================

function obtenerInteractuableCercano() {

    for (const interactuable of interactuablesMapa) {

        const distanciaX =
            Math.abs(
                jugador.x -
                interactuable.x
            );

        const distanciaY =
            Math.abs(
                jugador.y -
                interactuable.y
            );

        if (
            distanciaX < 40 &&
            distanciaY < 40
        ) {
            return interactuable;
        }
    }

    return null;
}


// =========================================================
// OBTENER PROPIEDAD
// =========================================================

function obtenerPropiedadInteractuable(
    interactuable,
    nombre
) {

    const propiedad =
        interactuable.properties?.find(
            propiedad =>
                propiedad.name === nombre
        );

    return propiedad
        ? typeof propiedad.value === "string"
            ? propiedad.value.trim()
            : propiedad.value
        : null;
}

function marcarInteractuableUsado(interactuable) {
    interactuablesMapa = interactuablesMapa.filter(
        elemento => elemento !== interactuable
    );
}


// =========================================================
// COMPROBAR INTERACCIÓN
// =========================================================

function comprobarInteractuables() {

    if (dialogoAbierto) {

        mostrarIndicadorInteractuable = false;

        return;
    }

    const interactuable =
        obtenerInteractuableCercano();

    mostrarIndicadorInteractuable =
        interactuable !== null;

    if (
        interactuable &&
        teclas["e"]
    ) {

        teclas["e"] = false;

        interactuarConObjeto(
            interactuable
        );
    }
}


// =========================================================
// INTERACTUAR
// =========================================================

function interactuarConObjeto(
    interactuable
) {

    const dialogo =
        obtenerPropiedadInteractuable(
            interactuable,
            "Dialogo"
        );

    const mensaje =
        obtenerPropiedadInteractuable(
            interactuable,
            "Mensaje"
        );

    const objeto =
        obtenerPropiedadInteractuable(
            interactuable,
            "Objeto"
        );

    if (dialogo) {
        abrirDialogo(dialogo);
        return;
    }

    if (objeto === "Documento1") {
        abrirBiblioteca();
        return;
    }


    // =====================================================
    // SI TIENE MENSAJE
    // =====================================================

    if (mensaje) {

        dialogos.Interactuable =
        [
            {
                tipo: "dialogo",
                personaje: "",
                texto: mensaje
            }
        ];

        npcDialogoActual = {

            alTerminar: function () {

                if (objeto) {

                    agregarObjeto(objeto);
                    marcarInteractuableUsado(interactuable);

                    console.log(
                        "OBJETO OBTENIDO:",
                        objeto
                    );
                }
            }
        };

        abrirDialogo(
            "Interactuable"
        );

        return;
    }


    // =====================================================
    // SI SOLO DA UN OBJETO
    // =====================================================

    if (objeto) {

        agregarObjeto(objeto);
        marcarInteractuableUsado(interactuable);

        console.log(
            "OBJETO OBTENIDO:",
            objeto
        );
    }
}