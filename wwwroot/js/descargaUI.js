// =========================================================
// PANEL DE DESCARGA - SALA DE ELECTRICIDAD (INTERFAZ)
// =========================================================

let panelDescargaAbierto = false;
let panelDescargaConstruido = false;
let panelDescargaFinalizando = false;
let arrastreDescarga = null;

const UMBRAL_ARRASTRE_DESCARGA = 6;
const DEMORA_CIERRE_DESCARGA = 3500;

// Ángulo visual acumulado de cada pieza, para que el giro 270 -> 0 siga en sentido horario.
const angulosVisualesDescarga = {};

// Dibujo de cada tipo con rotación 0 (viewBox 100 x 100).
const TRAZOS_PIEZAS_DESCARGA = {
    recto: "M0 50 H100",
    curva: "M50 0 V34 Q50 50 66 50 H100",
    T: "M0 50 H100 M50 0 V50"
};

const PUNTOS_CONECTOR_DESCARGA = {
    top: [50, 9],
    right: [91, 50],
    bottom: [50, 91],
    left: [9, 50]
};


// =========================================================
// CONSTRUIR PANEL
// =========================================================

function crearSvgPiezaDescarga(tipo) {
    const trazo = TRAZOS_PIEZAS_DESCARGA[tipo];

    const conectores = (CONECTORES_BASE_DESCARGA[tipo] || [])
        .map(lado => {
            const [x, y] = PUNTOS_CONECTOR_DESCARGA[lado];
            return `<circle class="pieza-conector" cx="${x}" cy="${y}" r="7"></circle>`;
        })
        .join("");

    const nucleo = tipo === "T"
        ? `<circle class="pieza-conector pieza-nucleo" cx="50" cy="50" r="9"></circle>`
        : "";

    return `
        <svg class="pieza-svg" viewBox="0 0 100 100" aria-hidden="true">
            <rect class="pieza-base" x="3" y="3" width="94" height="94" rx="9"></rect>
            <path class="pieza-funda" d="${trazo}"></path>
            <path class="pieza-cable" d="${trazo}"></path>
            <path class="pieza-flujo" d="${trazo}"></path>
            ${nucleo}
            ${conectores}
        </svg>
    `;
}

function crearElementoPiezaDescarga(pieza) {
    const elemento = document.createElement("div");

    elemento.className = "piezaCircuito";
    elemento.dataset.id = pieza.id;
    elemento.dataset.tipo = pieza.tipo;
    elemento.dataset.rotacion = String(pieza.rotacion);
    elemento.setAttribute("aria-label", `Tramo ${pieza.id}`);
    elemento.innerHTML = `
        <span class="pieza-etiqueta">${pieza.id}</span>
        ${crearSvgPiezaDescarga(pieza.tipo)}
    `;

    return elemento;
}

function construirPanelDescarga() {
    const panel = document.getElementById("panelDescarga");
    const tablero = document.getElementById("tableroCircuito");
    const bandeja = document.getElementById("bandejaPiezas");
    const fuente = document.getElementById("fuenteEnergia");
    const descarga = document.getElementById("descargaEnergia");

    if (!panel || !tablero || !bandeja || !fuente || !descarga) {
        return false;
    }

    tablero.innerHTML = "";
    bandeja.innerHTML = "";

    for (let fila = 0; fila < FILAS_DESCARGA; fila++) {
        for (let columna = 0; columna < COLUMNAS_DESCARGA; columna++) {
            const celda = obtenerCeldaDescarga(fila, columna);
            const elemento = document.createElement("div");

            elemento.className = "celdaCircuito";
            elemento.dataset.fila = String(fila);
            elemento.dataset.columna = String(columna);

            celda.elemento = elemento;
            tablero.appendChild(elemento);
        }
    }

    piezasDescarga.forEach(pieza => {
        const hueco = document.createElement("div");

        hueco.className = "hueco-bandeja";
        hueco.dataset.id = pieza.id;
        hueco.appendChild(crearElementoPiezaDescarga(pieza));

        bandeja.appendChild(hueco);
    });

    // FUENTE y DESCARGA quedan alineadas con la columna de su celda de conexión.
    fuente.style.gridColumn = String(FUENTE_DESCARGA.columna + 1);
    descarga.style.gridColumn = String(SALIDA_DESCARGA.columna + 1);

    panel.style.setProperty("--columnas-descarga", String(COLUMNAS_DESCARGA));
    panel.style.setProperty("--filas-descarga", String(FILAS_DESCARGA));

    panel.addEventListener("pointerdown", iniciarArrastreDescarga);
    document.getElementById("cerrarDescarga")?.addEventListener("click", cerrarPanelDescarga);

    panelDescargaConstruido = true;
    return true;
}


// =========================================================
// ABRIR / CERRAR
// =========================================================

function limpiarTeclasDescarga() {
    Object.keys(teclas).forEach(tecla => {
        teclas[tecla] = false;
    });
}

function abrirPanelDescarga() {
    const menu = document.getElementById("menuDescarga");

    if (!menu) {
        return;
    }

    if (piezasDescarga.length === 0) {
        inicializarPuzzleDescarga();
    }

    if (!panelDescargaConstruido && !construirPanelDescarga()) {
        return;
    }

    reproducirEfecto("interactuar");
    panelDescargaAbierto = true;
    mostrarIndicadorPanelDescarga = false;
    limpiarTeclasDescarga();

    menu.style.display = "flex";
    menu.setAttribute("aria-hidden", "false");

    renderizarPiezasDescarga();
    actualizarRedDescarga();
}

function cerrarPanelDescarga() {
    const menu = document.getElementById("menuDescarga");

    cancelarArrastreDescarga();

    panelDescargaAbierto = false;
    limpiarTeclasDescarga();

    if (menu) {
        menu.style.display = "none";
        menu.setAttribute("aria-hidden", "true");
    }
}


// =========================================================
// RENDER
// =========================================================

function obtenerElementoPiezaDescarga(id) {
    return document.querySelector(`#panelDescarga .piezaCircuito[data-id="${id}"]`);
}

function renderizarPiezasDescarga() {
    piezasDescarga.forEach(pieza => {
        const elemento = obtenerElementoPiezaDescarga(pieza.id);

        if (!elemento) {
            return;
        }

        const destino = pieza.colocada
            ? obtenerCeldaDescarga(pieza.posicionFila, pieza.posicionColumna)?.elemento
            : document.querySelector(`#bandejaPiezas .hueco-bandeja[data-id="${pieza.id}"]`);

        if (destino && elemento.parentElement !== destino) {
            destino.appendChild(elemento);
        }

        const angulo = angulosVisualesDescarga[pieza.id] ?? pieza.rotacion;
        const svg = elemento.querySelector(".pieza-svg");

        if (svg) {
            svg.style.transform = `rotate(${angulo}deg)`;
        }

        elemento.dataset.rotacion = String(pieza.rotacion);
        elemento.classList.toggle("colocada", pieza.colocada);
    });

    celdasDescarga.flat().forEach(celda => {
        celda.elemento?.classList.toggle("ocupada", Boolean(celda.pieza));
    });
}

function mostrarEstadoCircuito(red) {
    const estado = document.getElementById("estadoCircuito");

    if (!estado) {
        return;
    }

    estado.dataset.estado = red.estado;

    if (red.resuelto) {
        estado.innerHTML = `
            <strong>✓ DESCARGA ESTABLE</strong>
            <span>ENERGÍA RESIDUAL: 0</span>
            <span>CONEXIÓN CON EL FRAGMENTO: CORTADA</span>
        `;
        return;
    }

    estado.textContent = red.texto;
}

function actualizarRedDescarga() {
    const red = calcularRed();

    piezasDescarga.forEach(pieza => {
        obtenerElementoPiezaDescarga(pieza.id)
            ?.classList.toggle("energizada", red.energizadas.has(pieza.id));
    });

    document.getElementById("descargaEnergia")
        ?.classList.toggle("alcanzada", red.descargaAlcanzada);

    mostrarEstadoCircuito(red);

    if (red.resuelto) {
        finalizarPanelDescarga();
    }

    return red;
}

function finalizarPanelDescarga() {
    if (panelDescargaFinalizando) {
        return;
    }

    panelDescargaFinalizando = true;
    cancelarArrastreDescarga();

    document.getElementById("panelDescarga")?.classList.add("resuelto");
    reproducirEfecto("puzzleCompletado");

    completarDesafioDescarga();

    setTimeout(cerrarPanelDescarga, DEMORA_CIERRE_DESCARGA);
}


// =========================================================
// ARRASTRAR Y ROTAR
// =========================================================

function obtenerDestinoDescarga(x, y) {
    const elemento = document.elementFromPoint(x, y);

    if (!elemento) {
        return null;
    }

    const celda = elemento.closest(".celdaCircuito");

    if (celda) {
        return {
            tipo: "celda",
            fila: Number(celda.dataset.fila),
            columna: Number(celda.dataset.columna),
            elemento: celda
        };
    }

    const bandeja = elemento.closest("#bandejaPiezas");

    if (bandeja) {
        return { tipo: "bandeja", elemento: bandeja };
    }

    return null;
}

function limpiarDestinosDescarga() {
    document
        .querySelectorAll("#panelDescarga .destino-valido, #panelDescarga .destino-ocupado")
        .forEach(elemento => elemento.classList.remove("destino-valido", "destino-ocupado"));
}

function marcarDestinoDescarga(destino, pieza) {
    limpiarDestinosDescarga();

    if (!destino) {
        return;
    }

    if (destino.tipo === "celda") {
        const ocupante = obtenerCeldaDescarga(destino.fila, destino.columna)?.pieza;
        const ocupada = Boolean(ocupante) && ocupante !== pieza;

        destino.elemento.classList.add(ocupada ? "destino-ocupado" : "destino-valido");
        return;
    }

    destino.elemento.classList.add("destino-valido");
}

function iniciarArrastreDescarga(evento) {
    const elemento = evento.target.closest(".piezaCircuito");

    if (!elemento || panelDescargaFinalizando || evento.button !== 0) {
        return;
    }

    const pieza = obtenerPiezaDescarga(elemento.dataset.id);

    if (!pieza) {
        return;
    }

    evento.preventDefault();

    arrastreDescarga = {
        pieza: pieza,
        elemento: elemento,
        inicioX: evento.clientX,
        inicioY: evento.clientY,
        desplazamientoX: 0,
        desplazamientoY: 0,
        activo: false
    };

    window.addEventListener("pointermove", moverArrastreDescarga);
    window.addEventListener("pointerup", soltarArrastreDescarga);
    window.addEventListener("pointercancel", cancelarArrastreDescarga);
}

function moverArrastreDescarga(evento) {
    const arrastre = arrastreDescarga;

    if (!arrastre) {
        return;
    }

    if (!arrastre.activo) {
        const distancia = Math.hypot(
            evento.clientX - arrastre.inicioX,
            evento.clientY - arrastre.inicioY
        );

        if (distancia < UMBRAL_ARRASTRE_DESCARGA) {
            return;
        }

        const rect = arrastre.elemento.getBoundingClientRect();

        arrastre.desplazamientoX = arrastre.inicioX - rect.left;
        arrastre.desplazamientoY = arrastre.inicioY - rect.top;
        arrastre.activo = true;

        arrastre.elemento.style.width = `${rect.width}px`;
        arrastre.elemento.style.height = `${rect.height}px`;
        arrastre.elemento.classList.add("arrastrando");
    }

    arrastre.elemento.style.left = `${evento.clientX - arrastre.desplazamientoX}px`;
    arrastre.elemento.style.top = `${evento.clientY - arrastre.desplazamientoY}px`;

    marcarDestinoDescarga(
        obtenerDestinoDescarga(evento.clientX, evento.clientY),
        arrastre.pieza
    );
}

function terminarArrastreDescarga() {
    window.removeEventListener("pointermove", moverArrastreDescarga);
    window.removeEventListener("pointerup", soltarArrastreDescarga);
    window.removeEventListener("pointercancel", cancelarArrastreDescarga);

    if (arrastreDescarga) {
        const elemento = arrastreDescarga.elemento;

        elemento.classList.remove("arrastrando");
        elemento.style.left = "";
        elemento.style.top = "";
        elemento.style.width = "";
        elemento.style.height = "";
    }

    limpiarDestinosDescarga();
    arrastreDescarga = null;
}

function cancelarArrastreDescarga() {
    terminarArrastreDescarga();
}

function rechazarDestinoDescarga(elemento) {
    if (!elemento) {
        return;
    }

    elemento.classList.remove("rechazo");
    void elemento.offsetWidth;
    elemento.classList.add("rechazo");
}

function soltarArrastreDescarga(evento) {
    const arrastre = arrastreDescarga;

    if (!arrastre) {
        return;
    }

    // Se calcula antes de soltar la pieza, mientras todavía no bloquea el punto.
    const destino = arrastre.activo
        ? obtenerDestinoDescarga(evento.clientX, evento.clientY)
        : null;

    terminarArrastreDescarga();

    const pieza = arrastre.pieza;

    // Un clic sin arrastre rota la pieza (solo si ya está en el tablero).
    if (!arrastre.activo) {
        if (rotarPieza(pieza)) {
            reproducirEfecto("mecanismo");
            angulosVisualesDescarga[pieza.id] =
                (angulosVisualesDescarga[pieza.id] ?? pieza.rotacion - 90) + 90;

            renderizarPiezasDescarga();
            actualizarRedDescarga();
        }
        return;
    }

    if (destino?.tipo === "celda") {
        if (colocarPiezaEnCelda(pieza, destino.fila, destino.columna)) {
            reproducirEfecto("mecanismo");
        } else {
            reproducirEfecto("puzzleError");
            rechazarDestinoDescarga(destino.elemento);
        }
    }
    else if (destino?.tipo === "bandeja") {
        reproducirEfecto("mecanismo");
        devolverPiezaABandeja(pieza);
    }

    renderizarPiezasDescarga();
    actualizarRedDescarga();
}


window.abrirPanelDescarga = abrirPanelDescarga;
window.cerrarPanelDescarga = cerrarPanelDescarga;
