const idsMaquinas = ["A", "B", "C", "D", "E"];

const infoMaquinas = {
    A: {
        titulo: "MÁQUINA A",
        descripcion: "Unidad central",
        explicacion: "El volante de la máquina principal gira tan fuerte que el piso tiembla bajo tus pies. De ella salen los ramales que alimentan al resto de la sala, y en su tablero de latón una hilera de indicadores muestra qué máquinas siguen tomando fuerza."
    },
    B: {
        titulo: "MÁQUINA B",
        descripcion: "Distribución eléctrica",
        explicacion: "El cuadro de distribución zumba y huele a cable recalentado. Cinco cuchillas de cobre idénticas reparten la corriente de la fábrica, pero alguien arrancó las chapas que decían qué alimenta cada una."
    },
    C: {
        titulo: "MÁQUINA C",
        descripcion: "Regulador de presión",
        explicacion: "Las agujas de los manómetros tiemblan y el metal cruje cada vez que la presión sube. El vapor quedó encerrado: para detener el regulador hay que darle salida hacia el condensador por la cañería, sin reventar nada en el camino."
    },
    D: {
        titulo: "MÁQUINA D",
        descripcion: "Sistema de seguridad",
        explicacion: "Una campanilla de alarma suena sin descanso. Esta es la sala de calderas que da vapor a la línea: cuatro calderas en batería, cada una con su tubo de nivel, su manómetro y su válvula de seguridad. El fogonero de guardia no está por ningún lado."
    },
    E: {
        titulo: "MÁQUINA E",
        descripcion: "Transmisión mecánica",
        explicacion: "Una correa de cuero baja del motor hasta tres ejes que deberían llevar la fuerza al telar. El motor ruge, pero los ejes giran en vacío: les faltan las ruedas dentadas."
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
    const mensaje = "La palanca se traba a mitad de recorrido. Algo conectado a esta máquina todavía está tomando fuerza de ella; cortarla ahora podría dañar el sistema.";

    reproducirEfecto("puzzleError");

    if (typeof abrirDialogoMensaje === "function") {
        abrirDialogoMensaje(mensaje);
        return;
    }

    if (typeof alert === "function") {
        alert(mensaje);
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
// DESAFÍOS B, C Y E
// =========================================================
// Igual que D: el jugador observa, interpreta y confirma una decisión. Hay una sola respuesta
// deducible con la información de la propia máquina. Si se equivoca, la máquina no dice qué
// falló y hay que esperar antes de volver a intentar (así no conviene probar al azar).
// Las partidas con versiones anteriores sin resolver se reinician; las resueltas se conservan.

const ESPERA_INTENTO_MAQUINA_MS = 6000;
const esperaIntentoMaquina = { B: 0, C: 0, E: 0 };

function maquinaEnEspera(id) {
    return Date.now() < (esperaIntentoMaquina[id] || 0);
}

function iniciarEsperaMaquina(id, desafio) {
    esperaIntentoMaquina[id] = Date.now() + ESPERA_INTENTO_MAQUINA_MS;

    window.setTimeout(() => {
        if (maquinaActualId === id) {
            desafio.submensaje = "";
            renderizarPanelMaquina();
        }
    }, ESPERA_INTENTO_MAQUINA_MS);
}

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
                font-size: 13px;
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
                font-size: 12px;
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
                padding: 7px 10px;
                background: #121c2a;
                border: 1px solid #405064;
                border-radius: 4px;
                color: #b8c3d0;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 11px;
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
            .maquina-opcion[disabled] {
                cursor: default;
            }
            .maquina-tren {
                display: grid;
                grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
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
            .maquina-par.ok .maquina-par-estado {
                color: #7fe0a8;
            }
            .maquina-par.mal .maquina-par-estado {
                color: #e0766b;
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
            .maquina-marca-tiza {
                color: #e9e4d6;
                font-family: "Comic Sans MS", "Segoe Print", cursive;
                font-size: 13px;
                text-align: center;
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
// La caldera empuja vapor a 9 atm. Hay que abrir un único recorrido hasta el condensador:
//   - ningún caño puede recibir más presión que la de su prueba;
//   - la reductora entrega 4 atm, reciba lo que reciba;
//   - el caño que pierde (colector inferior -> condensador) no se abre;
//   - no puede quedar ningún tramo abierto sin salida.
// Única solución: V1 (caldera -> colector superior), V4 (colector superior -> reductora),
// V5 (reductora -> condensador). Las trampas: V3 es el camino corto pero su prueba es de 6 atm;
// V6 lleva directo pero es el caño que pierde; V7 llega a la reductora con 9 atm en un caño de 6.
const VERSION_DESAFIO_C = 2;
const PRESION_CALDERA_C = 9;

const NODOS_C = {
    caldera: { nombre: "Caldera", nota: "empuja a 9 atm", x: 50, y: 120 },
    superior: { nombre: "Colector superior", x: 185, y: 45 },
    inferior: { nombre: "Colector inferior", x: 185, y: 195 },
    reductora: { nombre: "Reductora", nota: "sale a 4 atm", x: 345, y: 45 },
    condensador: { nombre: "Condensador", x: 500, y: 120 }
};

const VALVULAS_C = [
    { id: "V1", desde: "caldera", hasta: "superior", prueba: 12 },
    { id: "V2", desde: "caldera", hasta: "inferior", prueba: 12 },
    { id: "V3", desde: "superior", hasta: "condensador", prueba: 6 },
    { id: "V4", desde: "superior", hasta: "reductora", prueba: 12 },
    { id: "V5", desde: "reductora", hasta: "condensador", prueba: 5 },
    { id: "V6", desde: "inferior", hasta: "condensador", prueba: 12 },
    { id: "V7", desde: "inferior", hasta: "reductora", prueba: 6 }
];

const SOLUCION_C = ["V1", "V4", "V5"];

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

    if (desafio.resuelto || maquinaEnEspera("C")) {
        return;
    }

    const abiertas = VALVULAS_C.filter(valvula => desafio.abiertas[valvula.id]).map(valvula => valvula.id);

    if (abiertas.length === 0) {
        return;
    }

    const correcta = abiertas.length === SOLUCION_C.length && SOLUCION_C.every(id => abiertas.includes(id));

    if (correcta) {
        reproducirEfecto("puzzleCompletado");
        desafio.resuelto = true;
        desafio.mensaje = "EL VAPOR CORRE HACIA EL CONDENSADOR";
        desafio.submensaje = "Las agujas bajan despacio hasta asentarse.";
        guardarResultadoMaquina("C", { resuelta: true, desafio });
        renderizarPanelMaquina();
        return;
    }

    reproducirEfecto("puzzleError");
    desafio.abiertas = {};
    desafio.mensaje = "Un golpe de vapor sacude la cañería y el regulador cierra todas las válvulas de un portazo.";
    desafio.submensaje = "Hay que esperar a que la presión vuelva a asentarse...";
    iniciarEsperaMaquina("C", desafio);
    renderizarPanelMaquina();
}

function renderizarEsquemaC(desafio) {
    const tramos = VALVULAS_C.map(valvula => {
        const a = NODOS_C[valvula.desde];
        const b = NODOS_C[valvula.hasta];
        const abierta = Boolean(desafio.abiertas[valvula.id]);
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        return `
            <line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${abierta ? "#e3bb68" : "#4a5663"}" stroke-width="${abierta ? 7 : 5}" stroke-linecap="round" />
            <g>
                <rect x="${mx - 38}" y="${my - 17}" width="76" height="34" rx="4" fill="#0a111c" stroke="${abierta ? "#ffd766" : "#5a6b7d"}" />
                <text x="${mx}" y="${my - 2}" text-anchor="middle" fill="#fff2c8" font-size="12" font-weight="bold">${valvula.id}</text>
                <text x="${mx}" y="${my + 12}" text-anchor="middle" fill="#b8c3d0" font-size="10">prueba ${valvula.prueba} atm</text>
            </g>
        `;
    }).join("");

    const nodos = Object.values(NODOS_C).map(nodo => `
        <circle cx="${nodo.x}" cy="${nodo.y}" r="15" fill="#2a200b" stroke="#b08a45" stroke-width="2" />
        <text x="${nodo.x}" y="${nodo.y + (nodo.y < 120 ? -22 : 34)}" text-anchor="middle" fill="#e9d28f" font-size="12">${nodo.nombre}</text>
        ${nodo.nota ? `<text x="${nodo.x}" y="${nodo.y + (nodo.y < 120 ? -36 : 48)}" text-anchor="middle" fill="#ffd766" font-size="11" font-weight="bold">${nodo.nota}</text>` : ""}
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
    const enEspera = maquinaEnEspera("C");

    const valvulas = VALVULAS_C.map(valvula => `
        <button type="button" class="maquina-opcion ${desafio.abiertas[valvula.id] ? "elegida" : ""}" ${desafio.resuelto || enEspera ? "disabled" : ""} onclick="alternarValvulaC('${valvula.id}')">
            ${valvula.id} · ${desafio.abiertas[valvula.id] ? "ABIERTA" : "CERRADA"}
        </button>
    `).join("");

    const accion = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion principal" onclick="apagarMaquina('C')">Apagar C</button>`
        : `<button type="button" class="maquina-boton-accion principal" ${hayAbiertas && !enEspera ? "" : "disabled"} onclick="abrirPasoC()">Soltar el vapor</button>`;

    return `
        ${estiloMaquinas()}
        ${estiloDesafiosBCE()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("C")}
            ${renderizarFichaMaquina(
                `El vapor sale de la caldera a ${PRESION_CALDERA_C} atm y conserva esa fuerza por toda la cañería: recorrer caños no la baja. Lo único que la baja es la válvula reductora: le entre lo que le entre, todo lo que sale de ella va a 4 atm. Ningún caño debe recibir más presión que la de su prueba. Un caño que pierde no se abre. Todo tramo abierto tiene que llevar el vapor hasta el condensador: un tramo abierto sin salida es una bomba.`,
                [
                    "Cada caño tiene grabada la presión con la que fue probado en el taller.",
                    "Hay un siseo constante y el fieltro del aislante chorrea en la bajada que une el colector inferior con el condensador.",
                    "Las válvulas de paso están numeradas sobre el esquema pintado en la pared."
                ],
                { objetivo: "PLACA DEL REGULADOR", detalle: "LO QUE OBSERVÁS" }
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
// MÁQUINA E — TREN DE ENGRANAJES
// =========================================================
// Hay que montar tres ruedas (motor, intermedio, salida) sacadas de un cajón, una de cada una.
//   - Marcas de tiza: las ruedas motor + intermedio deben sumar 54 dientes; intermedio + salida, 66.
//   - La intermedia no cambia la velocidad. Salida = motor (240) × dientes motor ÷ dientes salida.
//   - El telar pide 120 vueltas por minuto.
// Única solución: 12 – 42 – 24. Las otras combinaciones que respetan las marcas de tiza dan
// 144, 160, 171 o 180 vueltas.
const VERSION_DESAFIO_E = 2;
const RUEDAS_E = [12, 18, 24, 30, 36, 42, 48];
const EJES_E = [
    { clave: "motor", nombre: "EJE DEL MOTOR" },
    { clave: "intermedio", nombre: "EJE INTERMEDIO" },
    { clave: "salida", nombre: "EJE DE SALIDA" }
];
const SOLUCION_E = { motor: 12, intermedio: 42, salida: 24 };

function crearDesafioE() {
    return {
        version: VERSION_DESAFIO_E,
        ruedas: {},
        mensaje: "El telar está quieto: los ejes de la transmisión no tienen ruedas.",
        submensaje: "",
        resuelto: false
    };
}

function obtenerDesafioE() {
    return obtenerDesafioVersionado("E", VERSION_DESAFIO_E, crearDesafioE, desafio => {
        desafio.ruedas = { ...SOLUCION_E };
        desafio.mensaje = "EL TELAR RETOMA SU MARCHA";
    });
}

function elegirRuedaE(eje, dientes) {
    const desafio = obtenerDesafioE();
    const valor = Number(dientes);

    if (desafio.resuelto || !EJES_E.some(item => item.clave === eje)) {
        return;
    }

    reproducirEfecto("mecanismo");

    // Cada rueda existe una sola vez: si ya estaba en otro eje, vuelve al cajón.
    EJES_E.forEach(item => {
        if (item.clave !== eje && desafio.ruedas[item.clave] === valor) {
            delete desafio.ruedas[item.clave];
        }
    });

    if (RUEDAS_E.includes(valor)) {
        desafio.ruedas[eje] = valor;
    } else {
        delete desafio.ruedas[eje];
    }

    renderizarPanelMaquina();
}

function arrancarTransmisionE() {
    const desafio = obtenerDesafioE();

    if (desafio.resuelto || maquinaEnEspera("E")) {
        return;
    }

    if (!EJES_E.every(item => desafio.ruedas[item.clave])) {
        return;
    }

    const correcta = EJES_E.every(item => desafio.ruedas[item.clave] === SOLUCION_E[item.clave]);

    if (correcta) {
        reproducirEfecto("puzzleCompletado");
        desafio.resuelto = true;
        desafio.mensaje = "EL TELAR RETOMA SU MARCHA";
        desafio.submensaje = "Las lanzaderas vuelven a cruzar a buen ritmo.";
        guardarResultadoMaquina("E", { resuelta: true, desafio });
        renderizarPanelMaquina();
        return;
    }

    reproducirEfecto("puzzleError");
    desafio.mensaje = "Las ruedas crujen, la correa patina y el motor se ahoga. Hay que parar antes de que salte un diente.";
    desafio.submensaje = "La transmisión tarda en volver a quedar quieta...";
    iniciarEsperaMaquina("E", desafio);
    renderizarPanelMaquina();
}

function renderizarDesafioE() {
    const desafio = obtenerDesafioE();
    const estado = obtenerEstadoMaquina("E");

    if (estado.apagada) {
        return renderizarMaquinaApagada("E", "Las correas quedaron flojas y los engranajes, quietos.");
    }

    const enEspera = maquinaEnEspera("E");
    const completa = EJES_E.every(item => desafio.ruedas[item.clave]);

    // Entre cada par de ejes vecinos se ve enseguida si las ruedas engranan (suman lo que marca la tiza).
    const renderizarPar = (claveA, claveB, marca) => {
        const a = desafio.ruedas[claveA];
        const b = desafio.ruedas[claveB];
        let texto = "esperando ruedas";
        let clase = "";

        if (a && b) {
            const suma = a + b;
            texto = suma === marca ? "✓ engranan" : suma < marca ? "no llegan a tocarse" : "no entran: se trancan";
            clase = suma === marca ? "ok" : "mal";
        }

        return `
            <div class="maquina-par ${clase}">
                <span class="maquina-marca-tiza">tiza: ${marca}</span>
                <span class="maquina-par-flecha">⟷</span>
                <span class="maquina-par-estado">${texto}</span>
            </div>
        `;
    };

    const ejes = EJES_E.map((item, indice) => {
        const actual = desafio.ruedas[item.clave];
        const opciones = [`<option value="">— vacío —</option>`]
            .concat(RUEDAS_E.map(dientes => `<option value="${dientes}" ${actual === dientes ? "selected" : ""}>Rueda de ${dientes} dientes</option>`))
            .join("");
        const par = indice === 0 ? renderizarPar("motor", "intermedio", 54)
            : indice === 1 ? renderizarPar("intermedio", "salida", 66)
            : "";
        return `
            <div class="maquina-eje">
                <span class="maquina-eje-titulo">${item.nombre}</span>
                <span class="maquina-eje-rueda">${actual ? `${actual} dientes` : "sin rueda"}</span>
                ${indice === 0 ? `<span class="maquina-safebox">Tacómetro: 240 vueltas/min</span>` : ""}
                ${indice === 2 ? `<span class="maquina-safebox">Acoplado al telar</span>` : ""}
                <select class="maquina-selector" ${desafio.resuelto || enEspera ? "disabled" : ""} onchange="elegirRuedaE('${item.clave}', this.value)">${opciones}</select>
            </div>
            ${par}
        `;
    }).join("");

    const accion = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion principal" onclick="apagarMaquina('E')">Apagar E</button>`
        : `<button type="button" class="maquina-boton-accion principal" ${completa && !enEspera ? "" : "disabled"} onclick="arrancarTransmisionE()">Soltar el freno y arrancar</button>`;

    return `
        ${estiloMaquinas()}
        ${estiloDesafiosBCE()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("E")}
            ${renderizarFichaMaquina(
                "Telar mecánico n.º 3 — trabaja a 120 vueltas por minuto. Más rápido rompe los hilos; más lento no teje.",
                [
                    "Tres ejes en fila llevan el giro: <b>motor → intermedio → salida</b>. Alguien desmontó las ruedas para engrasarlas y las dejó en el cajón, una de cada tamaño. Cada eje lleva una.",
                    "Entre cada par de ejes vecinos, el montador anotó con tiza cuántos dientes tienen que <b>sumar las dos ruedas</b> para engranar: si suman menos no llegan a tocarse y si suman más no entran.",
                    "Regla escrita en la tapa del cajón: «La rueda del medio no cambia la velocidad, solo pasa el giro. <b>Vueltas de la salida = 240 × dientes de la rueda del motor ÷ dientes de la rueda de salida.</b> Por ejemplo: con 12 en el motor y 48 en la salida, 240 × 12 ÷ 48 = 60 vueltas»."
                ],
                { objetivo: "PLACA DEL TELAR", detalle: "EN EL BANCO DEL MONTADOR" }
            )}
            <section class="maquina-tablero">
                <span class="maquina-label">EJES DE LA TRANSMISIÓN</span>
                <div class="maquina-tren">${ejes}</div>
            </section>
            <div class="maquina-controles">${accion}</div>
            ${renderizarEstadoMaquina(desafio.resuelto ? "estable" : "alerta", desafio.mensaje, desafio.submensaje)}
        </div>
    `;
}


// =========================================================
// MÁQUINA B — CUADRO SIN ROTULAR
// =========================================================
// Las chapas de bronce de las cinco cuchillas están en el piso. Con las anotaciones del libro
// de guardia se deduce qué circuito corresponde a cada cuchilla:
//   1. El alumbrado queda inmediatamente a la izquierda de los telares.
//   2. La bomba no está en ninguno de los extremos.
//   3. Entre la fragua y los telares hay exactamente una cuchilla.
//   4. El montacargas está más a la derecha que la bomba.
//   5. La fragua no está al lado de la bomba.
// Única solución: 1 Fragua, 2 Alumbrado, 3 Telares, 4 Bomba, 5 Montacargas.
const VERSION_DESAFIO_B = 2;
const CHAPAS_B = ["Alumbrado", "Telares", "Bomba de agua", "Montacargas", "Fragua"];
const SOLUCION_B = ["Fragua", "Alumbrado", "Telares", "Bomba de agua", "Montacargas"];

function crearDesafioB() {
    return {
        version: VERSION_DESAFIO_B,
        chapas: [null, null, null, null, null],
        mensaje: "Cinco cuchillas iguales y ninguna chapa: nadie sabe qué corta cada una.",
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

    if (desafio.resuelto || maquinaEnEspera("B")) {
        return;
    }

    if (desafio.chapas.some(chapa => !chapa)) {
        return;
    }

    const correcta = desafio.chapas.every((chapa, i) => chapa === SOLUCION_B[i]);

    if (correcta) {
        reproducirEfecto("puzzleCompletado");
        desafio.resuelto = true;
        desafio.mensaje = "CUADRO ROTULADO";
        desafio.submensaje = "Cada cuchilla vuelve a tener su chapa: ya se puede cortar sin sorpresas.";
        guardarResultadoMaquina("B", { resuelta: true, desafio });
        renderizarPanelMaquina();
        return;
    }

    reproducirEfecto("puzzleError");
    desafio.mensaje = "Probás la primera cuchilla con la chapa puesta… y se apaga otra cosa. Las chapas no coinciden con lo que cortan.";
    desafio.submensaje = "Hay que volver a subir la cuchilla y esperar a que el cuadro se estabilice...";
    iniciarEsperaMaquina("B", desafio);
    renderizarPanelMaquina();
}

// Cada anotación sabe comprobarse contra las chapas puestas. Devuelve null mientras falte
// alguna de las chapas que menciona, para no dar pistas antes de tiempo.
const ANOTACIONES_B = [
    {
        dia: "Lunes",
        texto: "La cuchilla del alumbrado está pegada a la de los telares, justo a su izquierda.",
        usa: ["Alumbrado", "Telares"],
        cumple: p => p.Alumbrado + 1 === p.Telares
    },
    {
        dia: "Martes",
        texto: "La bomba de agua no está ni en la primera ni en la última cuchilla.",
        usa: ["Bomba de agua"],
        cumple: p => p["Bomba de agua"] > 1 && p["Bomba de agua"] < 5
    },
    {
        dia: "Miércoles",
        texto: "Entre la fragua y los telares hay una sola cuchilla en el medio.",
        usa: ["Fragua", "Telares"],
        cumple: p => Math.abs(p.Fragua - p.Telares) === 2
    },
    {
        dia: "Jueves",
        texto: "El montacargas está más a la derecha que la bomba (no hace falta que estén pegados).",
        usa: ["Montacargas", "Bomba de agua"],
        cumple: p => p.Montacargas > p["Bomba de agua"]
    },
    {
        dia: "Viernes",
        texto: "La fragua y la bomba no están una al lado de la otra: se recalentaban juntas y las separamos.",
        usa: ["Fragua", "Bomba de agua"],
        cumple: p => Math.abs(p.Fragua - p["Bomba de agua"]) !== 1
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

    const enEspera = maquinaEnEspera("B");
    const completo = desafio.chapas.every(Boolean);

    const cuchillas = desafio.chapas.map((chapa, indice) => {
        const opciones = [`<option value="">— sin chapa —</option>`]
            .concat(CHAPAS_B.map(nombre => `<option value="${nombre}" ${chapa === nombre ? "selected" : ""}>${nombre}</option>`))
            .join("");
        return `
            <div class="maquina-cuchilla">
                <span class="maquina-eje-titulo">CUCHILLA ${indice + 1}</span>
                <div class="maquina-cuchilla-dibujo" aria-hidden="true"></div>
                <select class="maquina-selector" ${desafio.resuelto || enEspera ? "disabled" : ""} onchange="elegirChapaB(${indice}, this.value)">${opciones}</select>
            </div>
        `;
    }).join("");

    const accion = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion principal" onclick="apagarMaquina('B')">Apagar B</button>`
        : `<button type="button" class="maquina-boton-accion principal" ${completo && !enEspera ? "" : "disabled"} onclick="atornillarChapasB()">Atornillar las chapas</button>`;

    return `
        ${estiloMaquinas()}
        ${estiloDesafiosBCE()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("B")}
            ${renderizarFichaMaquina(
                "«No se corta ninguna cuchilla de un cuadro sin rotular.»",
                [
                    "Las cinco chapas de bronce están en el piso: Alumbrado, Telares, Bomba de agua, Montacargas y Fragua. <b>Cada chapa va en una sola cuchilla.</b>",
                    "Las cuchillas se cuentan <b>de izquierda a derecha</b>: la 1 es la de más a la izquierda y la 5, la de más a la derecha.",
                    "El libro de guardia del electricista tiene cinco anotaciones. Al ir colocando chapas, podés repasar cada una contra el cuadro: <b>tienen que cumplirse las cinco</b>."
                ],
                { objetivo: "REGLA DEL TALLER ELÉCTRICO", detalle: "EN EL PISO Y EN LA PARED" }
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

// Versión 5: la máquina D es la sala de calderas. El jugador inspecciona cuatro calderas, interpreta
// sus instrumentos según el reglamento y firma una orden con una maniobra por caldera.
// Las partidas con una versión anterior sin resolver se reinician; las resueltas se conservan.
const VERSION_DESAFIO_D = 5;

// Si la orden es incorrecta, el capataz no deja volver a firmar hasta que pase este tiempo.
const ESPERA_ORDEN_D_MS = 6000;

const MANIOBRAS_D = {
    alimentarAgua: "Alimentar agua",
    extraerAgua: "Extraer agua",
    retirarFuego: "Retirar el fuego",
    purgaVapor: "Abrir purga de vapor",
    ninguna: "No intervenir"
};

// Lectura fija de cada caldera. Los grifos de prueba están sobre el nivel máximo (alto) y bajo el mínimo (bajo).
// Solución única según el reglamento:
//   1: tubo sin agua, ambos grifos dan vapor -> seca -> retirar el fuego (dar agua la haría estallar).
//   2: tubo sin agua, ambos grifos dan agua -> anegada -> extraer agua.
//   3: nivel normal, presión sobre el timbre, válvula muda -> agarrotada -> purga de vapor a mano.
//   4: nivel normal, presión sobre el timbre, válvula silbando -> está aliviando sola -> no intervenir.
const CALDERAS_D = [
    { id: "1", timbre: 7, presion: 6, tubo: "vacio", valvula: "muda", grifos: { alto: "vapor", bajo: "vapor" }, correcta: "retirarFuego" },
    { id: "2", timbre: 6, presion: 5, tubo: "vacio", valvula: "muda", grifos: { alto: "agua", bajo: "agua" }, correcta: "extraerAgua" },
    { id: "3", timbre: 8, presion: 9, tubo: "medio", valvula: "muda", grifos: { alto: "vapor", bajo: "agua" }, correcta: "purgaVapor" },
    { id: "4", timbre: 6, presion: 7, tubo: "medio", valvula: "silba", grifos: { alto: "vapor", bajo: "agua" }, correcta: "ninguna" }
];

let esperaOrdenDHasta = 0;

function crearDesafioD() {
    return {
        version: VERSION_DESAFIO_D,
        grifos: {},
        maniobras: {},
        mensaje: "La campanilla de alarma no deja de sonar.",
        submensaje: "",
        resuelto: false
    };
}

function obtenerDesafioD() {
    const estado = obtenerEstadoMaquina("D");

    if (estado.desafio && estado.desafio.version !== VERSION_DESAFIO_D) {
        const yaResuelto = Boolean(estado.desafio.resuelto);
        estado.desafio = crearDesafioD();

        if (yaResuelto) {
            CALDERAS_D.forEach(caldera => {
                estado.desafio.maniobras[caldera.id] = caldera.correcta;
            });
            estado.desafio.resuelto = true;
            estado.desafio.mensaje = "LA ALARMA SE SILENCIA";
        }
    }

    estado.desafio ??= crearDesafioD();
    estado.desafio.grifos ??= {};
    estado.desafio.maniobras ??= {};

    return estado.desafio;
}

function abrirGrifoD(idCaldera, grifo) {
    const desafio = obtenerDesafioD();
    const caldera = CALDERAS_D.find(item => item.id === idCaldera);

    if (desafio.resuelto || !caldera || !caldera.grifos[grifo]) {
        return;
    }

    reproducirEfecto("mecanismo");
    desafio.grifos[idCaldera] ??= {};
    desafio.grifos[idCaldera][grifo] = caldera.grifos[grifo];
    desafio.mensaje = caldera.grifos[grifo] === "agua"
        ? `Del grifo ${grifo} de la caldera ${idCaldera} brota un chorro de agua hirviendo.`
        : `Del grifo ${grifo} de la caldera ${idCaldera} escapa un silbido de vapor seco.`;
    desafio.submensaje = "";

    renderizarPanelMaquina();
}

function elegirManiobraD(idCaldera, maniobra) {
    const desafio = obtenerDesafioD();

    if (desafio.resuelto || !MANIOBRAS_D[maniobra]) {
        return;
    }

    reproducirEfecto("mecanismo");
    desafio.maniobras[idCaldera] = maniobra;
    renderizarPanelMaquina();
}

function firmarOrdenD() {
    const desafio = obtenerDesafioD();

    if (desafio.resuelto || Date.now() < esperaOrdenDHasta) {
        return;
    }

    const completa = CALDERAS_D.every(caldera => desafio.maniobras[caldera.id]);

    if (!completa) {
        return;
    }

    const correcta = CALDERAS_D.every(caldera => desafio.maniobras[caldera.id] === caldera.correcta);

    if (correcta) {
        reproducirEfecto("puzzleCompletado");
        desafio.resuelto = true;
        desafio.mensaje = "LA ALARMA SE SILENCIA";
        desafio.submensaje = "Las cuatro calderas vuelven a un régimen seguro.";
        guardarResultadoMaquina("D", { resuelta: true, desafio });
        renderizarPanelMaquina();
        return;
    }

    reproducirEfecto("puzzleError");
    esperaOrdenDHasta = Date.now() + ESPERA_ORDEN_D_MS;
    desafio.mensaje = "El capataz te arranca la orden de las manos: «¿Querés hacernos volar a todos? Eso no es lo que manda el reglamento.»";
    desafio.submensaje = "Las calderas siguen rugiendo mientras vuelve a revisar la sala...";
    renderizarPanelMaquina();

    window.setTimeout(() => {
        if (maquinaActualId === "D") {
            obtenerDesafioD().submensaje = "";
            renderizarPanelMaquina();
        }
    }, ESPERA_ORDEN_D_MS);
}

function renderizarCalderaD(caldera, desafio) {
    const grifosAbiertos = desafio.grifos[caldera.id] || {};
    const elegida = desafio.maniobras[caldera.id];

    const grifos = ["alto", "bajo"].map(grifo => {
        const resultado = grifosAbiertos[grifo];
        const texto = resultado === "agua" ? "sale agua" : resultado === "vapor" ? "sale vapor" : "sin probar";
        return `
            <button type="button" class="maquina-boton-accion" onclick="abrirGrifoD('${caldera.id}', '${grifo}')">
                <span>Grifo ${grifo}</span>
                <strong>${texto}</strong>
            </button>
        `;
    }).join("");

    const maniobras = Object.entries(MANIOBRAS_D).map(([clave, nombre]) => `
        <button type="button" class="maquina-maniobra ${elegida === clave ? "elegida" : ""}" ${desafio.resuelto ? "disabled" : ""} onclick="elegirManiobraD('${caldera.id}', '${clave}')">${nombre}</button>
    `).join("");

    return `
        <div class="maquina-card maquina-caldera">
            <div class="maquina-card-header">
                <span>CALDERA ${caldera.id}</span>
                <span class="maquina-placa-timbre">TIMBRE ${caldera.timbre} ATM</span>
            </div>
            <div class="maquina-caldera-instrumentos">
                <div class="maquina-tubo-nivel" title="Tubo de nivel">
                    <div class="maquina-tubo-agua" style="height:${caldera.tubo === "medio" ? 50 : 0}%;"></div>
                </div>
                <div class="maquina-caldera-lecturas">
                    <div><span>Tubo de nivel</span><strong>${caldera.tubo === "medio" ? "agua a media altura" : "no se ve agua en el cristal"}</strong></div>
                    <div><span>Manómetro</span><strong>${caldera.presion} atm</strong></div>
                    <div><span>Válvula de seguridad</span><strong>${caldera.valvula === "silba" ? "silba, soltando vapor" : "en silencio"}</strong></div>
                </div>
            </div>
            <span class="maquina-label">GRIFOS DE PRUEBA</span>
            <div class="maquina-grifos">${grifos}</div>
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
                min-height: 86px;
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
                font-size: 13px;
                font-weight: normal;
            }
            .maquina-grifos {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 6px;
            }
            .maquina-grifos .maquina-boton-accion {
                padding: 7px 8px;
                font-size: 11px;
            }
            .maquina-maniobras {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }
            .maquina-maniobra {
                padding: 5px 7px;
                background: #121c2a;
                border: 1px solid #405064;
                border-radius: 4px;
                color: #b8c3d0;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 10px;
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
    const enEspera = Date.now() < esperaOrdenDHasta;

    const accion = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion principal" onclick="apagarMaquina('D')">Apagar D</button>`
        : `<button type="button" class="maquina-boton-accion principal" ${ordenCompleta && !enEspera ? "" : "disabled"} onclick="firmarOrdenD()">Firmar la orden de maniobra</button>`;

    return `
        ${estiloMaquinas()}
        ${estiloCalderasD()}
        <div class="maquina-shell">
            ${renderizarCabeceraMaquina("D")}
            ${renderizarFichaMaquina(
                "Sobre la mesa del fogonero quedó la orden del turno en blanco: una línea por caldera, a la espera de una maniobra y una firma. Nadie apaga esta sala sin esa orden.",
                [
                    "<b>I.</b> El agua, antes que nada: mientras el nivel de una caldera no esté en orden, el manómetro y la válvula esperan.",
                    "<b>II.</b> A una caldera seca jamás se le dé agua: la plancha del hogar, al rojo, estallaría. Retírese el fuego.",
                    "<b>III.</b> Una caldera anegada arrastra agua a los cilindros. Extráigase por el grifo del fondo.",
                    "<b>IV.</b> El tubo de nivel engaña: vacía o colmada, la caldera se ve igual en el cristal. Los grifos de prueba no engañan: el alto está sobre el nivel máximo y el bajo, por debajo del mínimo.",
                    "<b>V.</b> Pasado el timbre de su placa, toda caldera debe soplar por su válvula de seguridad. Si sopla, déjesela trabajar. Si calla, está agarrotada: ábrase la purga a mano.",
                    "<b>VI.</b> Lo que está en orden no se toca."
                ],
                { objetivo: "ORDEN DE MANIOBRA", detalle: "REGLAMENTO DE CALDERAS, CLAVADO EN LA PARED" }
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
        const activo = estadoMaquina && estadoMaquina.apagada ? "DETENIDA" : "EN MARCHA";
        return `
            <div class="maquina-status-item ${activo === "DETENIDA" ? "apagada" : ""}">
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
                "La palanca de corte general tiene un seguro de hierro que la mantiene trabada.",
                [
                    "El diagrama remachado junto al tablero muestra cómo se reparte la fuerza: cada máquina se alimenta de la que tiene encima.",
                    "El seguro está conectado a los indicadores: mientras alguno marque una máquina en marcha, no hay forma de moverlo."
                ],
                { objetivo: "TABLERO PRINCIPAL", detalle: "LECTURA DE LOS INDICADORES" }
            )}
            <div class="maquina-cuerpo horizontal">
                <section class="maquina-tablero">
                    <span class="maquina-label">DIAGRAMA E INDICADORES</span>
                    <div class="maquina-diagrama"><div><strong>A</strong></div><div>├── <strong>B</strong></div><div>│   └── <strong>C</strong></div><div>└── <strong>D</strong></div><div>    └── <strong>E</strong></div></div>
                    <div class="maquina-status-lista">${lista}</div>
                </section>
                <aside class="maquina-zona-controles">
                    <span class="maquina-label">PALANCA DE CORTE</span>
                    <div class="maquina-controles">
                        <button type="button" class="maquina-boton-accion principal" ${centralDisponible ? "" : "disabled"} onclick="apagarMaquina('A')">Cortar alimentación</button>
                    </div>
                </aside>
            </div>
            ${renderizarEstadoMaquina(
                centralDisponible ? "estable" : "proceso",
                centralDisponible ? "EL SEGURO CEDE" : "El seguro no se mueve: todavía hay indicadores marcando máquinas en marcha."
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

window.alternarValvulaC = alternarValvulaC;
window.abrirPasoC = abrirPasoC;
window.elegirRuedaE = elegirRuedaE;
window.arrancarTransmisionE = arrancarTransmisionE;
window.elegirChapaB = elegirChapaB;
window.atornillarChapasB = atornillarChapasB;
window.abrirGrifoD = abrirGrifoD;
window.elegirManiobraD = elegirManiobraD;
window.firmarOrdenD = firmarOrdenD;
window.apagarMaquina = apagarMaquina;
window.cerrarPanelMaquina = cerrarPanelMaquina;
window.abrirPanelMaquina = abrirPanelMaquina;
