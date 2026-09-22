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

function renderizarCabeceraMaquina(id) {
    const info = obtenerInfoMaquina(id);
    return `
        <div class="maquina-panel-wrap">
            <div class="maquina-panel-cabecera">
                <span class="maquina-badge">SISTEMA</span>
                <h2>${info.titulo}</h2>
            </div>
            <p class="maquina-subtitulo">${info.descripcion}</p>
            <p class="maquina-instruccion">${info.explicacion}</p>
        </div>
    `;
}

function estiloMaquinas() {
    return `
        <style>
            .maquina-shell {
                display: flex;
                flex-direction: column;
                gap: 16px;
                width: min(100%, 980px);
                color: #f3f7ff;
            }
            .maquina-layout-doble {
                display: grid;
                grid-template-columns: minmax(0, 1.4fr) minmax(240px, 0.8fr);
                gap: 16px;
            }
            .maquina-panel-section {
                background: rgba(13, 20, 35, 0.9);
                border: 1px solid rgba(125, 181, 255, 0.35);
                border-radius: 12px;
                padding: 14px 16px;
                box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);
            }
            .maquina-label {
                font-size: 10px;
                letter-spacing: 0.18em;
                color: #7eb1ff;
                text-transform: uppercase;
                display: block;
                margin-bottom: 8px;
            }
            .maquina-objetivo {
                font-size: 13px;
                line-height: 1.5;
                color: #e5f0ff;
                margin: 0;
            }
            .maquina-como-funciona {
                display: grid;
                gap: 6px;
                font-size: 12px;
                line-height: 1.5;
                color: #cfe3ff;
            }
            .maquina-como-funciona p {
                margin: 0;
            }
            .maquina-grid-estado {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 12px;
            }
            .maquina-card {
                background: rgba(20, 31, 49, 0.9);
                border: 1px solid rgba(144, 198, 255, 0.28);
                border-radius: 10px;
                padding: 12px;
            }
            .maquina-card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                color: #dfeaff;
                font-weight: 700;
                font-size: 12px;
            }
            .maquina-safebox {
                padding: 6px 8px;
                border-radius: 8px;
                background: rgba(94, 164, 255, 0.12);
                border: 1px solid rgba(94, 164, 255, 0.15);
                font-size: 11px;
                color: #b9d8ff;
            }
            .maquina-meter {
                position: relative;
                width: 100%;
                height: 12px;
                border-radius: 999px;
                background: rgba(255,255,255,0.08);
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.08);
                margin-top: 8px;
            }
            .maquina-meter-fill {
                position: absolute;
                inset: 0 auto 0 0;
                border-radius: 999px;
            }
            .maquina-controles {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            .maquina-boton-accion {
                appearance: none;
                border: 1px solid rgba(146, 208, 255, 0.4);
                background: linear-gradient(180deg, rgba(26, 87, 168, 0.8), rgba(15, 39, 66, 0.8));
                color: #f2f7ff;
                border-radius: 8px;
                padding: 9px 12px;
                font-weight: 700;
                cursor: pointer;
                transition: transform 0.12s ease, border-color 0.12s ease;
            }
            .maquina-boton-accion:hover {
                transform: translateY(-1px);
                border-color: rgba(187, 225, 255, 0.9);
            }
            .maquina-boton-accion[disabled] {
                opacity: 0.45;
                cursor: not-allowed;
                transform: none;
            }
            .maquina-circuito {
                display: grid;
                gap: 10px;
            }
            .maquina-linea {
                display: grid;
                grid-template-columns: minmax(100px, 1fr) 64px minmax(100px, 1fr);
                gap: 10px;
                align-items: center;
            }
            .maquina-punto-nodo {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 46px;
                border-radius: 8px;
                border: 1px solid rgba(158, 202, 255, 0.2);
                background: rgba(12, 22, 34, 0.9);
                font-size: 12px;
                color: #dfeeff;
                cursor: pointer;
            }
            .maquina-punto-nodo.activo {
                border-color: #7fe7c1;
                box-shadow: 0 0 0 1px rgba(127, 231, 193, 0.5);
                background: rgba(13, 57, 50, 0.8);
            }
            .maquina-punto-conexion {
                height: 2px;
                background: linear-gradient(90deg, rgba(103, 167, 255, 0.8), rgba(103, 167, 255, 0.2));
                border-radius: 99px;
            }
            .maquina-medicion-box {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
            }
            .maquina-medicion {
                padding: 12px;
                border-radius: 10px;
                border: 1px solid rgba(148, 190, 255, 0.24);
                background: rgba(9, 17, 28, 0.8);
            }
            .maquina-medicion label {
                display: block;
                color: #8bb5f5;
                font-size: 10px;
                letter-spacing: 0.14em;
                text-transform: uppercase;
                margin-bottom: 6px;
            }
            .maquina-medicion strong {
                font-size: 17px;
                color: #f0f5ff;
            }
            .maquina-mediciones-lista {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 8px;
            }
            .maquina-item-valor {
                border: 1px solid rgba(156, 198, 255, 0.24);
                border-radius: 8px;
                background: rgba(14, 24, 37, 0.8);
                padding: 8px 10px;
                font-size: 12px;
                color: #dce9ff;
            }
            .maquina-badge-estado {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 999px;
                font-size: 10px;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                font-weight: 700;
            }
            .maquina-badge-estado.seguro {
                background: rgba(60, 146, 92, 0.2);
                color: #9ae8ba;
                border: 1px solid rgba(60, 146, 92, 0.5);
            }
            .maquina-badge-estado.fuera {
                background: rgba(186, 73, 73, 0.18);
                color: #ffb0a8;
                border: 1px solid rgba(186, 73, 73, 0.45);
            }
            .maquina-estado-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
            }
            .maquina-transmision {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                align-items: center;
                justify-content: center;
            }
            .maquina-transmision-node {
                min-width: 110px;
                padding: 10px 12px;
                border-radius: 10px;
                background: rgba(14, 24, 37, 0.8);
                border: 1px solid rgba(141, 198, 255, 0.22);
                text-align: center;
                font-size: 12px;
            }
            .maquina-transmision-arrow {
                color: #7dc2ff;
                font-size: 20px;
            }
            .maquina-diagrama {
                display: grid;
                gap: 8px;
                color: #dfeeff;
                font-size: 14px;
            }
            .maquina-diagrama .nivel {
                padding-left: 12px;
                border-left: 1px solid rgba(140, 180, 255, 0.3);
            }
            .maquina-diagrama .nivel strong {
                color: #fff;
            }
            .maquina-variable-card {
                display: grid;
                gap: 8px;
                border: 1px solid rgba(159, 204, 255, 0.24);
                border-radius: 10px;
                padding: 12px;
                background: rgba(14, 22, 32, 0.8);
            }
            .maquina-variable-card strong {
                font-size: 22px;
            }
            .maquina-variable-card.fuera {
                border-color: rgba(255, 120, 120, 0.5);
                background: rgba(50, 18, 18, 0.4);
            }
            .maquina-variable-card.segura {
                border-color: rgba(120, 255, 180, 0.45);
                background: rgba(15, 46, 33, 0.55);
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
        <div class="maquina-panel-wrap">
            <div class="maquina-panel-cabecera">
                <span class="maquina-badge">SISTEMA</span>
                <h2>${titulo}</h2>
                <button type="button" class="maquina-cerrar" onclick="cerrarPanelMaquina()">Cerrar</button>
            </div>
            <p class="maquina-subtitulo">${subtitulo}</p>
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
        return `
            ${estiloMaquinas()}
            <div class="maquina-shell">
                <div class="maquina-panel-section">
                    <h3>Máquina C apagada</h3>
                    <p>El sistema de equilibrio está desactivado.</p>
                </div>
            </div>
        `;
    }

    const presiones = Object.entries(desafio.presiones).map(([camara, valor]) => {
        const [min, max] = desafio.zonaSegura[camara];
        const dentro = valor >= min && valor <= max;
        const porcentaje = Math.max(0, Math.min(100, ((valor - min) / (max - min || 1)) * 100));
        return `
            <div class="maquina-card">
                <div class="maquina-card-header">
                    <span>CÁMARA ${camara}</span>
                    <span class="maquina-badge-estado ${dentro ? "seguro" : "fuera"}">${dentro ? "SEGURO" : "FUERA DE RANGO"}</span>
                </div>
                <div class="maquina-safebox">Zona segura: ${min}–${max}</div>
                <div class="maquina-meter">
                    <div class="maquina-meter-fill" style="width:${porcentaje}%; background:${dentro ? "linear-gradient(90deg, #6fe8ad, #b6f7cc)" : "linear-gradient(90deg, #ff8b6f, #ffc28f)"};"></div>
                </div>
                <div class="maquina-estado-row" style="margin-top: 10px;">
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
        ? `<button type="button" class="maquina-boton-accion" onclick="apagarMaquina('C')">Apagar C</button>`
        : "";

    return `
        ${estiloMaquinas()}
        ${renderizarCabeceraMaquina("C")}
        <div class="maquina-shell">
            <div class="maquina-panel-section">
                <span class="maquina-label">OBJETIVO</span>
                <p class="maquina-objetivo">Estabilizá las tres cámaras de presión para poder apagar la máquina.</p>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">¿CÓMO FUNCIONA?</span>
                <div class="maquina-como-funciona">
                    <p>Las tres cámaras están conectadas entre sí.</p>
                    <p>Las válvulas modifican la presión de más de una cámara al mismo tiempo.</p>
                    <p>Observá cómo cambia el sistema después de cada ajuste y mantené todas las cámaras dentro de sus zonas seguras.</p>
                </div>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">ESTADO DEL SISTEMA</span>
                <div class="maquina-grid-estado">${presiones}</div>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">CONTROLES</span>
                <div class="maquina-controles">
                    ${botones.map(boton => `
                        <button type="button" class="maquina-boton-accion" onclick="cambianPresionesC(${boton.numero})">
                            ${boton.label}
                        </button>
                    `).join("")}
                    ${accionApagar}
                </div>
                <p style="margin: 12px 0 0; color: #ddeaff; font-weight: 700;">${desafio.mensaje}</p>
            </div>
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
        return `
            ${estiloMaquinas()}
            <div class="maquina-shell">
                <div class="maquina-panel-section">
                    <h3>Máquina E apagada</h3>
                    <p>La transmisión mecánica está inactiva.</p>
                </div>
            </div>
        `;
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
            <span>${item.label}</span><br>
            <strong>${desafio[item.clave]}</strong>
        </button>
    `).join("");

    const accionApagar = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion" onclick="apagarMaquina('E')">Apagar E</button>`
        : "";

    return `
        ${estiloMaquinas()}
        ${renderizarCabeceraMaquina("E")}
        <div class="maquina-shell">
            <div class="maquina-panel-section">
                <span class="maquina-label">OBJETIVO</span>
                <p class="maquina-objetivo">Localizá la falla de la transmisión y conseguí que el movimiento llegue correctamente a la salida.</p>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">¿CÓMO FUNCIONA?</span>
                <div class="maquina-como-funciona">
                    <p>El motor transmite movimiento a través de varios componentes hasta llegar a la salida.</p>
                    <p>Uno de los componentes presenta una falla.</p>
                    <p>Utilizá los indicadores para seguir el recorrido del movimiento y determinar dónde está el problema.</p>
                </div>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">ESTADO DEL SISTEMA</span>
                <div class="maquina-transmision">
                    ${componentes.map((item, index) => `
                        <div class="maquina-transmision-node">
                            <div>${item.label}</div>
                            <div style="margin-top: 6px; font-size: 11px; color: ${desafio[item.clave] === "OK" ? "#8be8bc" : desafio[item.clave] === "BLOQUEADO" || desafio[item.clave] === "SIN MOVIMIENTO" ? "#ffbf99" : "#ffd87d"};">${desafio[item.clave]}</div>
                        </div>
                        ${index < componentes.length - 1 ? '<div class="maquina-transmision-arrow">→</div>' : ''}
                    `).join("")}
                </div>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">CONTROLES</span>
                <div class="maquina-controles">${lista}${accionApagar}</div>
                <p style="margin: 12px 0 0; color: #ddeaff; font-weight: 700;">${desafio.diagnostico}</p>
            </div>
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
        return `
            ${estiloMaquinas()}
            <div class="maquina-shell">
                <div class="maquina-panel-section">
                    <h3>Máquina B apagada</h3>
                    <p>La línea eléctrica está aislada.</p>
                </div>
            </div>
        `;
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
        ? `<button type="button" class="maquina-boton-accion" onclick="apagarMaquina('B')">Apagar B</button>`
        : "";

    const estadoFalla = desafio.resuelto ? "LISTA PARA APAGAR" : "DETECTADA";

    return `
        ${estiloMaquinas()}
        ${renderizarCabeceraMaquina("B")}
        <div class="maquina-shell">
            <div class="maquina-panel-section">
                <span class="maquina-label">DIAGNÓSTICO DEL CIRCUITO</span>
                <div class="maquina-como-funciona">
                    <p>Fallas aisladas: ${desafio.fallasAisladas} / ${desafio.totalFallas}</p>
                    <p>Falla actual: ${estadoFalla}</p>
                </div>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">OBJETIVO</span>
                <p class="maquina-objetivo">Localizá y aislá cada interrupción del circuito para estabilizar la alimentación.</p>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">¿CÓMO FUNCIONA?</span>
                <div class="maquina-como-funciona">
                    <p>La energía debe circular por cada tramo del circuito sin interrupciones.</p>
                    <p>Utilizá el voltímetro para comprobar cada punto y localizar la zona donde la energía se corta.</p>
                    <p>Cuando identifiques la falla actual, aislá esa sección y espera a que el sistema redistribuya la energía.</p>
                </div>
            </div>
            <div class="maquina-layout-doble">
                <div class="maquina-panel-section">
                    <span class="maquina-label">ESTADO DEL CIRCUITO</span>
                    <div class="maquina-circuito">${circuito}</div>
                </div>
                <div class="maquina-panel-section">
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
                    <div style="margin-top: 12px;">
                        <span class="maquina-label" style="margin-bottom: 8px;">MEDICIONES</span>
                        <div class="maquina-mediciones-lista">${mediciones}</div>
                    </div>
                </div>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">CONTROLES</span>
                <div class="maquina-controles">
                    <button type="button" class="maquina-boton-accion" ${desafio.resuelto ? "disabled" : ""} onclick="aislarFallaB()">Aislar falla</button>
                    ${accionApagar}
                </div>
                <p style="margin: 12px 0 0; color: #ddeaff; font-weight: 700;">${desafio.mensaje}</p>
                <p style="margin: 4px 0 0; color: #b9d4ff;">${desafio.submensaje}</p>
            </div>
        </div>
    `;
}

function obtenerDesafioD() {
    const estado = obtenerEstadoMaquina("D");
    estado.desafio ??= {
        temperatura: 80,
        presion: 28,
        flujo: 76,
        carga: 26,
        zonaSegura: { temperatura: [40, 60], presion: [40, 60], flujo: [40, 60], carga: [40, 60] },
        mensaje: "Ajustá las variables para volver al margen seguro.",
        resuelto: false
    };

    return estado.desafio;
}

function aplicarAccionD(accion) {
    const desafio = obtenerDesafioD();
    const cargaAlta = desafio.carga >= 60;

    const acciones = {
        ventilacion: { temperatura: -12, presion: 10, flujo: -8, carga: 0 },
        bomba: { temperatura: 8, presion: -8, flujo: 14, carga: 0 },
        carga: {
            temperatura: 0,
            presion: cargaAlta ? -10 : 8,
            flujo: cargaAlta ? 8 : -8,
            carga: cargaAlta ? -18 : 18
        }
    };

    const efecto = acciones[accion];
    if (!efecto) {
        return;
    }

    Object.entries(efecto).forEach(([clave, delta]) => {
        const materia = clave === "temperatura" ? "temperatura" : clave === "presion" ? "presion" : clave === "flujo" ? "flujo" : "carga";
        desafio[materia] = Math.max(0, Math.min(100, Number(desafio[materia]) + Number(delta)));
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
        return `
            ${estiloMaquinas()}
            <div class="maquina-shell">
                <div class="maquina-panel-section">
                    <h3>Máquina D apagada</h3>
                    <p>El sistema de seguridad está inactivo.</p>
                </div>
            </div>
        `;
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
            </div>
        `;
    }).join("");

    const accionApagar = desafio.resuelto
        ? `<button type="button" class="maquina-boton-accion" onclick="apagarMaquina('D')">Apagar D</button>`
        : "";

    return `
        ${estiloMaquinas()}
        ${renderizarCabeceraMaquina("D")}
        <div class="maquina-shell">
            <div class="maquina-panel-section">
                <span class="maquina-label">OBJETIVO</span>
                <p class="maquina-objetivo">Estabilizá todas las variables dentro de sus límites seguros.</p>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">¿CÓMO FUNCIONA?</span>
                <div class="maquina-como-funciona">
                    <p>El sistema controla cuatro parámetros.</p>
                    <p>Cada control puede modificar más de una variable.</p>
                    <p>La carga se ajusta según el valor actual: si está alta, la acción la baja; si está baja, la sube.</p>
                    <p>Observá cómo responde el sistema después de cada modificación y mantené todos los valores dentro de sus zonas seguras.</p>
                </div>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">ESTADO DEL SISTEMA</span>
                <div class="maquina-grid-estado">${variables}</div>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">CONTROLES</span>
                <div class="maquina-controles">
                    <button type="button" class="maquina-boton-accion" onclick="aplicarAccionD('ventilacion')">Ventilar</button>
                    <button type="button" class="maquina-boton-accion" onclick="aplicarAccionD('bomba')">Recalibrar bomba</button>
                    <button type="button" class="maquina-boton-accion" onclick="aplicarAccionD('carga')">Ajustar carga</button>
                    ${accionApagar}
                </div>
                <p style="margin: 12px 0 0; color: #ddeaff; font-weight: 700;">${desafio.mensaje}</p>
            </div>
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
            <div class="maquina-status-item" style="display:flex;justify-content:space-between;gap:10px;padding:8px 10px;border:1px solid rgba(146,203,255,0.2);border-radius:8px;">
                <span>Máquina ${id}</span>
                <strong>${activo}</strong>
            </div>
        `;
    }).join("");

    const centralDisponible = preparado && !estado.apagada;

    return `
        ${estiloMaquinas()}
        ${renderizarCabeceraMaquina("A")}
        <div class="maquina-shell">
            <div class="maquina-panel-section">
                <span class="maquina-label">OBJETIVO</span>
                <p class="maquina-objetivo">Prepará el sistema para realizar el corte final.</p>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">¿CÓMO FUNCIONA?</span>
                <div class="maquina-como-funciona">
                    <p>Esta máquina controla la alimentación principal de la fábrica.</p>
                    <p>No puede apagarse mientras alguna máquina dependiente continúe funcionando.</p>
                </div>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">ESTADO DEL SISTEMA</span>
                <div class="maquina-diagrama">
                    <div><strong>A</strong></div>
                    <div class="nivel">├── <strong>B</strong></div>
                    <div class="nivel">│   └── <strong>C</strong></div>
                    <div class="nivel">└── <strong>D</strong></div>
                    <div class="nivel">    └── <strong>E</strong></div>
                </div>
                <div style="margin-top: 12px; display: grid; gap: 8px;">${lista}</div>
            </div>
            <div class="maquina-panel-section">
                <span class="maquina-label">CONTROLES</span>
                <div class="maquina-controles">
                    <button type="button" class="maquina-boton-accion" ${centralDisponible ? "" : "disabled"} onclick="apagarMaquina('A')">Cortar alimentación</button>
                </div>
                <p style="margin: 12px 0 0; color: #ddeaff; font-weight: 700;">${centralDisponible ? "SISTEMA PREPARADO" : "Se requieren B, C, D y E apagadas para habilitar el corte final."}</p>
            </div>
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
