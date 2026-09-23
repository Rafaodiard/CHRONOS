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

    const capaMaquinas = mapa.layers.find(
        capa => capa.name === "Maquinas"
    );

    const objetosInteractuables = capaInteractuables?.objects || [];
    const objetosMaquinas = (capaMaquinas?.objects || []).filter(objeto => {
        const id = String(obtenerPropiedadInteractuable(objeto, "Id") || "").toUpperCase();
        return ["A", "B", "C", "D", "E"].includes(id);
    });

    interactuablesMapa = [...objetosInteractuables, ...objetosMaquinas];

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
                (interactuable.x || 0)
            );

        const distanciaY =
            Math.abs(
                jugador.y -
                (interactuable.y || 0)
            );

        if (
            distanciaX < 55 &&
            distanciaY < 55
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
        interactuable?.properties?.find(
            propiedad =>
                typeof propiedad?.name === "string" &&
                propiedad.name.toLowerCase() === String(nombre).toLowerCase()
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
    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }
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
        obtenerInteractuableCercano() ||
        (typeof obtenerReguladorMaquinaCercano === "function" ? obtenerReguladorMaquinaCercano() : null);

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

    const idMaquina = String(
        obtenerPropiedadInteractuable(interactuable, "Id") || ""
    ).toUpperCase();

    if (["A", "B", "C", "D", "E"].includes(idMaquina)) {
        reproducirEfecto("interactuar");
        const estado = obtenerEstadoMaquina(idMaquina);
        if (estado && estado.apagada) {
            abrirDialogoMensaje("La máquina ya está apagada.");
            return;
        }

        abrirPanelMaquina(idMaquina);
        return;
    }

    const tipo =
        obtenerPropiedadInteractuable(
            interactuable,
            "Tipo"
        ) ||
        obtenerPropiedadInteractuable(
            interactuable,
            "tipo"
        );

    const nombreObjeto =
        (interactuable?.name || "")
            .toLowerCase();

    if (
        tipo && tipo.toLowerCase() === "engranajes"
        || nombreObjeto === "reguladormaquina"
    ) {
        abrirPuzzleEngranajes(interactuable);
        return;
    }

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

    if (objeto && (tieneObjeto(objeto) || progreso?.objetosRecogidos?.[objeto])) {
        marcarInteractuableUsado(interactuable);
        return;
    }

    reproducirEfecto("interactuar");

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