const idsMaquinas = ["A", "B", "C", "D", "E"];

const infoMaquinas = {
    A: {
        titulo: "MÁQUINA A",
        descripcion: "Unidad central",
        explicacion: "Esta es la unidad central del sistema. No puede apagarse hasta que todas las máquinas que dependen de ella estén detenidas."
    },
    B: {
        titulo: "MÁQUINA B",
        descripcion: "Distribución eléctrica",
        explicacion: "Esta máquina distribuye energía mediante varias líneas eléctricas. Existe una interrupción en el circuito. Utilizá el medidor para localizar la falla y aislarla correctamente."
    },
    C: {
        titulo: "MÁQUINA C",
        descripcion: "Regulador de presión",
        explicacion: "Esta máquina regula la presión mediante tres cámaras conectadas. Las válvulas modifican la presión del sistema. Para apagar la máquina, las tres cámaras deben quedar estabilizadas dentro de sus límites seguros."
    },
    D: {
        titulo: "MÁQUINA D",
        descripcion: "Sistema de seguridad",
        explicacion: "Esta máquina controla las condiciones de seguridad del sistema. Temperatura, presión, flujo y carga están relacionadas entre sí. Debés estabilizar todas las variables dentro de sus límites seguros."
    },
    E: {
        titulo: "MÁQUINA E",
        descripcion: "Transmisión mecánica",
        explicacion: "Esta máquina transmite el movimiento del motor hacia la salida. Uno de los componentes presenta una falla. Utilizá los indicadores y los componentes de la transmisión para encontrar el problema y conseguir que el movimiento llegue correctamente a la salida."
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

function renderizarFichaMaquina(objetivo, parrafos) {
    return `
        <div class="maquina-ficha">
            <div>
                <span class="maquina-label">OBJETIVO</span>
                <p class="maquina-objetivo">${objetivo}</p>
            </div>
            <div>
                <span class="maquina-label">¿CÓMO FUNCIONA?</span>
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

function obtenerMaquinasDependientes(id) {
    const maquina = obtenerMaquinaPorId(id);
    if (!maquina) {
        return [];
    }

    const dependencias = String(obtenerPropiedadInteractuable(maquina, "dependencias") || "")
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);

    return dependencias;
}

function verificarOrdenApagado(id) {
    const dependencias = obtenerMaquinasDependientes(id);

    return dependencias.every(dependencia => {
        const estado = obtenerEstadoMaquina(dependencia);
        return !estado || estado.apagada;
    });
}

function hayDependenciasActivas(id) {
    const estado = obtenerEstadoMaquina(id);
    if (!estado || estado.apagada) {
        return false;
    }

    const dependencias = obtenerMaquinasDependientes(id);
    return dependencias.some(dependencia => {
        const estadoDependencia = obtenerEstadoMaquina(dependencia);
        return Boolean(estadoDependencia) && !estadoDependencia.apagada;
    });
}

function mostrarMensajeNoApagado() {
    const mensaje = "CORTE NO SEGURO. Se detectó consumo activo en una línea dependiente. El apagado fue cancelado para evitar daños.";

    if (typeof abrirDialogoMensaje === "function") {
        abrirDialogoMensaje(mensaje);
        return;
    }

    if (typeof alert === "function") {
        alert("CORTE NO SEGURO\nSe detectó consumo activo en una línea dependiente.\nEl apagado fue cancelado para evitar daños.");
    }
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

function comprobarPreparacionCentral() {
    const idsRequeridos = ["C", "B", "E", "D"];
    const preparada = idsRequeridos.every(id => {
        const estado = obtenerEstadoMaquina(id);
        return estado && estado.apagada;
    });

    const central = obtenerEstadoMaquina("A");
    if (central) {
        central.preparado = preparada;
    }

    return preparada;
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

    progreso.fragmentoSecuenciaIniciada = true;
    progreso.fragmentoDescargaRealizada = true;
    fragmentoSecuenciaActiva = true;
    bloqueoFragmentoActivo = true;
    fragmentoFadeOpacity = 0;

    Object.keys(teclas).forEach(tecla => {
        teclas[tecla] = false;
    });

    activarDescargaVisual();

    const negro = setInterval(() => {
        fragmentoFadeOpacity = Math.min(1, fragmentoFadeOpacity + 0.09);

        if (fragmentoFadeOpacity >= 1) {
            clearInterval(negro);

            setTimeout(() => {
                const salida = setInterval(() => {
                    fragmentoFadeOpacity = Math.max(0, fragmentoFadeOpacity - 0.09);

                    if (fragmentoFadeOpacity <= 0) {
                        clearInterval(salida);
                        fragmentoFadeOpacity = 0;
                        fragmentoSecuenciaActiva = false;
                        bloqueoFragmentoActivo = false;

                        if (Array.isArray(npcs)) {
                            const ingeniero = npcs.find(npc => npc.nombre === "Ingeniero");
                            if (ingeniero) {
                                ingeniero.x = jugador.x + 40;
                                ingeniero.y = jugador.y + 30;
                            }
                        }

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

    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }
}

function apagarMaquina(id) {
    const estado = obtenerEstadoMaquina(id);

    if (!estado) {
        return false;
    }

    if (estado.apagada) {
        return false;
    }

    const bloqueadoPorDependencia = hayDependenciasActivas(id);
    const ordenBloqueado = id !== "C" && !verificarOrdenApagado(id);

    if (bloqueadoPorDependencia || ordenBloqueado) {
        mostrarMensajeNoApagado();
        return false;
    }

    if (id === "A") {
        const centrales = ["C", "B", "E", "D"];
        const preparado = centrales.every(maqId => {
            const maquinaEstado = obtenerEstadoMaquina(maqId);
            return maquinaEstado && maquinaEstado.apagada;
        });

        if (!preparado) {
            mostrarMensajeNoApagado();
            return false;
        }
    }

    estado.apagada = true;
    estado.encendida = false;
    estado.resuelta = true;
    estado.desafio = estado.desafio || {};

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

function crearBarraPresion(valor, etiqueta) {
    const porcentaje = Math.max(0, Math.min(100, valor));
    const color = porcentaje > 65 ? "#ff8d6d" : porcentaje < 35 ? "#6dd3ff" : "#7ef7a8";

    return `
        <div class="maquina-medidor">
            <div class="maquina-etiqueta-row">
                <span>${etiqueta}</span>
                <strong>${valor}</strong>
            </div>
            <div class="maquina-barra">
                <span class="maquina-barra-fill" style="width:${porcentaje}%; background:${color};"></span>
            </div>
        </div>
    `;
}

function obtenerDesafioC() {
    const estado = obtenerEstadoMaquina("C");
    estado.desafio ??= {
        presiones: { A: 72, B: 38, C: 78 },
        zonaSegura: { A: [35, 60], B: [35, 60], C: [35, 60] },
        estabilizando: false,
        resuelto: false,
        mensaje: "Ajustá las válvulas para estabilizar la presión."
    };

    if (!estado.desafio.mensaje) {
        estado.desafio.mensaje = "Ajustá las válvulas para estabilizar la presión.";
    }

    return estado.desafio;
}

function cambianPresionesC(valvula) {
    const desafio = obtenerDesafioC();
    if (desafio.resuelto) {
        return;
    }

    if (desafio.estabilizando && desafio.timer) {
        clearTimeout(desafio.timer);
        desafio.estabilizando = false;
    }

    const cambios = {
        1: { A: -12, B: 12 },
        2: { B: -12, C: 12 },
        3: { C: -12, A: 12 }
    };

    const efecto = cambios[valvula];
    if (!efecto) {
        return;
    }

    Object.entries(efecto).forEach(([cuerpo, delta]) => {
        desafio.presiones[cuerpo] = Math.max(0, Math.min(100, Number(desafio.presiones[cuerpo]) + Number(delta)));
    });

    desafio.mensaje = "Presión actualizada.";

    if (Object.keys(desafio.presiones).every(llave => {
        const valor = desafio.presiones[llave];
        const [min, max] = desafio.zonaSegura[llave];
        return valor >= min && valor <= max;
    })) {
        desafio.estabilizando = true;
        desafio.timer = setTimeout(() => {
            const desafioActual = obtenerDesafioC();
            const seguro = Object.keys(desafioActual.presiones).every(llave => {
                const valor = desafioActual.presiones[llave];
                const [min, max] = desafioActual.zonaSegura[llave];
                return valor >= min && valor <= max;
            });

            if (seguro) {
                desafioActual.resuelto = true;
                desafioActual.mensaje = "SISTEMA ESTABLE";
                guardarResultadoMaquina("C", { resuelta: true, desafio: desafioActual });
            } else {
                desafioActual.estabilizando = false;
                desafioActual.mensaje = "La presión salió de la zona segura.";
            }

            renderizarPanelMaquina();
        }, 1100);
    } else {
        desafio.mensaje = "Alguna cámara salió de la zona segura. Requiere reajuste.";
    }

    renderizarPanelMaquina();
}

function renderizarDesafioC() {
    const desafio = obtenerDesafioC();
    const estado = obtenerEstadoMaquina("C");

    if (estado.apagada) {
        return renderizarMaquinaApagada("C", "El sistema de equilibrio está desactivado.");
    }

    let todasDentro = true;

    const presiones = Object.entries(desafio.presiones).map(([camara, valor]) => {
        const [min, max] = desafio.zonaSegura[camara];
        const dentro = valor >= min && valor <= max;
        const porcentaje = Math.max(0, Math.min(100, ((valor - min) / (max - min || 1)) * 100));
        todasDentro = todasDentro && dentro;
        return `
            <div class="maquina-card">
                <div class="maquina-card-header">
                    <span>CÁMARA ${camara}</span>
                    <span class="maquina-badge-estado ${dentro ? "seguro" : "fuera"}">${dentro ? "SEGURO" : "FUERA DE RANGO"}</span>
                </div>
                <div class="maquina-safebox">Zona segura: ${min}–${max}</div>
                <div class="maquina-meter">
                    <div class="maquina-meter-fill" style="width:${porcentaje}%; background:${dentro ? "#7fe0a8" : "#e0766b"};"></div>
                </div>
                <div class="maquina-estado-row">
                    <strong>${valor}</strong>
                    <span>${dentro ? "Dentro del rango" : "Requiere ajuste"}</span>
                </div>
            </div>
        `;
    }).join("");

    const botones = [
        { numero: 1, label: "Válvula 1" },
        { numero: 2, label: "Válvula 2" },
        { numero: 3, label: "Válvula 3" }
    ];

    const accionApagar = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion principal" onclick="apagarMaquina('C')">Apagar C</button>`
        : "";

    const estadoMensaje = desafio.resuelto ? "estable" : todasDentro ? "proceso" : "alerta";

    return `
        ${estiloMaquinas()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("C")}
            ${renderizarFichaMaquina(
                "Estabilizá las tres cámaras de presión para poder apagar la máquina.",
                [
                    "Las tres cámaras están conectadas entre sí.",
                    "Las válvulas modifican la presión de más de una cámara al mismo tiempo.",
                    "Observá cómo cambia el sistema después de cada ajuste y mantené todas las cámaras dentro de sus zonas seguras."
                ]
            )}
            <div class="maquina-cuerpo horizontal">
                <section class="maquina-tablero">
                    <span class="maquina-label">ESTADO DEL SISTEMA</span>
                    <div class="maquina-grid-estado">${presiones}</div>
                </section>
                <aside class="maquina-zona-controles">
                    <span class="maquina-label">CONTROLES</span>
                    <div class="maquina-controles">
                        ${botones.map(boton => `
                            <button type="button" class="maquina-boton-accion" onclick="cambianPresionesC(${boton.numero})">
                                ${boton.label}
                            </button>
                        `).join("")}
                        ${accionApagar}
                    </div>
                </aside>
            </div>
            ${renderizarEstadoMaquina(estadoMensaje, desafio.mensaje)}
        </div>
    `;
}

function obtenerDesafioE() {
    const estado = obtenerEstadoMaquina("E");
    estado.desafio ??= {
        motor: "OK",
        eje1: "OK",
        eje2: "VIBRACIÓN",
        eje3: "BLOQUEADO",
        salida: "SIN MOVIMIENTO",
        diagnostico: "Se observa vibración y bloqueo en el eje 3.",
        resuelto: false,
        bloqueado: false
    };

    return estado.desafio;
}

function diagnosticarComponenteE(componente) {
    const desafio = obtenerDesafioE();
    const estados = {
        motor: ["OK", "OK", "VIBRACIÓN"],
        eje1: ["OK", "OK", "DESALINEADO"],
        eje2: ["OK", "VIBRACIÓN", "OK"],
        eje3: ["OK", "BLOQUEADO", "OK"],
        salida: ["SIN MOVIMIENTO", "MOVIMIENTO BAJO", "OK"]
    };

    const secuencia = estados[componente] || ["OK"];
    const indiceActual = secuencia.indexOf(desafio[componente]);
    const indiceSiguiente = indiceActual >= 0 ? (indiceActual + 1) % secuencia.length : 0;
    desafio[componente] = secuencia[indiceSiguiente];

    if (desafio.eje3 === "OK" && desafio.salida === "OK" && desafio.motor === "OK" && desafio.eje1 === "OK" && desafio.eje2 === "OK") {
        desafio.resuelto = true;
        desafio.diagnostico = "TRANSMISIÓN ESTABLE";
        guardarResultadoMaquina("E", { resuelta: true, desafio });
    } else {
        desafio.diagnostico = "Ajustá la transmisión observando el origen del bloqueo.";
    }

    renderizarPanelMaquina();
}

function renderizarDesafioE() {
    const desafio = obtenerDesafioE();
    const estado = obtenerEstadoMaquina("E");

    if (estado.apagada) {
        return renderizarMaquinaApagada("E", "La transmisión mecánica está inactiva.");
    }

    const componentes = [
        { clave: "motor", label: "Motor" },
        { clave: "eje1", label: "Eje 1" },
        { clave: "eje2", label: "Eje 2" },
        { clave: "eje3", label: "Eje 3" },
        { clave: "salida", label: "Salida" }
    ];

    const lista = componentes.map(item => `
        <button type="button" class="maquina-boton-accion" onclick="diagnosticarComponenteE('${item.clave}')">
            <span>${item.label}</span>
            <strong>${desafio[item.clave]}</strong>
        </button>
    `).join("");

    const accionApagar = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion principal" onclick="apagarMaquina('E')">Apagar E</button>`
        : "";

    const colorComponente = valor => valor === "OK"
        ? "#7fe0a8"
        : valor === "BLOQUEADO" || valor === "SIN MOVIMIENTO" ? "#e0766b" : "#e3bb68";

    return `
        ${estiloMaquinas()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("E")}
            ${renderizarFichaMaquina(
                "Localizá la falla de la transmisión y conseguí que el movimiento llegue correctamente a la salida.",
                [
                    "El motor transmite movimiento a través de varios componentes hasta llegar a la salida.",
                    "Uno de los componentes presenta una falla.",
                    "Utilizá los indicadores para seguir el recorrido del movimiento y determinar dónde está el problema."
                ]
            )}
            <div class="maquina-cuerpo horizontal">
                <section class="maquina-tablero">
                    <span class="maquina-label">ESTADO DEL SISTEMA</span>
                    <div class="maquina-transmision">
                        ${componentes.map((item, index) => `
                            <div class="maquina-transmision-node" style="border-color: ${colorComponente(desafio[item.clave])};">
                                <div>${item.label}</div>
                                <div style="margin-top: 6px; font-size: 11px; color: ${colorComponente(desafio[item.clave])};">${desafio[item.clave]}</div>
                            </div>
                            ${index < componentes.length - 1 ? '<div class="maquina-transmision-arrow">→</div>' : ''}
                        `).join("")}
                    </div>
                </section>
                <aside class="maquina-zona-controles">
                    <span class="maquina-label">CONTROLES</span>
                    <div class="maquina-controles">${lista}${accionApagar}</div>
                </aside>
            </div>
            ${renderizarEstadoMaquina(desafio.resuelto ? "estable" : "proceso", desafio.diagnostico)}
        </div>
    `;
}

function crearPuntosCircuitoB(ubicacion) {
    const configuraciones = {
        "L2-2": {
            "L1-1": 12,
            "L1-2": 12,
            "L2-1": 12,
            "L2-2": 0,
            "L3-1": 0,
            "L3-2": 0,
            "L4-1": 0,
            "L4-2": 0
        },
        "L4-1": {
            "L1-1": 12,
            "L1-2": 12,
            "L2-1": 12,
            "L2-2": 12,
            "L3-1": 12,
            "L3-2": 12,
            "L4-1": 0,
            "L4-2": 12
        },
        "L1-2": {
            "L1-1": 12,
            "L1-2": 0,
            "L2-1": 12,
            "L2-2": 12,
            "L3-1": 12,
            "L3-2": 0,
            "L4-1": 12,
            "L4-2": 12
        }
    };

    return configuraciones[ubicacion] || configuraciones["L2-2"];
}

function obtenerFallaActualB(desafio) {
    const fallas = desafio?.fallas || [];
    const indiceActual = Math.min(Math.max(desafio.fallaActualIndex || 0, 0), Math.max(fallas.length - 1, 0));
    return fallas[indiceActual] || null;
}

function obtenerDesafioB() {
    const estado = obtenerEstadoMaquina("B");
    const fallasIniciales = [
        { ubicacion: "L2-2" },
        { ubicacion: "L4-1" },
        { ubicacion: "L1-2" }
    ];

    estado.desafio ??= {
        fallas: fallasIniciales,
        fallaActualIndex: 0,
        fallasAisladas: 0,
        totalFallas: 3,
        puntos: crearPuntosCircuitoB(fallasIniciales[0].ubicacion),
        seleccion: null,
        aislada: false,
        resuelto: false,
        mensaje: "Diagnóstico del circuito.",
        submensaje: "Falla actual: DETECTADA",
        mediciones: {}
    };

    if (!Array.isArray(estado.desafio.fallas) || estado.desafio.fallas.length === 0) {
        estado.desafio.fallas = fallasIniciales;
    }

    if (typeof estado.desafio.fallaActualIndex !== "number") {
        estado.desafio.fallaActualIndex = 0;
    }

    if (!estado.desafio.puntos || Object.keys(estado.desafio.puntos).length === 0) {
        const fallaActual = obtenerFallaActualB(estado.desafio);
        estado.desafio.puntos = crearPuntosCircuitoB(fallaActual ? fallaActual.ubicacion : fallasIniciales[0].ubicacion);
    }

    return estado.desafio;
}

function medirPuntoB(punto) {
    const desafio = obtenerDesafioB();
    desafio.seleccion = punto;
    desafio.mediciones ??= {};
    desafio.mediciones[punto] = desafio.puntos[punto];
    desafio.mensaje = `Medición en ${punto}: ${desafio.puntos[punto]} V`;
    desafio.submensaje = "Falla actual: DETECTADA";
    renderizarPanelMaquina();
}

function aislarFallaB() {
    const desafio = obtenerDesafioB();
    const fallaActual = obtenerFallaActualB(desafio);

    if (!fallaActual) {
        return;
    }

    if (desafio.seleccion !== fallaActual.ubicacion) {
        desafio.mensaje = "El circuito todavía presenta una falla.";
        desafio.submensaje = "Falla actual: DETECTADA";
        renderizarPanelMaquina();
        return;
    }

    desafio.fallasAisladas += 1;
    desafio.aislada = true;
    desafio.mensaje = "FALLA AISLADA";
    desafio.submensaje = "El sistema está redistribuyendo la energía...";

    if (desafio.fallasAisladas >= desafio.totalFallas) {
        desafio.resuelto = true;
        desafio.mensaje = "TODAS LAS FALLAS AISLADAS";
        desafio.submensaje = "El circuito está estable.";
        guardarResultadoMaquina("B", { resuelta: true, desafio });
        renderizarPanelMaquina();
        return;
    }

    guardarResultadoMaquina("B", { desafio });
    renderizarPanelMaquina();

    window.setTimeout(() => {
        const siguiente = obtenerDesafioB();
        siguiente.fallaActualIndex += 1;
        siguiente.seleccion = null;
        siguiente.aislada = false;
        siguiente.mensaje = "NUEVA FALLA DETECTADA";
        siguiente.submensaje = "Fallas aisladas: " + siguiente.fallasAisladas + " / " + siguiente.totalFallas;
        const siguienteFalla = obtenerFallaActualB(siguiente);
        siguiente.puntos = crearPuntosCircuitoB(siguienteFalla ? siguienteFalla.ubicacion : "L2-2");
        renderizarPanelMaquina();
    }, 1300);
}

function renderizarDesafioB() {
    const desafio = obtenerDesafioB();
    const estado = obtenerEstadoMaquina("B");

    if (estado.apagada) {
        return renderizarMaquinaApagada("B", "La línea eléctrica está aislada.");
    }

    const lineas = [
        ["L1-1", "L1-2"],
        ["L2-1", "L2-2"],
        ["L3-1", "L3-2"],
        ["L4-1", "L4-2"]
    ];

    const circuito = lineas.map((linea, indice) => `
        <div class="maquina-linea">
            <button type="button" class="maquina-punto-nodo ${desafio.seleccion === linea[0] ? "activo" : ""}" onclick="medirPuntoB('${linea[0]}')">${linea[0]}</button>
            <div class="maquina-punto-conexion" style="opacity:${(indice + 1) % 2 === 0 ? 0.5 : 1};"></div>
            <button type="button" class="maquina-punto-nodo ${desafio.seleccion === linea[1] ? "activo" : ""}" onclick="medirPuntoB('${linea[1]}')">${linea[1]}</button>
        </div>
    `).join("");

    const mediciones = Object.entries(desafio.mediciones || {}).map(([punto, valor]) => `
        <div class="maquina-item-valor">${punto} → ${valor} V</div>
    `).join("") || `<div class="maquina-item-valor">Todavía no hay mediciones registradas.</div>`;

    const accionApagar = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion principal" onclick="apagarMaquina('B')">Apagar B</button>`
        : "";

    const estadoFalla = desafio.resuelto ? "LISTA PARA APAGAR" : "DETECTADA";
    const estadoMensaje = desafio.resuelto || desafio.aislada ? "estable" : "proceso";

    return `
        ${estiloMaquinas()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("B")}
            ${renderizarFichaMaquina(
                "Localizá y aislá cada interrupción del circuito para estabilizar la alimentación.",
                [
                    "La energía debe circular por cada tramo del circuito sin interrupciones.",
                    "Utilizá el voltímetro para comprobar cada punto y localizar la zona donde la energía se corta.",
                    "Cuando identifiques la falla actual, aislá esa sección y espera a que el sistema redistribuya la energía."
                ]
            )}
            <div class="maquina-cuerpo">
                <section class="maquina-tablero">
                    <span class="maquina-label">DIAGNÓSTICO DEL CIRCUITO</span>
                    <div class="maquina-contador">
                        <span>Fallas aisladas: <strong>${desafio.fallasAisladas} / ${desafio.totalFallas}</strong></span>
                        <span>Falla actual: <strong>${estadoFalla}</strong></span>
                    </div>
                    <span class="maquina-label">ESTADO DEL CIRCUITO</span>
                    <div class="maquina-circuito">${circuito}</div>
                </section>
                <aside class="maquina-zona-controles">
                    <span class="maquina-label">MEDICIÓN ACTUAL</span>
                    <div class="maquina-medicion-box">
                        <div class="maquina-medicion">
                            <label>PUNTO</label>
                            <strong>${desafio.seleccion || "NINGUNO"}</strong>
                        </div>
                        <div class="maquina-medicion">
                            <label>VOLTAJE</label>
                            <strong>${desafio.seleccion ? `${desafio.puntos[desafio.seleccion]} V` : "--"}</strong>
                        </div>
                    </div>
                    <span class="maquina-label">MEDICIONES</span>
                    <div class="maquina-mediciones-lista">${mediciones}</div>
                    <span class="maquina-label">CONTROLES</span>
                    <div class="maquina-controles">
                        <button type="button" class="maquina-boton-accion" ${desafio.resuelto ? "disabled" : ""} onclick="aislarFallaB()">Aislar falla</button>
                        ${accionApagar}
                    </div>
                </aside>
            </div>
            ${renderizarEstadoMaquina(estadoMensaje, desafio.mensaje, desafio.submensaje)}
        </div>
    `;
}

// Versión 3: controles reversibles con efectos secundarios ocultos. Las partidas con una versión
// anterior sin resolver se reinician.
const VERSION_DESAFIO_D = 3;

// Cada control mueve 10 su variable principal y 5 otras dos. "+" aplica el efecto y "−" lo revierte,
// así que cualquier estado puede volver a la zona segura (verificado: los 194.481 estados de la grilla
// de 5 en 5 tienen solución; desde el inicio hacen falta al menos 10 clics usando los 4 controles).
// Al jugador solo se le muestra el efecto principal; los secundarios los descubre observando.
const CONTROLES_D = {
    ventilacion: {
        nombre: "Ventilación",
        detalle: "+ enfría el sistema.",
        efecto: { temperatura: -10, presion: 5, flujo: -5 }
    },
    bomba: {
        nombre: "Bomba",
        detalle: "+ aumenta el flujo.",
        efecto: { flujo: 10, temperatura: 5, presion: -5 }
    },
    carga: {
        nombre: "Carga",
        detalle: "+ aumenta la carga.",
        efecto: { carga: 10, flujo: -5, temperatura: 5 }
    },
    alivio: {
        nombre: "Válvula de alivio",
        detalle: "+ libera presión.",
        efecto: { presion: -10, carga: 5, flujo: 5 }
    }
};

function crearDesafioD() {
    return {
        version: VERSION_DESAFIO_D,
        temperatura: 80,
        presion: 25,
        flujo: 20,
        carga: 80,
        zonaSegura: { temperatura: [40, 55], presion: [45, 60], flujo: [40, 55], carga: [45, 60] },
        mensaje: "Ajustá las variables para volver al margen seguro.",
        resuelto: false
    };
}

function obtenerDesafioD() {
    const estado = obtenerEstadoMaquina("D");

    if (estado.desafio && estado.desafio.version !== VERSION_DESAFIO_D && !estado.desafio.resuelto) {
        estado.desafio = null;
    }

    estado.desafio ??= crearDesafioD();

    return estado.desafio;
}

function aplicarAccionD(accion, sentido = 1) {
    const desafio = obtenerDesafioD();
    const control = CONTROLES_D[accion];

    if (!control) {
        return;
    }

    const signo = sentido < 0 ? -1 : 1;

    Object.entries(control.efecto).forEach(([variable, delta]) => {
        desafio[variable] = Math.max(0, Math.min(100, Number(desafio[variable]) + signo * delta));
    });

    const fueraDeZona = Object.keys(desafio.zonaSegura).some(variable => {
        const valor = desafio[variable];
        const [min, max] = desafio.zonaSegura[variable];
        return valor < min || valor > max;
    });

    if (fueraDeZona) {
        desafio.mensaje = "Sistema fuera de rango. Se requiere estabilización.";
        desafio.resuelto = false;
    } else {
        desafio.mensaje = "SISTEMA SEGURO";
        desafio.resuelto = true;
        guardarResultadoMaquina("D", { resuelta: true, desafio });
    }

    renderizarPanelMaquina();
}

function renderizarDesafioD() {
    const desafio = obtenerDesafioD();
    const estado = obtenerEstadoMaquina("D");

    if (estado.apagada) {
        return renderizarMaquinaApagada("D", "El sistema de seguridad está inactivo.");
    }

    const variables = Object.entries({
        temperatura: desafio.temperatura,
        presion: desafio.presion,
        flujo: desafio.flujo,
        carga: desafio.carga
    }).map(([nombre, valor]) => {
        const [min, max] = desafio.zonaSegura[nombre];
        const seguro = valor >= min && valor <= max;
        return `
            <div class="maquina-variable-card ${seguro ? "segura" : "fuera"}">
                <div class="maquina-card-header">
                    <span>${nombre.toUpperCase()}</span>
                    <span class="maquina-badge-estado ${seguro ? "seguro" : "fuera"}">${seguro ? "SEGURO" : "FUERA"}</span>
                </div>
                <div class="maquina-safebox">Zona segura: ${min}–${max}</div>
                <strong>${valor}</strong>
                <div class="maquina-meter">
                    <div class="maquina-meter-fill" style="width:${Math.max(0, Math.min(100, valor))}%; background:${seguro ? "#7fe0a8" : "#e0766b"};"></div>
                </div>
            </div>
        `;
    }).join("");

    const accionApagar = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion principal" onclick="apagarMaquina('D')">Apagar D</button>`
        : "";

    const controles = Object.entries(CONTROLES_D).map(([clave, control]) => `
        <div class="maquina-control-doble">
            <span class="maquina-control-nombre">${control.nombre}</span>
            <span class="maquina-control-detalle">${control.detalle}</span>
            <div class="maquina-control-botones">
                <button type="button" class="maquina-boton-accion" aria-label="${control.nombre} menos" onclick="aplicarAccionD('${clave}', -1)">−</button>
                <button type="button" class="maquina-boton-accion" aria-label="${control.nombre} más" onclick="aplicarAccionD('${clave}', 1)">+</button>
            </div>
        </div>
    `).join("");

    return `
        ${estiloMaquinas()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("D")}
            ${renderizarFichaMaquina(
                "Estabilizá todas las variables dentro de sus límites seguros.",
                [
                    "El sistema controla cuatro parámetros y cada uno tiene su propia zona segura.",
                    "Cada control cambia mucho una variable, pero también altera un poco otras dos.",
                    "El botón + aplica el efecto y el botón − hace lo contrario, así que cualquier ajuste se puede deshacer.",
                    "Observá qué más cambia con cada control antes de corregir."
                ]
            )}
            <div class="maquina-cuerpo horizontal">
                <section class="maquina-tablero">
                    <span class="maquina-label">ESTADO DEL SISTEMA</span>
                    <div class="maquina-grid-estado">${variables}</div>
                </section>
                <aside class="maquina-zona-controles">
                    <span class="maquina-label">CONTROLES</span>
                    <div class="maquina-controles">
                        ${controles}
                        ${accionApagar}
                    </div>
                </aside>
            </div>
            ${renderizarEstadoMaquina(desafio.resuelto ? "estable" : "alerta", desafio.mensaje)}
        </div>
    `;
}

function obtenerDesafioA() {
    const estado = obtenerEstadoMaquina("A");
    estado.desafio ??= {
        preparado: false,
        mensaje: "Sistema central listo para corte."
    };

    return estado.desafio;
}

function renderizarDesafioA() {
    const estado = obtenerEstadoMaquina("A");
    const preparado = comprobarPreparacionCentral();
    const ids = ["B", "C", "D", "E"];

    const lista = ids.map(id => {
        const estadoMaquina = obtenerEstadoMaquina(id);
        const activo = estadoMaquina && estadoMaquina.apagada ? "APAGADA" : "ENCENDIDA";
        return `
            <div class="maquina-status-item ${activo === "APAGADA" ? "apagada" : ""}">
                <span>Máquina ${id}</span>
                <strong>${activo}</strong>
            </div>
        `;
    }).join("");

    const centralDisponible = preparado && !estado.apagada;

    return `
        ${estiloMaquinas()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("A")}
            ${renderizarFichaMaquina(
                "Prepará el sistema para realizar el corte final.",
                [
                    "Esta máquina controla la alimentación principal de la fábrica.",
                    "No puede apagarse mientras alguna máquina dependiente continúe funcionando."
                ]
            )}
            <div class="maquina-cuerpo horizontal">
                <section class="maquina-tablero">
                    <span class="maquina-label">ESTADO DEL SISTEMA</span>
                    <div class="maquina-diagrama"><div><strong>A</strong></div><div>├── <strong>B</strong></div><div>│   └── <strong>C</strong></div><div>└── <strong>D</strong></div><div>    └── <strong>E</strong></div></div>
                    <div class="maquina-status-lista">${lista}</div>
                </section>
                <aside class="maquina-zona-controles">
                    <span class="maquina-label">CONTROLES</span>
                    <div class="maquina-controles">
                        <button type="button" class="maquina-boton-accion principal" ${centralDisponible ? "" : "disabled"} onclick="apagarMaquina('A')">Cortar alimentación</button>
                    </div>
                </aside>
            </div>
            ${renderizarEstadoMaquina(
                centralDisponible ? "estable" : "proceso",
                centralDisponible ? "SISTEMA PREPARADO" : "Se requieren B, C, D y E apagadas para habilitar el corte final."
            )}
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

function cerrarMenuMaquinasConEscape(evento) {
    if (maquinaPanelAbierto && evento.key === "Escape") {
        evento.preventDefault();
        cerrarPanelMaquina();
    }
}

document.addEventListener("keydown", cerrarMenuMaquinasConEscape);

window.cambiarPresionMaquinaC = cambianPresionesC;
window.diagnosticarComponenteE = diagnosticarComponenteE;
window.medirPuntoB = medirPuntoB;
window.aislarFallaB = aislarFallaB;
window.aplicarAccionD = aplicarAccionD;
window.apagarMaquina = apagarMaquina;
window.cerrarPanelMaquina = cerrarPanelMaquina;
window.abrirPanelMaquina = abrirPanelMaquina;
