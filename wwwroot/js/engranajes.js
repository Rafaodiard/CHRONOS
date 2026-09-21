let reguladorMaquinaObjeto = null;
let engranajesAbierto = false;
let engranajesEstadoActual = null;

const engranajesOrden = ["A", "B", "C", "D"];
const movimientosEngranajes = {
    A: {
        adelante: { A: 1, B: 2 },
        atras: { A: -1, B: -2 }
    },
    B: {
        adelante: { B: 1, C: 2 },
        atras: { B: -1, C: -2 }
    },
    C: {
        adelante: { C: 1, D: 1 },
        atras: { C: -1, D: -1 }
    },
    D: {
        adelante: { D: 1, A: 1 },
        atras: { D: -1, A: -1 }
    }
};

function obtenerPropiedadObjeto(objeto, nombre) {
    if (!objeto || !Array.isArray(objeto.properties)) {
        return null;
    }

    const nombreBuscado = String(nombre).toLowerCase();
    const propiedad = objeto.properties.find(propiedad =>
        typeof propiedad?.name === "string" && propiedad.name.toLowerCase() === nombreBuscado
    );

    if (!propiedad) {
        return null;
    }

    return typeof propiedad.value === "string"
        ? propiedad.value.trim()
        : propiedad.value;
}

function normalizarPosicionEngranaje(valor) {
    const numero = Number.isFinite(Number(valor)) ? Number(valor) : 0;
    return ((numero % 4) + 4) % 4;
}

function crearEstadoEngranajesVacio() {
    return { A: 0, B: 0, C: 0, D: 0 };
}

function estadosSonIguales(estadoA, estadoB) {
    return ["A", "B", "C", "D"].every(engranaje =>
        normalizarPosicionEngranaje(estadoA[engranaje]) === normalizarPosicionEngranaje(estadoB[engranaje])
    );
}

function aplicarMovimientoEngranaje(estadoBase, engranaje, sentido) {
    const estado = { ...estadoBase };
    const movimiento = movimientosEngranajes[engranaje]?.[sentido === 1 ? "adelante" : "atras"];

    if (!movimiento) {
        return estado;
    }

    Object.entries(movimiento).forEach(([clave, delta]) => {
        estado[clave] = normalizarPosicionEngranaje(estado[clave] + Number(delta));
    });

    return estado;
}

function resolverObjetivoEngranajes() {
    const objetivo = obtenerPropiedadObjeto(reguladorMaquinaObjeto, "objetivo")
        || obtenerPropiedadObjeto(reguladorMaquinaObjeto, "Objetivo")
        || "0,0,0,0";

    const valores = String(objetivo)
        .split(",")
        .map(valor => Number.parseInt(valor, 10));

    if (valores.length !== 4 || valores.some(numero => !Number.isFinite(numero))) {
        return crearEstadoEngranajesVacio();
    }

    return {
        A: normalizarPosicionEngranaje(valores[0]),
        B: normalizarPosicionEngranaje(valores[1]),
        C: normalizarPosicionEngranaje(valores[2]),
        D: normalizarPosicionEngranaje(valores[3])
    };
}

function generarEstadoInicialEngranajes() {
    let mejorEstado = { A: 1, B: 2, C: 1, D: 3 };
    let mejorPuntaje = -Infinity;

    for (let intento = 0; intento < 400; intento += 1) {
        let estado = crearEstadoEngranajesVacio();
        const pasos = 10 + Math.floor(Math.random() * 12);
        const engranajesUsados = new Set();

        for (let paso = 0; paso < pasos; paso += 1) {
            const engranaje = engranajesOrden[Math.floor(Math.random() * engranajesOrden.length)];
            const sentido = Math.random() < 0.5 ? 1 : -1;
            engranajesUsados.add(engranaje);
            estado = aplicarMovimientoEngranaje(estado, engranaje, sentido);
        }

        if (estadosSonIguales(estado, crearEstadoEngranajesVacio())) {
            continue;
        }

        const valores = Object.values(estado);
        const engranajesNoCero = valores.filter(valor => valor !== 0).length;
        const puntuacion = (engranajesNoCero * 3) + (pasos - 8) + valores.filter(valor => valor > 1).length * 2;

        if (engranajesNoCero >= 2 && engranajesUsados.size >= 2 && puntuacion > mejorPuntaje) {
            mejorEstado = estado;
            mejorPuntaje = puntuacion;
        }
    }

    if (mejorPuntaje < 0) {
        return { A: 1, B: 2, C: 1, D: 3 };
    }

    return mejorEstado;
}

function cargarReguladorMaquina() {
    reguladorMaquinaObjeto = null;

    if (!mapa?.layers) {
        return null;
    }

    const capaReguladores = mapa.layers.find(capa =>
        capa.name && capa.name.toLowerCase() === "reguladores"
    );

    if (!capaReguladores?.objects) {
        return null;
    }

    reguladorMaquinaObjeto = capaReguladores.objects.find(objeto => {
        const nombre = (objeto?.name || "").toLowerCase();
        const tipo = obtenerPropiedadObjeto(objeto, "tipo") || obtenerPropiedadObjeto(objeto, "Tipo");
        return nombre === "reguladormaquina"
            || nombre === "engranajes"
            || nombre === "reguladormaquina"
            || tipo === "engranajes"
            || tipo === "regulador";
    }) || capaReguladores.objects[0] || null;

    if (reguladorMaquinaObjeto && !reguladorMaquinaObjeto.name) {
        reguladorMaquinaObjeto.name = "reguladorMaquina";
    }

    return reguladorMaquinaObjeto;
}

function obtenerReguladorMaquinaCercano() {
    if (!reguladorMaquinaObjeto) {
        return null;
    }

    const centroX = reguladorMaquinaObjeto.x + (reguladorMaquinaObjeto.width || 0) / 2;
    const centroY = reguladorMaquinaObjeto.y + (reguladorMaquinaObjeto.height || 0) / 2;
    const distanciaX = Math.abs(jugador.x - centroX);
    const distanciaY = Math.abs(jugador.y - centroY);

    if (distanciaX < 60 && distanciaY < 60) {
        return reguladorMaquinaObjeto;
    }

    return null;
}

function obtenerEstadoEngranajesActual() {
    if (!progreso || typeof progreso !== "object") {
        return { ...crearEstadoEngranajesVacio(), resuelto: false };
    }

    const estadoGuardado = progreso.engranajesFabrica && typeof progreso.engranajesFabrica === "object"
        ? progreso.engranajesFabrica
        : null;

    if (estadoGuardado) {
        const estado = {
            A: normalizarPosicionEngranaje(estadoGuardado.A ?? 0),
            B: normalizarPosicionEngranaje(estadoGuardado.B ?? 0),
            C: normalizarPosicionEngranaje(estadoGuardado.C ?? 0),
            D: normalizarPosicionEngranaje(estadoGuardado.D ?? 0),
            resuelto: Boolean(estadoGuardado.resuelto)
        };

        progreso.engranajesFabrica = estado;
        return estado;
    }

    const generado = generarEstadoInicialEngranajes();
    progreso.engranajesFabrica = { ...generado, resuelto: false };
    engranajesEstadoActual = { ...generado, resuelto: false };
    return progreso.engranajesFabrica;
}

function comprobarEstadoResuelto(estado = obtenerEstadoEngranajesActual()) {
    const objetivo = resolverObjetivoEngranajes();
    const resuelto = estadosSonIguales(estado, objetivo);

    if (resuelto) {
        const estadoActual = { ...estado, resuelto: true };
        progreso.engranajesFabrica = estadoActual;
        engranajesEstadoActual = estadoActual;
        progreso.reparoMaquina = true;
        return true;
    }

    return false;
}

function resolverPuzzleEngranajes() {
    const estado = obtenerEstadoEngranajesActual();
    const resuelto = comprobarEstadoResuelto(estado);

    if (!resuelto) {
        return;
    }

    engranajesAbierto = false;
    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }

    cerrarMenuEngranajes();
    abrirDialogoMensaje("La máquina quedó sincronizada.");
}

function renderizarEngranajes() {
    const menuLista = document.getElementById("listaEngranajes");
    if (!menuLista) {
        return;
    }

    const estado = obtenerEstadoEngranajesActual();
    menuLista.innerHTML = "";

    engranajesOrden.forEach(engranaje => {
        const card = document.createElement("div");
        card.className = "engranaje-item";

        const titulo = document.createElement("div");
        titulo.className = "engranaje-titulo";
        titulo.textContent = `Engranaje ${engranaje}`;

        const valor = document.createElement("div");
        valor.className = "engranaje-valor";
        valor.textContent = `Posición: ${estado[engranaje]}`;

        const controles = document.createElement("div");
        controles.className = "engranaje-controles";

        const botonAtras = document.createElement("button");
        botonAtras.type = "button";
        botonAtras.textContent = "←";
        botonAtras.disabled = !!estado.resuelto;
        botonAtras.addEventListener("click", () => moverEngranaje(engranaje, -1));

        const botonAdelante = document.createElement("button");
        botonAdelante.type = "button";
        botonAdelante.textContent = "→";
        botonAdelante.disabled = !!estado.resuelto;
        botonAdelante.addEventListener("click", () => moverEngranaje(engranaje, 1));

        controles.appendChild(botonAtras);
        controles.appendChild(botonAdelante);

        card.appendChild(titulo);
        card.appendChild(valor);
        card.appendChild(controles);
        menuLista.appendChild(card);
    });
}

function moverEngranaje(engranaje, sentido) {
    if (!progreso || typeof progreso !== "object") {
        return;
    }

    const estadoActual = obtenerEstadoEngranajesActual();
    if (estadoActual.resuelto) {
        return;
    }

    const estadoSiguiente = aplicarMovimientoEngranaje(estadoActual, engranaje, sentido);
    progreso.engranajesFabrica = { ...estadoSiguiente, resuelto: false };

    if (comprobarEstadoResuelto(progreso.engranajesFabrica)) {
        resolverPuzzleEngranajes();
        return;
    }

    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }

    renderizarEngranajes();
}

function abrirPuzzleEngranajes(objeto = reguladorMaquinaObjeto) {
    if (!objeto) {
        return;
    }

    reguladorMaquinaObjeto = objeto;
    obtenerEstadoEngranajesActual();
    engranajesAbierto = true;

    const menu = document.getElementById("menuEngranajes");
    if (!menu) {
        return;
    }

    menu.style.display = "flex";
    menu.setAttribute("aria-hidden", "false");
    renderizarEngranajes();
}

function cerrarMenuEngranajes() {
    engranajesAbierto = false;
    const menu = document.getElementById("menuEngranajes");

    if (menu) {
        menu.style.display = "none";
        menu.setAttribute("aria-hidden", "true");
    }
}

function comprobarReguladorMaquina() {
    if (dialogoAbierto || engranajesAbierto) {
        return;
    }

    const regulador = obtenerReguladorMaquinaCercano();

    if (regulador && teclas["e"]) {
        teclas["e"] = false;
        abrirPuzzleEngranajes(regulador);
    }
}

document.addEventListener("keydown", function (evento) {
    if (engranajesAbierto && evento.key === "Escape") {
        evento.preventDefault();
        cerrarMenuEngranajes();
    }
});
