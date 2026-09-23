let acertijosMapa = [];
let acertijoAbierto = false;
let acertijoActual = null;
let mostrarIndicadorAcertijo = false;

function obtenerPropiedadAcertijo(objeto, nombre) {
    const propiedad = objeto.properties?.find(
        propiedad => propiedad.name.toLowerCase() === nombre.toLowerCase()
    );

    return propiedad ? propiedad.value : null;
}

function cargarAcertijosMapa() {
    acertijosMapa = [];

    if (!mapa || !mapa.layers) {
        return;
    }

    mapa.layers.forEach(capa => {
        if (!capa.objects) {
            return;
        }

        capa.objects.forEach(objeto => {
            const tipo = obtenerPropiedadAcertijo(objeto, "Tipo");

            if (
                capa.name.toLowerCase() === "acertijo" ||
                tipo?.toLowerCase() === "acertijo"
            ) {
                acertijosMapa.push(objeto);
            }
        });
    });

    console.log("ACERTIJOS CARGADOS:", acertijosMapa);
}

function obtenerAcertijoCercano() {
    for (const acertijo of acertijosMapa) {
        const distanciaX = Math.abs(jugador.x - acertijo.x);
        const distanciaY = Math.abs(jugador.y - acertijo.y);

        if (distanciaX < 40 && distanciaY < 40) {
            return acertijo;
        }
    }

    return null;
}

function comprobarAcertijos() {
    if (acertijoAbierto || dialogoAbierto) {
        mostrarIndicadorAcertijo = false;
        return;
    }

    const acertijo = obtenerAcertijoCercano();

    mostrarIndicadorAcertijo = acertijo !== null;

    if (acertijo && teclas["e"]) {
        teclas["e"] = false;
        abrirAcertijo(acertijo);
    }
}

function abrirAcertijo(objeto) {
    reproducirEfecto("interactuar");
    acertijoActual = objeto;
    acertijoAbierto = true;

    const titulo =
        obtenerPropiedadAcertijo(objeto, "Titulo") || "ACERTIJO";
    const codigo = String(
        obtenerPropiedadAcertijo(objeto, "Codigo") || ""
    );
    const cantidad = Number(
        obtenerPropiedadAcertijo(objeto, "Cantidad")
    ) || codigo.length;
    const etiquetasTexto =
        obtenerPropiedadAcertijo(objeto, "Etiquetas") ||
        obtenerPropiedadAcertijo(objeto, "etiqutas") ||
        "";
    const etiquetas = etiquetasTexto
        .split(",")
        .map(etiqueta => etiqueta.trim());

    const tituloElemento = document.getElementById("tituloAcertijo");
    const contenedor = document.getElementById("camposAcertijo");
    const menu = document.getElementById("menuAcertijo");
    const mensaje = document.getElementById("mensajeAcertijo");

    if (!tituloElemento || !contenedor || !menu) {
        console.error("Falta la interfaz del acertijo.");
        cerrarAcertijo();
        return;
    }

    tituloElemento.textContent = titulo;
    contenedor.innerHTML = "";

    if (mensaje) {
        mensaje.textContent = "";
    }

    for (let indice = 0; indice < cantidad; indice++) {
        const grupo = document.createElement("div");
        grupo.className = "grupo-acertijo";

        const etiqueta = document.createElement("div");
        etiqueta.className = "etiqueta-acertijo";
        etiqueta.textContent = etiquetas[indice] || `Número ${indice + 1}`;

        const input = document.createElement("input");
        input.type = "text";
        input.inputMode = "numeric";
        input.maxLength = 1;
        input.className = "campo-acertijo";
        input.addEventListener("input", () => {
            input.value = input.value.replace(/[^0-9]/g, "");
            if (input.value && input.nextElementSibling?.querySelector("input")) {
                input.nextElementSibling.querySelector("input").focus();
            }
        });

        grupo.appendChild(etiqueta);
        grupo.appendChild(input);
        contenedor.appendChild(grupo);
    }

    menu.style.display = "flex";
    contenedor.querySelector("input")?.focus();
}

function cerrarAcertijo() {
    acertijoAbierto = false;
    acertijoActual = null;

    const menu = document.getElementById("menuAcertijo");
    if (menu) {
        menu.style.display = "none";
    }
}

function obtenerRespuestaAcertijo() {
    return Array.from(document.querySelectorAll(".campo-acertijo"))
        .map(campo => campo.value)
        .join("");
}

function comprobarAcertijo() {
    if (!acertijoActual) {
        return;
    }

    const respuesta = obtenerRespuestaAcertijo();
    const codigoCorrecto = String(
        obtenerPropiedadAcertijo(acertijoActual, "Codigo") || ""
    );

    if (respuesta !== codigoCorrecto) {
        reproducirEfecto("puzzleError");
        const mensaje = document.getElementById("mensajeAcertijo");

        if (mensaje) {
            mensaje.textContent = "Respuesta incorrecta.";
        }

        return;
    }

    reproducirEfecto("puzzleCompletado");
    const acertijoResuelto = acertijoActual;
    const accion = obtenerPropiedadAcertijo(acertijoResuelto, "Accion");

    cerrarAcertijo();
    acertijosMapa = acertijosMapa.filter(
        acertijo => acertijo !== acertijoResuelto
    );
    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }

    if (accion && typeof window[accion] === "function") {
        window[accion]();
    } else if (accion) {
        console.error("No existe la acción:", accion);
    }
}

function resolverAcertijoTemplo() {
    progreso.puedeEntrarTemplo = true;
    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }
    abrirDialogoMensaje("El mecanismo del templo se ha activado.");
}

document.addEventListener("keydown", function (evento) {
    if (!acertijoAbierto) {
        return;
    }

    if (evento.key === "Enter") {
        evento.preventDefault();
        comprobarAcertijo();
    }
});
