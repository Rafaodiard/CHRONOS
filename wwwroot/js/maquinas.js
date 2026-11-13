const idsMaquinas = ["A", "B", "C", "D", "E"];

const infoMaquinas = {
    A: {
        titulo: "MÁQUINA A",
        descripcion: "Unidad central",
        explicacion: "El volante de la máquina principal gira tan fuerte que el piso tiembla bajo tus pies. En su tablero de latón, una hilera de indicadores muestra qué máquinas de la sala siguen en marcha."
    },
    B: {
        titulo: "MÁQUINA B",
        descripcion: "Distribución eléctrica",
        explicacion: "El cuadro de distribución zumba y huele a cable recalentado. Tres cuchillas de cobre reparten la corriente de la fábrica, pero alguien arrancó las chapas que decían qué alimenta cada una."
    },
    C: {
        titulo: "MÁQUINA C",
        descripcion: "Regulador de presión",
        explicacion: "Las agujas de los manómetros tiemblan y el metal cruje. El vapor quedó encerrado: para detener el regulador hay que darle salida hasta el condensador, sin pasar por el caño roto."
    },
    D: {
        titulo: "MÁQUINA D",
        descripcion: "Sistema de seguridad",
        explicacion: "Una campanilla de alarma suena sin descanso. Tres calderas en batería esperan que alguien revise su agua y su presión antes de apagar la sala."
    },
    E: {
        titulo: "MÁQUINA E",
        descripcion: "Transmisión mecánica",
        explicacion: "Una correa de cuero baja del motor hasta el telar. El motor ruge, pero el eje de salida gira en vacío: le falta la rueda dentada."
    }
};

let maquinasMapa = [];
let maquinaActualId = null;
let maquinaPanelAbierto = false;

function obtenerInfoMaquina(id) {
    const clave = String(id || "").toUpperCase();
    return infoMaquinas[clave] || {
        titulo: `MÁQUINA ${clave || "?"}`,
        descripcion: "Sistema",
        explicacion: "Revisá el estado del sistema y determiná el objetivo de la máquina."
    };
}

// El título y la descripción van en la cabecera del panel (ver renderizarPanelMaquina).
function renderizarCabeceraMaquina(id) {
    const info = obtenerInfoMaquina(id);
    return `<p class="maquina-instruccion">${info.explicacion}</p>`;
}

// Cada máquina puede nombrar sus dos bloques (placa, nota, observación...) para no repetir la misma ficha.
function renderizarFichaMaquina(objetivo, parrafos, etiquetas = {}) {
    const etiquetaObjetivo = etiquetas.objetivo || "OBJETIVO";
    const etiquetaDetalle = etiquetas.detalle || "¿CÓMO FUNCIONA?";

    return `
        <div class="maquina-ficha">
            <div>
                <span class="maquina-label">${etiquetaObjetivo}</span>
                <p class="maquina-objetivo">${objetivo}</p>
            </div>
            <div>
                <span class="maquina-label">${etiquetaDetalle}</span>
                <div class="maquina-como-funciona">
                    ${parrafos.map(parrafo => `<p>${parrafo}</p>`).join("")}
                </div>
            </div>
        </div>
    `;
}

// estado: "estable" (verde), "proceso" (ámbar) o "alerta" (rojo).
function renderizarEstadoMaquina(estado, mensaje, submensaje = "") {
    return `
        <div class="maquina-estado" data-estado="${estado}" role="status" aria-live="polite">
            <strong>${mensaje}</strong>
            ${submensaje ? `<span>${submensaje}</span>` : ""}
        </div>
    `;
}

function renderizarMaquinaApagada(id, detalle) {
    return `
        ${estiloMaquinas()}
        <div class="maquina-shell">
            ${renderizarEstadoMaquina("estable", `✓ MÁQUINA ${id} APAGADA`, detalle)}
        </div>
    `;
}

function estiloMaquinas() {
    return `
        <style>
            .maquina-shell {
                display: flex;
                flex-direction: column;
                gap: 18px;
                color: #f5f0e4;
                font-family: Arial, Helvetica, sans-serif;
            }
            .maquina-instruccion {
                margin: 16px 0 0;
                color: #b8c3d0;
                font-size: 14px;
                line-height: 1.5;
            }
            .maquina-label {
                display: block;
                margin-bottom: 8px;
                color: #e3bb68;
                font-size: 10px;
                font-weight: bold;
                letter-spacing: 0.18em;
                text-transform: uppercase;
            }
            .maquina-ficha {
                display: grid;
                grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
                gap: 18px;
                padding: 12px 16px;
                background: #0c1420;
                border-left: 3px solid #e3bb68;
            }
            .maquina-objetivo {
                margin: 0;
                color: #f5f0e4;
                font-size: 13px;
                line-height: 1.5;
            }
            .maquina-como-funciona {
                display: grid;
                gap: 4px;
                color: #b8c3d0;
                font-size: 12px;
                line-height: 1.5;
            }
            .maquina-como-funciona p {
                margin: 0;
            }
            .maquina-cuerpo {
                display: grid;
                grid-template-columns: minmax(0, 1fr) 280px;
                gap: 20px;
                align-items: start;
            }
            /* Controles en fila debajo del estado (todas menos la máquina B). */
            .maquina-cuerpo.horizontal {
                grid-template-columns: minmax(0, 1fr);
                gap: 14px;
            }
            .maquina-cuerpo.horizontal .maquina-controles {
                display: flex;
                flex-wrap: wrap;
            }
            .maquina-cuerpo.horizontal .maquina-boton-accion {
                flex: 1 1 150px;
                width: auto;
                text-align: center;
            }
            .maquina-control-doble {
                display: flex;
                flex: 1 1 200px;
                flex-direction: column;
                gap: 6px;
                padding: 10px;
                background: #0d1623;
                border: 1px solid rgba(143, 164, 190, 0.22);
                border-radius: 6px;
            }
            .maquina-control-nombre {
                color: #d6dee7;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 0.08em;
            }
            .maquina-control-detalle {
                flex: 1;
                color: #8fa4be;
                font-size: 11px;
                line-height: 1.4;
            }
            .maquina-control-botones {
                display: flex;
                gap: 6px;
            }
            .maquina-cuerpo.horizontal .maquina-control-botones .maquina-boton-accion {
                flex: 1 1 0;
                padding: 6px 0;
                font-size: 18px;
            }
            .maquina-tablero {
                padding: 14px;
                background:
                    radial-gradient(circle at 50% 50%, rgba(126, 177, 255, 0.05), transparent 70%),
                    #0a111c;
                border: 1px solid rgba(143, 164, 190, 0.35);
                border-radius: 8px;
            }
            .maquina-zona-controles {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 14px;
                background: #0c1420;
                border: 1px solid rgba(143, 164, 190, 0.3);
                border-radius: 8px;
            }
            .maquina-zona-controles > .maquina-label {
                margin: 4px 0 0;
            }
            .maquina-controles {
                display: grid;
                gap: 8px;
            }
            .maquina-boton-accion {
                appearance: none;
                width: 100%;
                padding: 10px 12px;
                background: #182536;
                border: 1px solid #405064;
                border-radius: 6px;
                color: #d6dee7;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 0.08em;
                text-align: left;
                cursor: pointer;
                transition: transform 120ms ease, border-color 120ms ease, color 120ms ease;
            }
            .maquina-boton-accion:hover:not([disabled]) {
                transform: translateY(-1px);
                border-color: #e3bb68;
                color: #fff2c8;
            }
            .maquina-boton-accion[disabled] {
                opacity: 0.4;
                cursor: not-allowed;
            }
            .maquina-boton-accion strong {
                display: block;
                margin-top: 3px;
                color: #8fa4be;
                font-size: 11px;
                letter-spacing: 0.12em;
            }
            .maquina-boton-accion.principal {
                background: #2a200b;
                border-color: #ffd766;
                color: #ffe9a8;
                text-align: center;
                letter-spacing: 0.14em;
                box-shadow: 0 0 14px rgba(255, 215, 102, 0.3);
            }
            .maquina-grid-estado {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
            }
            .maquina-card,
            .maquina-variable-card {
                display: grid;
                gap: 8px;
                min-width: 0;
                padding: 12px;
                background: #0d1623;
                border: 1px solid rgba(143, 164, 190, 0.22);
                border-radius: 6px;
            }
            .maquina-variable-card.segura {
                border-color: rgba(127, 224, 168, 0.55);
            }
            .maquina-variable-card.fuera {
                border-color: rgba(224, 118, 107, 0.55);
            }
            .maquina-variable-card > strong {
                color: #fff2c8;
                font-family: Georgia, "Times New Roman", serif;
                font-size: 24px;
            }
            .maquina-card-header {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                color: #d6dee7;
                font-size: 11px;
                font-weight: bold;
                letter-spacing: 0.12em;
            }
            .maquina-safebox {
                color: #8fa4be;
                font-size: 11px;
            }
            .maquina-meter {
                position: relative;
                height: 10px;
                background: #060a11;
                border: 1px solid rgba(143, 164, 190, 0.25);
                border-radius: 999px;
                overflow: hidden;
            }
            .maquina-meter-fill {
                position: absolute;
                inset: 0 auto 0 0;
                border-radius: 999px;
                transition: width 250ms ease;
            }
            .maquina-estado-row {
                display: flex;
                align-items: baseline;
                justify-content: space-between;
                gap: 8px;
                color: #8fa4be;
                font-size: 12px;
            }
            .maquina-estado-row strong {
                color: #fff2c8;
                font-family: Georgia, "Times New Roman", serif;
                font-size: 22px;
            }
            .maquina-badge-estado {
                padding: 3px 7px;
                border: 1px solid;
                border-radius: 4px;
                font-size: 9px;
                font-weight: bold;
                letter-spacing: 0.12em;
                white-space: nowrap;
            }
            .maquina-badge-estado.seguro {
                color: #7fe0a8;
                border-color: rgba(127, 224, 168, 0.5);
                background: rgba(127, 224, 168, 0.1);
            }
            .maquina-badge-estado.fuera {
                color: #e0766b;
                border-color: rgba(224, 118, 107, 0.5);
                background: rgba(224, 118, 107, 0.1);
            }
            .maquina-circuito {
                display: grid;
                gap: 10px;
            }
            .maquina-linea {
                display: grid;
                grid-template-columns: minmax(80px, 1fr) minmax(40px, 1.2fr) minmax(80px, 1fr);
                align-items: center;
            }
            .maquina-punto-nodo {
                min-height: 44px;
                background: #0d1623;
                border: 1px solid rgba(143, 164, 190, 0.3);
                border-radius: 6px;
                color: #d6dee7;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 0.1em;
                cursor: pointer;
                transition: border-color 120ms ease, background 120ms ease;
            }
            .maquina-punto-nodo:hover {
                border-color: #e3bb68;
            }
            .maquina-punto-nodo.activo {
                background: #2a200b;
                border-color: #ffd766;
                color: #ffe9a8;
                box-shadow: 0 0 12px rgba(255, 215, 102, 0.35);
            }
            .maquina-punto-conexion {
                height: 8px;
                background: #7d6246;
                border-top: 3px solid #060a11;
                border-bottom: 3px solid #060a11;
            }
            .maquina-medicion-box {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }
            .maquina-medicion {
                padding: 10px;
                background: #0d1623;
                border: 1px solid rgba(143, 164, 190, 0.22);
                border-radius: 6px;
            }
            .maquina-medicion label {
                display: block;
                margin-bottom: 4px;
                color: #8fa4be;
                font-size: 9px;
                letter-spacing: 0.14em;
            }
            .maquina-medicion strong {
                color: #ffe9a8;
                font-size: 16px;
            }
            .maquina-mediciones-lista {
                display: grid;
                gap: 6px;
            }
            .maquina-item-valor {
                padding: 6px 8px;
                background: #0d1623;
                border: 1px solid rgba(143, 164, 190, 0.18);
                border-radius: 4px;
                color: #b8c3d0;
                font-size: 11px;
            }
            .maquina-contador {
                display: flex;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 12px;
                color: #b8c3d0;
                font-size: 12px;
            }
            .maquina-contador strong {
                color: #fff2c8;
            }
            .maquina-transmision {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
            }
            .maquina-transmision-node {
                flex: 1 1 0;
                min-width: 0;
                padding: 10px 6px;
                background: #0d1623;
                border: 1px solid rgba(143, 164, 190, 0.3);
                border-radius: 6px;
                color: #d6dee7;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 0.06em;
                text-align: center;
            }
            .maquina-transmision-arrow {
                color: #e3bb68;
                font-size: 18px;
            }
            .maquina-diagrama {
                display: grid;
                gap: 2px;
                color: #8fa4be;
                font-family: Consolas, "Courier New", monospace;
                font-size: 14px;
                white-space: pre;
            }
            .maquina-diagrama strong {
                color: #fff2c8;
            }
            .maquina-status-lista {
                display: grid;
                gap: 8px;
                margin-top: 14px;
            }
            .maquina-status-item {
                display: flex;
                justify-content: space-between;
                gap: 10px;
                padding: 8px 10px;
                background: #0d1623;
                border: 1px solid rgba(143, 164, 190, 0.22);
                border-radius: 6px;
                color: #d6dee7;
                font-size: 12px;
            }
            .maquina-status-item strong {
                color: #e3bb68;
                letter-spacing: 0.1em;
            }
            .maquina-status-item.apagada strong {
                color: #7fe0a8;
            }
            .maquina-estado {
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding: 12px 16px;
                background: #0c1420;
                border-left: 4px solid #e3bb68;
                color: #e3bb68;
                font-size: 14px;
                font-weight: bold;
                letter-spacing: 0.06em;
            }
            .maquina-estado span {
                color: #b8c3d0;
                font-size: 12px;
                font-weight: normal;
                letter-spacing: 0;
            }
            .maquina-estado[data-estado="alerta"] {
                border-color: #e0766b;
                color: #e0766b;
            }
            .maquina-estado[data-estado="estable"] {
                border-color: #7fe0a8;
                color: #7fe0a8;
            }
            @media (max-width: 680px) {
                .maquina-ficha,
                .maquina-cuerpo {
                    grid-template-columns: 1fr;
                }
                .maquina-transmision {
                    flex-wrap: wrap;
                }
            }
        </style>
    `;
}

function crearEstadoBaseMaquina() {
    return {
        encendida: true,
        apagada: false,
        resuelta: false,
        preparado: false,
        desafio: null
    };
}

function inicializarMaquinasEstado() {
    if (!progreso || typeof progreso !== "object") {
        return;
    }

    progreso.maquinas ??= {};

    idsMaquinas.forEach(id => {
        const estadoActual = progreso.maquinas[id];

        if (!estadoActual || typeof estadoActual !== "object") {
            progreso.maquinas[id] = crearEstadoBaseMaquina();
            return;
        }

        if (typeof estadoActual.encendida !== "boolean") {
            estadoActual.encendida = !Boolean(estadoActual.apagada);
        }

        if (typeof estadoActual.apagada !== "boolean") {
            estadoActual.apagada = false;
        }

        if (estadoActual.apagada) {
            estadoActual.encendida = false;
        }

        if (!estadoActual.desafio) {
            estadoActual.desafio = null;
        }
    });
}

function obtenerEstadoMaquina(id) {
    const clave = String(id || "").toUpperCase();

    if (!idsMaquinas.includes(clave)) {
        return null;
    }

    progreso.maquinas ??= {};
    progreso.maquinas[clave] ??= crearEstadoBaseMaquina();

    const estado = progreso.maquinas[clave];

    if (estado.apagada) {
        estado.encendida = false;
    }

    if (!estado.desafio) {
        estado.desafio = null;
    }

    return estado;
}

function obtenerMaquinaPorId(id) {
    const clave = String(id || "").toUpperCase();
    return maquinasMapa.find(maquina => {
        const idObjeto = String(obtenerPropiedadInteractuable(maquina, "Id") || "").toUpperCase();
        return idObjeto === clave;
    }) || null;
}

function actualizarEstadoMaquinaDesdeMapa() {
    maquinasMapa.forEach(maquina => {
        const id = String(obtenerPropiedadInteractuable(maquina, "Id") || "").toUpperCase();
        if (!idsMaquinas.includes(id)) {
            return;
        }

        const estado = obtenerEstadoMaquina(id);
        if (!estado) {
            return;
        }

        maquina.estado = estado.apagada ? "apagada" : "encendida";
        maquina.idMaquina = id;
    });
}

function cargarMaquinasMapa() {
    maquinasMapa = [];

    if (!mapa?.layers) {
        return;
    }

    const capaMaquinas = mapa.layers.find(capa => capa.name === "Maquinas");

    if (!capaMaquinas?.objects) {
        return;
    }

    maquinasMapa = capaMaquinas.objects.filter(objeto => {
        const id = String(obtenerPropiedadInteractuable(objeto, "Id") || "").toUpperCase();
        return idsMaquinas.includes(id);
    });

    inicializarMaquinasEstado();
    actualizarEstadoMaquinaDesdeMapa();
}

function obtenerMaquinaCercana() {
    return maquinasMapa.find(maquina => {
        const centroX = (maquina.x || 0) + ((maquina.width || 10) / 2);
        const centroY = (maquina.y || 0) + ((maquina.height || 10) / 2);
        const distanciaX = Math.abs(jugador.x - centroX);
        const distanciaY = Math.abs(jugador.y - centroY);
        return distanciaX < 58 && distanciaY < 58;
    }) || null;
}

function abrirPanelMaquina(id) {
    const maquina = obtenerMaquinaPorId(id);
    if (!maquina) {
        return;
    }

    const menu = document.getElementById("menuMaquinas");
    const contenido = document.getElementById("contenidoMaquina");

    if (!menu || !contenido) {
        return;
    }

    maquinaActualId = String(id).toUpperCase();
    maquinaPanelAbierto = true;
    menu.style.display = "flex";
    menu.setAttribute("aria-hidden", "false");
    renderizarPanelMaquina();
}

function cerrarPanelMaquina() {
    const menu = document.getElementById("menuMaquinas");
    maquinaPanelAbierto = false;
    maquinaActualId = null;

    if (menu) {
        menu.style.display = "none";
        menu.setAttribute("aria-hidden", "true");
    }
}

function mostrarPanelMaquinaPorCercania() {
    if (dialogoAbierto || maquinaPanelAbierto) {
        return;
    }

    const maquina = obtenerMaquinaCercana();
    if (!maquina) {
        return;
    }

    const id = String(obtenerPropiedadInteractuable(maquina, "Id") || "").toUpperCase();
    if (!idsMaquinas.includes(id)) {
        return;
    }

    if (teclas["e"]) {
        teclas["e"] = false;
        abrirPanelMaquina(id);
    }
}

function guardarResultadoMaquina(id, patch) {
    const estado = obtenerEstadoMaquina(id);
    if (!estado) {
        return;
    }

    Object.assign(estado, patch);
    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }
    actualizarEstadoMaquinaDesdeMapa();
}

let fragmentoSecuenciaActiva = false;
let bloqueoFragmentoActivo = false;
let fragmentoFadeOpacity = 0;

function todasLasMaquinasApagadas() {
    return idsMaquinas.every(maquinaId => {
        const estado = obtenerEstadoMaquina(maquinaId);
        return estado && estado.apagada;
    });
}

function puedeInteractuarConFragmento() {
    return Boolean(progreso?.fragmentoLiberado) &&
        !progreso?.fragmentoSecuenciaIniciada &&
        !progreso?.fragmentoDescargaRealizada &&
        !progreso?.dialogoPostDescargaCompletado &&
        todasLasMaquinasApagadas();
}

function liberarFragmento() {
    if (progreso.fragmentoLiberado) {
        return;
    }

    progreso.fragmentoLiberado = true;
    progreso.salaMaquinasCompletada = true;

    // Se demora para no pisar el sonido de la última máquina apagándose.
    reproducirEfecto("fragmento", { retraso: 900 });

    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }

    if (typeof abrirDialogoMensaje === "function") {
        abrirDialogoMensaje("El fragmento queda liberado.");
        return;
    }

    if (typeof alert === "function") {
        alert("El fragmento queda liberado.");
    }
}

function activarDescargaVisual() {
    const pantalla = document.getElementById("juego");
    if (pantalla) {
        pantalla.style.filter = "brightness(0.7) saturate(0.9)";
        setTimeout(() => {
            pantalla.style.filter = "";
        }, 450);
    }
}

function entregarLlaveElectricidadPostDescarga() {
    if (!tieneObjeto("llave_electricidad")) {
        agregarObjeto("llave_electricidad");
    }

    progreso.llaveElectricidadEntregada = true;
    progreso.dialogoPostDescargaCompletado = true;

    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }
}

function iniciarSecuenciaFragmento() {
    if (!puedeInteractuarConFragmento()) {
        return;
    }

    reproducirEfecto("fragmento");
    sacudirCamara(10, 1.6);
    destelloFragmento();
    progreso.fragmentoSecuenciaIniciada = true;
    progreso.fragmentoDescargaRealizada = true;
    fragmentoSecuenciaActiva = true;
    bloqueoFragmentoActivo = true;
    fragmentoFadeOpacity = 0;

    Object.keys(teclas).forEach(tecla => {
        teclas[tecla] = false;
    });

    activarDescargaVisual();

    // Primero la descarga eléctrica sobre el jugador y, cuando termina, se desmaya (fundido a negro).
    const DURACION_ELECTROCUCION_S = 1.4;

    if (typeof iniciarElectrocucion === "function") {
        iniciarElectrocucion(DURACION_ELECTROCUCION_S);
    }

    if (typeof reproducirElectrocucion === "function") {
        reproducirElectrocucion(DURACION_ELECTROCUCION_S);
    }

    setTimeout(fundidoDesmayoFragmento, DURACION_ELECTROCUCION_S * 1000 - 250);

    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }
}

function fundidoDesmayoFragmento() {
    const negro = setInterval(() => {
        fragmentoFadeOpacity = Math.min(1, fragmentoFadeOpacity + 0.09);

        if (fragmentoFadeOpacity >= 1) {
            clearInterval(negro);

            // Con la pantalla todavía en negro: el jugador ya está tirado en el piso y el
            // ingeniero a su lado, así al aclararse no se ve ni un frame del jugador parado.
            animacionDespertarActiva = true;
            frameAnimacion = 0;
            tiempoAnimacion = 0;

            if (Array.isArray(npcs)) {
                const ingeniero = npcs.find(npc => npc.nombre === "Ingeniero");
                if (ingeniero) {
                    ingeniero.x = jugador.x + 40;
                    ingeniero.y = jugador.y + 30;
                }
            }

            setTimeout(() => {
                const salida = setInterval(() => {
                    fragmentoFadeOpacity = Math.max(0, fragmentoFadeOpacity - 0.09);

                    if (fragmentoFadeOpacity <= 0) {
                        clearInterval(salida);
                        fragmentoFadeOpacity = 0;
                        fragmentoSecuenciaActiva = false;
                        bloqueoFragmentoActivo = false;

                        if (typeof abrirDialogo === "function") {
                            abrirDialogo("IngenieroPostDescarga", {
                                alTerminar: entregarLlaveElectricidadPostDescarga
                            });
                        }
                    }
                }, 25);
            }, 1800);
        }
    }, 25);
}

function apagarMaquina(id) {
    const estado = obtenerEstadoMaquina(id);

    if (!estado) {
        return false;
    }

    if (estado.apagada) {
        return false;
    }

    // Las máquinas son independientes: se pueden apagar en cualquier orden.
    // En B, C, D y E el botón de apagado solo aparece cuando su desafío está resuelto.
    estado.apagada = true;
    estado.encendida = false;
    estado.resuelta = true;
    estado.desafio = estado.desafio || {};
    reproducirEfecto("maquinaApagada");
    sacudirCamara(6, 0.5);

    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }

    actualizarEstadoMaquinaDesdeMapa();

    const maquinasApagadas = idsMaquinas.every(maquinaId => {
        const maquinaEstado = obtenerEstadoMaquina(maquinaId);
        return maquinaEstado && maquinaEstado.apagada;
    });

    if (maquinasApagadas) {
        liberarFragmento();
    }

    renderizarPanelMaquina();
    return true;
}

function panelContenidoPlaceholder(titulo, subtitulo) {
    return `
        ${estiloMaquinas()}
        <div class="maquina-shell">
            ${renderizarEstadoMaquina("proceso", titulo, subtitulo)}
        </div>
    `;
}

// =========================================================
// DESAFÍOS B, C, D Y E
// =========================================================
// Versión corta para la exposición: cada máquina tiene un desafío sencillo con toda la
// información a la vista. Si el jugador se equivoca, la máquina explica qué falló y se puede
// volver a intentar enseguida, sin esperas.
// Las partidas con versiones anteriores sin resolver se reinician; las resueltas se conservan.

// Crea o migra el desafío guardado de una máquina según su versión.
function obtenerDesafioVersionado(id, version, crear, marcarResuelto) {
    const estado = obtenerEstadoMaquina(id);

    if (estado.desafio && estado.desafio.version !== version) {
        const yaResuelto = Boolean(estado.desafio.resuelto);
        estado.desafio = crear();

        if (yaResuelto) {
            marcarResuelto(estado.desafio);
            estado.desafio.resuelto = true;
        }
    }

    estado.desafio ??= crear();
    return estado.desafio;
}

function estiloDesafiosBCE() {
    return `
        <style>
            .maquina-libro-guardia {
                display: grid;
                gap: 6px;
                padding: 12px 16px;
                background: #e7d7b4;
                border: 6px solid #5b4430;
                color: #30271d;
                font-family: Georgia, "Times New Roman", serif;
                font-size: 14px;
                line-height: 1.45;
            }
            .maquina-libro-guardia p {
                margin: 0;
            }
            .maquina-libro-guardia b {
                color: #6b3f1d;
            }
            .maquina-anotacion-marca {
                display: inline-block;
                width: 1.4em;
                font-weight: bold;
            }
            .maquina-libro-guardia p.ok .maquina-anotacion-marca {
                color: #2f7a3e;
            }
            .maquina-libro-guardia p.mal .maquina-anotacion-marca {
                color: #a3332a;
            }
            .maquina-libro-guardia p.mal {
                text-decoration: underline wavy rgba(163, 51, 42, 0.5);
            }
            .maquina-cuchillas {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
            }
            .maquina-cuchilla {
                display: grid;
                gap: 8px;
                justify-items: center;
                padding: 12px 10px;
                background: #0d1623;
                border: 1px solid rgba(143, 164, 190, 0.22);
                border-radius: 6px;
            }
            .maquina-cuchilla-dibujo {
                position: relative;
                width: 34px;
                height: 70px;
                background: #1c2733;
                border: 2px solid #5a6b7d;
                border-radius: 4px;
            }
            .maquina-cuchilla-dibujo::after {
                position: absolute;
                left: 50%;
                top: 8px;
                width: 6px;
                height: 48px;
                margin-left: -3px;
                content: "";
                background: linear-gradient(#d9b36a, #8a6d3b);
                border-radius: 3px;
            }
            .maquina-selector {
                width: 100%;
                padding: 7px 6px;
                background: #3a2c14;
                border: 1px solid #b08a45;
                border-radius: 3px;
                color: #f3d995;
                font-family: Georgia, "Times New Roman", serif;
                font-size: 13px;
            }
            .maquina-selector:disabled {
                opacity: 0.8;
            }
            .maquina-esquema {
                width: 100%;
                max-width: 640px;
                height: auto;
                margin: 0 auto;
                display: block;
            }
            .maquina-esquema text {
                font-family: Georgia, "Times New Roman", serif;
            }
            .maquina-opciones {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            .maquina-opcion {
                padding: 8px 12px;
                background: #121c2a;
                border: 1px solid #405064;
                border-radius: 4px;
                color: #b8c3d0;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 0.06em;
                cursor: pointer;
            }
            .maquina-opcion:hover:not([disabled]) {
                border-color: #e3bb68;
                color: #fff2c8;
            }
            .maquina-opcion.elegida {
                background: #2a200b;
                border-color: #ffd766;
                color: #ffe9a8;
            }
            .maquina-opcion.rota {
                border-color: rgba(224, 118, 107, 0.6);
                color: #f0a49b;
            }
            .maquina-opcion[disabled] {
                cursor: default;
            }
            .maquina-tren {
                display: grid;
                grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
                gap: 10px;
                align-items: center;
            }
            .maquina-par {
                display: grid;
                gap: 4px;
                justify-items: center;
                min-width: 110px;
                color: #8fa4be;
                font-size: 11px;
                text-align: center;
            }
            .maquina-par-flecha {
                color: #e3bb68;
                font-size: 20px;
            }
            .maquina-eje {
                display: grid;
                gap: 8px;
                padding: 12px;
                background: #0d1623;
                border: 1px solid rgba(143, 164, 190, 0.22);
                border-radius: 6px;
                text-align: center;
            }
            .maquina-eje-titulo {
                color: #d6dee7;
                font-size: 11px;
                font-weight: bold;
                letter-spacing: 0.12em;
            }
            .maquina-eje-rueda {
                color: #fff2c8;
                font-family: Georgia, "Times New Roman", serif;
                font-size: 20px;
            }
            @media (max-width: 680px) {
                .maquina-tren {
                    grid-template-columns: 1fr;
                }
                .maquina-par-flecha {
                    transform: rotate(90deg);
                }
            }
        </style>
    `;
}


// =========================================================
// MÁQUINA C — RED DE VAPOR
// =========================================================
// Hay que abrir un camino de la caldera al condensador sin abrir el caño roto.
// Solución: V1 (caldera -> colector superior) y V3 (colector superior -> condensador).
// V2 lleva al colector inferior, cuya única salida es el caño roto (V4).
const VERSION_DESAFIO_C = 3;

const NODOS_C = {
    caldera: { nombre: "Caldera", x: 60, y: 120 },
    superior: { nombre: "Colector superior", x: 275, y: 45 },
    inferior: { nombre: "Colector inferior", x: 275, y: 195 },
    condensador: { nombre: "Condensador", x: 490, y: 120 }
};

const VALVULAS_C = [
    { id: "V1", desde: "caldera", hasta: "superior" },
    { id: "V2", desde: "caldera", hasta: "inferior" },
    { id: "V3", desde: "superior", hasta: "condensador" },
    { id: "V4", desde: "inferior", hasta: "condensador", rota: true }
];

const SOLUCION_C = ["V1", "V3"];

function crearDesafioC() {
    return {
        version: VERSION_DESAFIO_C,
        abiertas: {},
        mensaje: "El casco del regulador cruje: el vapor no tiene por dónde salir.",
        submensaje: "",
        resuelto: false
    };
}

function obtenerDesafioC() {
    return obtenerDesafioVersionado("C", VERSION_DESAFIO_C, crearDesafioC, desafio => {
        SOLUCION_C.forEach(id => { desafio.abiertas[id] = true; });
        desafio.mensaje = "EL VAPOR CORRE HACIA EL CONDENSADOR";
    });
}

function alternarValvulaC(id) {
    const desafio = obtenerDesafioC();

    if (desafio.resuelto || !VALVULAS_C.some(valvula => valvula.id === id)) {
        return;
    }

    reproducirEfecto("mecanismo");
    desafio.abiertas[id] = !desafio.abiertas[id];
    renderizarPanelMaquina();
}

function abrirPasoC() {
    const desafio = obtenerDesafioC();

    if (desafio.resuelto || !VALVULAS_C.some(valvula => desafio.abiertas[valvula.id])) {
        return;
    }

    if (desafio.abiertas.V4) {
        reproducirEfecto("puzzleError");
        desafio.abiertas.V4 = false;
        desafio.mensaje = "¡El caño roto revienta en una nube de vapor! El regulador lo cierra de golpe.";
        desafio.submensaje = "Ese caño no se puede usar: buscá otro camino hasta el condensador.";
        renderizarPanelMaquina();
        return;
    }

    if (SOLUCION_C.every(id => desafio.abiertas[id])) {
        reproducirEfecto("puzzleCompletado");
        desafio.resuelto = true;
        desafio.mensaje = "EL VAPOR CORRE HACIA EL CONDENSADOR";
        desafio.submensaje = "Las agujas bajan despacio hasta asentarse. Ya podés apagar la máquina.";
        guardarResultadoMaquina("C", { resuelta: true, desafio });
        renderizarPanelMaquina();
        return;
    }

    reproducirEfecto("puzzleError");
    desafio.mensaje = "El vapor no llega al condensador: al camino le falta un tramo.";
    desafio.submensaje = "Seguí los caños desde la caldera y abrí cada tramo hasta el condensador.";
    renderizarPanelMaquina();
}

function renderizarEsquemaC(desafio) {
    const tramos = VALVULAS_C.map(valvula => {
        const a = NODOS_C[valvula.desde];
        const b = NODOS_C[valvula.hasta];
        const abierta = Boolean(desafio.abiertas[valvula.id]);
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const colorLinea = valvula.rota ? "#b5524a" : abierta ? "#e3bb68" : "#4a5663";
        const colorBorde = valvula.rota ? "#e0766b" : abierta ? "#ffd766" : "#5a6b7d";
        const detalle = valvula.rota ? "ROTO · PIERDE" : abierta ? "abierta" : "cerrada";
        return `
            <line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${colorLinea}" stroke-width="${abierta ? 7 : 5}" stroke-linecap="round" ${valvula.rota ? `stroke-dasharray="10 7"` : ""} />
            <g>
                <rect x="${mx - 44}" y="${my - 17}" width="88" height="34" rx="4" fill="#0a111c" stroke="${colorBorde}" />
                <text x="${mx}" y="${my - 2}" text-anchor="middle" fill="#fff2c8" font-size="12" font-weight="bold">${valvula.id}</text>
                <text x="${mx}" y="${my + 12}" text-anchor="middle" fill="${valvula.rota ? "#f0a49b" : "#b8c3d0"}" font-size="10">${detalle}</text>
            </g>
        `;
    }).join("");

    const nodos = Object.values(NODOS_C).map(nodo => `
        <circle cx="${nodo.x}" cy="${nodo.y}" r="15" fill="#2a200b" stroke="#b08a45" stroke-width="2" />
        <text x="${nodo.x}" y="${nodo.y + (nodo.y < 120 ? -22 : 34)}" text-anchor="middle" fill="#e9d28f" font-size="12">${nodo.nombre}</text>
    `).join("");

    return `
        <svg class="maquina-esquema" viewBox="0 0 550 240" role="img" aria-label="Esquema de la cañería de vapor">
            ${tramos}
            ${nodos}
        </svg>
    `;
}

function renderizarDesafioC() {
    const desafio = obtenerDesafioC();
    const estado = obtenerEstadoMaquina("C");

    if (estado.apagada) {
        return renderizarMaquinaApagada("C", "Las válvulas quedaron cerradas y las agujas, en reposo.");
    }

    const hayAbiertas = VALVULAS_C.some(valvula => desafio.abiertas[valvula.id]);

    const valvulas = VALVULAS_C.map(valvula => `
        <button type="button" class="maquina-opcion ${desafio.abiertas[valvula.id] ? "elegida" : ""} ${valvula.rota ? "rota" : ""}" ${desafio.resuelto ? "disabled" : ""} onclick="alternarValvulaC('${valvula.id}')">
            ${valvula.id} · ${desafio.abiertas[valvula.id] ? "ABIERTA" : "CERRADA"}${valvula.rota ? " (ROTO)" : ""}
        </button>
    `).join("");

    const accion = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion principal" onclick="apagarMaquina('C')">Apagar C</button>`
        : `<button type="button" class="maquina-boton-accion principal" ${hayAbiertas ? "" : "disabled"} onclick="abrirPasoC()">Soltar el vapor</button>`;

    return `
        ${estiloMaquinas()}
        ${estiloDesafiosBCE()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("C")}
            ${renderizarFichaMaquina(
                "Abrí un camino para que el vapor vaya de la caldera al condensador.",
                [
                    "Hacé clic en las válvulas para abrirlas o cerrarlas. Los caños abiertos se ven dorados en el esquema.",
                    "El caño marcado en rojo está roto y pierde: <b>no lo abras</b>.",
                    "Cuando el camino esté completo, presioná «Soltar el vapor»."
                ],
                { objetivo: "OBJETIVO", detalle: "CÓMO HACERLO" }
            )}
            <section class="maquina-tablero">
                <span class="maquina-label">ESQUEMA DE LA CAÑERÍA</span>
                ${renderizarEsquemaC(desafio)}
            </section>
            <aside class="maquina-zona-controles">
                <span class="maquina-label">VÁLVULAS DE PASO</span>
                <div class="maquina-opciones">${valvulas}</div>
                <div class="maquina-controles">${accion}</div>
            </aside>
            ${renderizarEstadoMaquina(desafio.resuelto ? "estable" : "alerta", desafio.mensaje, desafio.submensaje)}
        </div>
    `;
}


// =========================================================
// MÁQUINA E — TRANSMISIÓN
// =========================================================
// La rueda del motor (12 dientes) gira a 240 vueltas por minuto y el telar necesita 120.
// La rueda de salida tiene que tener el doble de dientes que la del motor: 24.
const VERSION_DESAFIO_E = 3;
const DIENTES_MOTOR_E = 12;
const VUELTAS_MOTOR_E = 240;
const VUELTAS_TELAR_E = 120;
const RUEDAS_E = [12, 24, 48];
const SOLUCION_E = 24;

function crearDesafioE() {
    return {
        version: VERSION_DESAFIO_E,
        rueda: null,
        mensaje: "El telar está quieto: al eje de salida le falta la rueda dentada.",
        submensaje: "",
        resuelto: false
    };
}

function obtenerDesafioE() {
    return obtenerDesafioVersionado("E", VERSION_DESAFIO_E, crearDesafioE, desafio => {
        desafio.rueda = SOLUCION_E;
        desafio.mensaje = "EL TELAR RETOMA SU MARCHA";
    });
}

function elegirRuedaE(dientes) {
    const desafio = obtenerDesafioE();
    const valor = Number(dientes);

    if (desafio.resuelto) {
        return;
    }

    reproducirEfecto("mecanismo");
    desafio.rueda = RUEDAS_E.includes(valor) ? valor : null;
    renderizarPanelMaquina();
}

function arrancarTransmisionE() {
    const desafio = obtenerDesafioE();

    if (desafio.resuelto || !desafio.rueda) {
        return;
    }

    if (desafio.rueda === SOLUCION_E) {
        reproducirEfecto("puzzleCompletado");
        desafio.resuelto = true;
        desafio.mensaje = "EL TELAR RETOMA SU MARCHA";
        desafio.submensaje = `Gira justo a ${VUELTAS_TELAR_E} vueltas por minuto. Ya podés apagar la máquina.`;
        guardarResultadoMaquina("E", { resuelta: true, desafio });
        renderizarPanelMaquina();
        return;
    }

    const vueltas = Math.round(VUELTAS_MOTOR_E * DIENTES_MOTOR_E / desafio.rueda);
    const muyRapido = vueltas > VUELTAS_TELAR_E;

    reproducirEfecto("puzzleError");
    desafio.mensaje = muyRapido
        ? `El telar gira a ${vueltas} vueltas por minuto: demasiado rápido, los hilos se cortan.`
        : `El telar gira a ${vueltas} vueltas por minuto: demasiado lento, no llega a tejer.`;
    desafio.submensaje = muyRapido
        ? "Probá con una rueda que tenga más dientes."
        : "Probá con una rueda que tenga menos dientes.";
    renderizarPanelMaquina();
}

function renderizarDesafioE() {
    const desafio = obtenerDesafioE();
    const estado = obtenerEstadoMaquina("E");

    if (estado.apagada) {
        return renderizarMaquinaApagada("E", "La correa quedó floja y los engranajes, quietos.");
    }

    const opciones = [`<option value="">— elegir rueda —</option>`]
        .concat(RUEDAS_E.map(dientes => `<option value="${dientes}" ${desafio.rueda === dientes ? "selected" : ""}>Rueda de ${dientes} dientes</option>`))
        .join("");

    const accion = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion principal" onclick="apagarMaquina('E')">Apagar E</button>`
        : `<button type="button" class="maquina-boton-accion principal" ${desafio.rueda ? "" : "disabled"} onclick="arrancarTransmisionE()">Arrancar el telar</button>`;

    return `
        ${estiloMaquinas()}
        ${estiloDesafiosBCE()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("E")}
            ${renderizarFichaMaquina(
                `El telar tiene que girar a ${VUELTAS_TELAR_E} vueltas por minuto: la mitad de lo que gira el motor.`,
                [
                    `El motor gira a ${VUELTAS_MOTOR_E} vueltas por minuto con una rueda de ${DIENTES_MOTOR_E} dientes.`,
                    "Si la rueda de salida tiene <b>la misma cantidad</b> de dientes que la del motor, gira igual de rápido. Si tiene <b>el doble</b> de dientes, gira a la mitad de velocidad.",
                    "Elegí la rueda del eje de salida y arrancá el telar."
                ],
                { objetivo: "OBJETIVO", detalle: "CÓMO FUNCIONA" }
            )}
            <section class="maquina-tablero">
                <span class="maquina-label">EJES DE LA TRANSMISIÓN</span>
                <div class="maquina-tren">
                    <div class="maquina-eje">
                        <span class="maquina-eje-titulo">EJE DEL MOTOR</span>
                        <span class="maquina-eje-rueda">${DIENTES_MOTOR_E} dientes</span>
                        <span class="maquina-safebox">Rueda fija · ${VUELTAS_MOTOR_E} vueltas/min</span>
                    </div>
                    <div class="maquina-par">
                        <span class="maquina-par-flecha">⟶</span>
                        <span>correa</span>
                    </div>
                    <div class="maquina-eje">
                        <span class="maquina-eje-titulo">EJE DE SALIDA</span>
                        <span class="maquina-eje-rueda">${desafio.rueda ? `${desafio.rueda} dientes` : "sin rueda"}</span>
                        <span class="maquina-safebox">Acoplado al telar</span>
                        <select class="maquina-selector" ${desafio.resuelto ? "disabled" : ""} onchange="elegirRuedaE(this.value)">${opciones}</select>
                    </div>
                </div>
            </section>
            <div class="maquina-controles">${accion}</div>
            ${renderizarEstadoMaquina(desafio.resuelto ? "estable" : "alerta", desafio.mensaje, desafio.submensaje)}
        </div>
    `;
}


// =========================================================
// MÁQUINA B — CUADRO SIN ROTULAR
// =========================================================
// Tres cuchillas sin chapa. Con dos anotaciones del libro de guardia se deduce el orden:
//   1. La fragua está en la primera cuchilla (la de la izquierda).
//   2. El alumbrado está justo a la izquierda de los telares.
// Única solución: 1 Fragua, 2 Alumbrado, 3 Telares.
const VERSION_DESAFIO_B = 3;
const CHAPAS_B = ["Alumbrado", "Telares", "Fragua"];
const SOLUCION_B = ["Fragua", "Alumbrado", "Telares"];

function crearDesafioB() {
    return {
        version: VERSION_DESAFIO_B,
        chapas: [null, null, null],
        mensaje: "Tres cuchillas iguales y ninguna chapa: nadie sabe qué corta cada una.",
        submensaje: "",
        resuelto: false
    };
}

function obtenerDesafioB() {
    return obtenerDesafioVersionado("B", VERSION_DESAFIO_B, crearDesafioB, desafio => {
        desafio.chapas = [...SOLUCION_B];
        desafio.mensaje = "CUADRO ROTULADO";
    });
}

function elegirChapaB(indice, chapa) {
    const desafio = obtenerDesafioB();

    if (desafio.resuelto || indice < 0 || indice >= desafio.chapas.length) {
        return;
    }

    reproducirEfecto("mecanismo");

    // Cada chapa existe una sola vez: si estaba en otra cuchilla, se despega de ahí.
    desafio.chapas = desafio.chapas.map((actual, i) => i !== indice && actual === chapa ? null : actual);
    desafio.chapas[indice] = CHAPAS_B.includes(chapa) ? chapa : null;

    renderizarPanelMaquina();
}

function atornillarChapasB() {
    const desafio = obtenerDesafioB();

    if (desafio.resuelto || desafio.chapas.some(chapa => !chapa)) {
        return;
    }

    const correcta = desafio.chapas.every((chapa, i) => chapa === SOLUCION_B[i]);

    if (correcta) {
        reproducirEfecto("puzzleCompletado");
        desafio.resuelto = true;
        desafio.mensaje = "CUADRO ROTULADO";
        desafio.submensaje = "Cada cuchilla vuelve a tener su chapa. Ya podés apagar la máquina.";
        guardarResultadoMaquina("B", { resuelta: true, desafio });
        renderizarPanelMaquina();
        return;
    }

    reproducirEfecto("puzzleError");
    desafio.mensaje = "Probás la primera cuchilla con la chapa puesta… y se apaga otra cosa. Las chapas no coinciden.";
    desafio.submensaje = "Revisá las anotaciones marcadas con ✗ y cambiá las chapas.";
    renderizarPanelMaquina();
}

// Cada anotación sabe comprobarse contra las chapas puestas. No se marca mientras falte
// alguna de las chapas que menciona.
const ANOTACIONES_B = [
    {
        dia: "Lunes",
        texto: "La fragua está en la primera cuchilla, la de la izquierda.",
        usa: ["Fragua"],
        cumple: p => p.Fragua === 1
    },
    {
        dia: "Martes",
        texto: "El alumbrado está pegado a los telares, justo a su izquierda.",
        usa: ["Alumbrado", "Telares"],
        cumple: p => p.Alumbrado + 1 === p.Telares
    }
];

function renderizarAnotacionesB(desafio) {
    const posiciones = {};
    desafio.chapas.forEach((chapa, indice) => {
        if (chapa) {
            posiciones[chapa] = indice + 1;
        }
    });

    return ANOTACIONES_B.map(anotacion => {
        const evaluable = anotacion.usa.every(chapa => posiciones[chapa]);
        const cumple = evaluable && anotacion.cumple(posiciones);
        const marca = !evaluable ? "" : cumple ? "✓" : "✗";
        const clase = !evaluable ? "" : cumple ? "ok" : "mal";
        return `<p class="${clase}"><span class="maquina-anotacion-marca">${marca}</span><b>${anotacion.dia}.</b> ${anotacion.texto}</p>`;
    }).join("");
}

function renderizarDesafioB() {
    const desafio = obtenerDesafioB();
    const estado = obtenerEstadoMaquina("B");

    if (estado.apagada) {
        return renderizarMaquinaApagada("B", "El cuadro quedó sin tensión y los bornes, fríos.");
    }

    const completo = desafio.chapas.every(Boolean);

    const cuchillas = desafio.chapas.map((chapa, indice) => {
        const opciones = [`<option value="">— sin chapa —</option>`]
            .concat(CHAPAS_B.map(nombre => `<option value="${nombre}" ${chapa === nombre ? "selected" : ""}>${nombre}</option>`))
            .join("");
        return `
            <div class="maquina-cuchilla">
                <span class="maquina-eje-titulo">CUCHILLA ${indice + 1}</span>
                <div class="maquina-cuchilla-dibujo" aria-hidden="true"></div>
                <select class="maquina-selector" ${desafio.resuelto ? "disabled" : ""} onchange="elegirChapaB(${indice}, this.value)">${opciones}</select>
            </div>
        `;
    }).join("");

    const accion = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion principal" onclick="apagarMaquina('B')">Apagar B</button>`
        : `<button type="button" class="maquina-boton-accion principal" ${completo ? "" : "disabled"} onclick="atornillarChapasB()">Atornillar las chapas</button>`;

    return `
        ${estiloMaquinas()}
        ${estiloDesafiosBCE()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("B")}
            ${renderizarFichaMaquina(
                "Poné cada chapa en la cuchilla que corresponde.",
                [
                    "Las tres chapas de bronce están en el piso: Alumbrado, Telares y Fragua. <b>Cada chapa va en una sola cuchilla.</b>",
                    "Las cuchillas se cuentan <b>de izquierda a derecha</b>: la 1 es la de la izquierda.",
                    "Seguí las anotaciones del libro de guardia: cuando una se cumple aparece un ✓."
                ],
                { objetivo: "OBJETIVO", detalle: "CÓMO HACERLO" }
            )}
            <section class="maquina-libro-guardia" aria-label="Libro de guardia del electricista">
                ${renderizarAnotacionesB(desafio)}
            </section>
            <section class="maquina-tablero">
                <span class="maquina-label">CUADRO DE DISTRIBUCIÓN</span>
                <div class="maquina-cuchillas">${cuchillas}</div>
            </section>
            <div class="maquina-controles">${accion}</div>
            ${renderizarEstadoMaquina(desafio.resuelto ? "estable" : "alerta", desafio.mensaje, desafio.submensaje)}
        </div>
    `;
}


// =========================================================
// MÁQUINA D — SALA DE CALDERAS
// =========================================================
// Tres calderas. El reglamento dice qué maniobra corresponde en cada caso:
//   - presión por encima del límite de su placa -> abrir la purga de vapor;
//   - sin agua en el tubo de nivel -> retirar el fuego;
//   - todo en orden -> no intervenir.
// Solución: 1 purga de vapor, 2 retirar el fuego, 3 no intervenir.
const VERSION_DESAFIO_D = 6;

const MANIOBRAS_D = {
    purgaVapor: "Abrir purga de vapor",
    retirarFuego: "Retirar el fuego",
    ninguna: "No intervenir"
};

const CALDERAS_D = [
    { id: "1", limite: 7, presion: 9, conAgua: true, correcta: "purgaVapor" },
    { id: "2", limite: 6, presion: 4, conAgua: false, correcta: "retirarFuego" },
    { id: "3", limite: 8, presion: 6, conAgua: true, correcta: "ninguna" }
];

function crearDesafioD() {
    return {
        version: VERSION_DESAFIO_D,
        maniobras: {},
        revisar: [],
        mensaje: "La campanilla de alarma no deja de sonar.",
        submensaje: "",
        resuelto: false
    };
}

function obtenerDesafioD() {
    const desafio = obtenerDesafioVersionado("D", VERSION_DESAFIO_D, crearDesafioD, nuevo => {
        CALDERAS_D.forEach(caldera => {
            nuevo.maniobras[caldera.id] = caldera.correcta;
        });
        nuevo.mensaje = "LA ALARMA SE SILENCIA";
    });

    desafio.maniobras ??= {};
    desafio.revisar ??= [];
    return desafio;
}

function elegirManiobraD(idCaldera, maniobra) {
    const desafio = obtenerDesafioD();

    if (desafio.resuelto || !MANIOBRAS_D[maniobra]) {
        return;
    }

    reproducirEfecto("mecanismo");
    desafio.maniobras[idCaldera] = maniobra;
    desafio.revisar = desafio.revisar.filter(id => id !== idCaldera);
    renderizarPanelMaquina();
}

function firmarOrdenD() {
    const desafio = obtenerDesafioD();

    if (desafio.resuelto || !CALDERAS_D.every(caldera => desafio.maniobras[caldera.id])) {
        return;
    }

    const equivocadas = CALDERAS_D
        .filter(caldera => desafio.maniobras[caldera.id] !== caldera.correcta)
        .map(caldera => caldera.id);

    if (equivocadas.length === 0) {
        reproducirEfecto("puzzleCompletado");
        desafio.resuelto = true;
        desafio.revisar = [];
        desafio.mensaje = "LA ALARMA SE SILENCIA";
        desafio.submensaje = "Las tres calderas vuelven a un régimen seguro. Ya podés apagar la máquina.";
        guardarResultadoMaquina("D", { resuelta: true, desafio });
        renderizarPanelMaquina();
        return;
    }

    reproducirEfecto("puzzleError");
    desafio.revisar = equivocadas;
    desafio.mensaje = equivocadas.length === 1
        ? "El capataz revisa la orden: «Hay una caldera con la maniobra equivocada.»"
        : `El capataz revisa la orden: «Hay ${equivocadas.length} calderas con la maniobra equivocada.»`;
    desafio.submensaje = "Las calderas marcadas en rojo no cumplen el reglamento. Volvé a leerlo y corregilas.";
    renderizarPanelMaquina();
}

function renderizarCalderaD(caldera, desafio) {
    const elegida = desafio.maniobras[caldera.id];
    const revisar = desafio.revisar.includes(caldera.id);

    const maniobras = Object.entries(MANIOBRAS_D).map(([clave, nombre]) => `
        <button type="button" class="maquina-maniobra ${elegida === clave ? "elegida" : ""}" ${desafio.resuelto ? "disabled" : ""} onclick="elegirManiobraD('${caldera.id}', '${clave}')">${nombre}</button>
    `).join("");

    return `
        <div class="maquina-card maquina-caldera ${revisar ? "revisar" : ""}">
            <div class="maquina-card-header">
                <span>CALDERA ${caldera.id}${revisar ? ` <span class="maquina-caldera-aviso">✗ REVISAR</span>` : ""}</span>
                <span class="maquina-placa-timbre">LÍMITE ${caldera.limite} ATM</span>
            </div>
            <div class="maquina-caldera-instrumentos">
                <div class="maquina-tubo-nivel" title="Tubo de nivel">
                    <div class="maquina-tubo-agua" style="height:${caldera.conAgua ? 50 : 0}%;"></div>
                </div>
                <div class="maquina-caldera-lecturas">
                    <div><span>Tubo de nivel</span><strong>${caldera.conAgua ? "agua a media altura" : "no se ve agua"}</strong></div>
                    <div><span>Manómetro</span><strong>${caldera.presion} atm</strong></div>
                </div>
            </div>
            <span class="maquina-label">MANIOBRA</span>
            <div class="maquina-maniobras">${maniobras}</div>
        </div>
    `;
}

function estiloCalderasD() {
    return `
        <style>
            .maquina-calderas {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
                gap: 12px;
            }
            .maquina-caldera.revisar {
                border-color: rgba(224, 118, 107, 0.8);
                box-shadow: 0 0 0 1px rgba(224, 118, 107, 0.35) inset;
            }
            .maquina-caldera-aviso {
                margin-left: 6px;
                color: #e0766b;
            }
            .maquina-placa-timbre {
                padding: 3px 7px;
                background: #3a2c14;
                border: 1px solid #b08a45;
                border-radius: 3px;
                color: #f3d995;
                font-family: Georgia, "Times New Roman", serif;
                font-size: 10px;
                letter-spacing: 0.1em;
            }
            .maquina-caldera-instrumentos {
                display: flex;
                gap: 12px;
                align-items: stretch;
            }
            .maquina-tubo-nivel {
                position: relative;
                flex: 0 0 16px;
                min-height: 70px;
                background: linear-gradient(90deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.02) 60%);
                border: 2px solid #8a6d3b;
                border-radius: 8px;
                overflow: hidden;
            }
            .maquina-tubo-agua {
                position: absolute;
                inset: auto 0 0 0;
                background: rgba(109, 182, 214, 0.75);
                border-top: 2px solid #bfe6f5;
            }
            .maquina-caldera-lecturas {
                display: grid;
                flex: 1;
                gap: 6px;
                font-size: 11px;
            }
            .maquina-caldera-lecturas span {
                display: block;
                color: #8fa4be;
                letter-spacing: 0.06em;
            }
            .maquina-caldera-lecturas strong {
                color: #fff2c8;
                font-family: Georgia, "Times New Roman", serif;
                font-size: 15px;
                font-weight: normal;
            }
            .maquina-maniobras {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }
            .maquina-maniobra {
                padding: 6px 8px;
                background: #121c2a;
                border: 1px solid #405064;
                border-radius: 4px;
                color: #b8c3d0;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 11px;
                cursor: pointer;
            }
            .maquina-maniobra:hover:not([disabled]) {
                border-color: #e3bb68;
                color: #fff2c8;
            }
            .maquina-maniobra.elegida {
                background: #2a200b;
                border-color: #ffd766;
                color: #ffe9a8;
            }
            .maquina-maniobra[disabled] {
                cursor: default;
            }
        </style>
    `;
}

function renderizarDesafioD() {
    const desafio = obtenerDesafioD();
    const estado = obtenerEstadoMaquina("D");

    if (estado.apagada) {
        return renderizarMaquinaApagada("D", "La campanilla quedó muda y los fuegos de las calderas, en brasas.");
    }

    const calderas = CALDERAS_D.map(caldera => renderizarCalderaD(caldera, desafio)).join("");
    const ordenCompleta = CALDERAS_D.every(caldera => desafio.maniobras[caldera.id]);

    const accion = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion principal" onclick="apagarMaquina('D')">Apagar D</button>`
        : `<button type="button" class="maquina-boton-accion principal" ${ordenCompleta ? "" : "disabled"} onclick="firmarOrdenD()">Firmar la orden de maniobra</button>`;

    return `
        ${estiloMaquinas()}
        ${estiloCalderasD()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("D")}
            ${renderizarFichaMaquina(
                "Elegí una maniobra para cada caldera según el reglamento y firmá la orden.",
                [
                    "<b>I.</b> Si el manómetro marca <b>más</b> que el límite de su placa: <b>abrir la purga de vapor</b>.",
                    "<b>II.</b> Si no se ve agua en el tubo de nivel: <b>retirar el fuego</b>. A una caldera seca nunca se le da agua.",
                    "<b>III.</b> Si la caldera está en orden: <b>no intervenir</b>."
                ],
                { objetivo: "ORDEN DE MANIOBRA", detalle: "REGLAMENTO DE CALDERAS" }
            )}
            <section class="maquina-tablero">
                <span class="maquina-label">BATERÍA DE CALDERAS</span>
                <div class="maquina-calderas">${calderas}</div>
            </section>
            <div class="maquina-controles">${accion}</div>
            ${renderizarEstadoMaquina(desafio.resuelto ? "estable" : "alerta", desafio.mensaje, desafio.submensaje)}
        </div>
    `;
}


// =========================================================
// MÁQUINA A — CORTE GENERAL
// =========================================================
// Sin desafío: se puede cortar en cualquier momento. Sus indicadores sirven para ver
// qué máquinas de la sala siguen en marcha.
function renderizarDesafioA() {
    const estado = obtenerEstadoMaquina("A");

    if (estado.apagada) {
        return renderizarMaquinaApagada("A", "El volante se detiene y el piso deja de temblar.");
    }

    const lista = ["B", "C", "D", "E"].map(id => {
        const apagada = Boolean(obtenerEstadoMaquina(id)?.apagada);
        return `
            <div class="maquina-status-item ${apagada ? "apagada" : ""}">
                <span>Máquina ${id}</span>
                <strong>${apagada ? "APAGADA" : "EN MARCHA"}</strong>
            </div>
        `;
    }).join("");

    return `
        ${estiloMaquinas()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("A")}
            ${renderizarFichaMaquina(
                "Bajá la palanca de corte general para apagar la máquina principal.",
                [
                    "Las cinco máquinas son independientes: podés apagarlas <b>en el orden que quieras</b>.",
                    "Los indicadores muestran qué otras máquinas de la sala siguen en marcha."
                ],
                { objetivo: "TABLERO PRINCIPAL", detalle: "INDICADORES" }
            )}
            <div class="maquina-cuerpo horizontal">
                <section class="maquina-tablero">
                    <span class="maquina-label">INDICADORES DE LA SALA</span>
                    <div class="maquina-status-lista">${lista}</div>
                </section>
                <aside class="maquina-zona-controles">
                    <span class="maquina-label">PALANCA DE CORTE</span>
                    <div class="maquina-controles">
                        <button type="button" class="maquina-boton-accion principal" onclick="apagarMaquina('A')">Apagar A</button>
                    </div>
                </aside>
            </div>
            ${renderizarEstadoMaquina("proceso", "La máquina principal sigue en marcha.")}
        </div>
    `;
}

function renderizarPanelMaquina() {
    const contenido = document.getElementById("contenidoMaquina");
    if (!contenido || !maquinaActualId) {
        return;
    }

    const estado = obtenerEstadoMaquina(maquinaActualId);
    if (!estado) {
        return;
    }

    const info = obtenerInfoMaquina(maquinaActualId);
    const titulo = document.getElementById("tituloMaquina");
    const subtitulo = document.getElementById("subtituloMaquina");

    if (titulo) {
        titulo.textContent = info.titulo;
    }

    if (subtitulo) {
        subtitulo.textContent = info.descripcion;
    }

    let inner = "";

    switch (maquinaActualId) {
        case "A":
            inner = renderizarDesafioA();
            break;
        case "B":
            inner = renderizarDesafioB();
            break;
        case "C":
            inner = renderizarDesafioC();
            break;
        case "D":
            inner = renderizarDesafioD();
            break;
        case "E":
            inner = renderizarDesafioE();
            break;
        default:
            inner = panelContenidoPlaceholder("Máquina", "No hay información disponible.");
    }

    contenido.innerHTML = inner;
}

window.alternarValvulaC = alternarValvulaC;
window.abrirPasoC = abrirPasoC;
window.elegirRuedaE = elegirRuedaE;
window.arrancarTransmisionE = arrancarTransmisionE;
window.elegirChapaB = elegirChapaB;
window.atornillarChapasB = atornillarChapasB;
window.elegirManiobraD = elegirManiobraD;
window.firmarOrdenD = firmarOrdenD;
window.apagarMaquina = apagarMaquina;
window.cerrarPanelMaquina = cerrarPanelMaquina;
window.abrirPanelMaquina = abrirPanelMaquina;
