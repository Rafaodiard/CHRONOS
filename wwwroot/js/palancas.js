let palancasMapa = [];
let mostrarIndicadorPalanca = false;
let palancasAbierto = false;
let panelPalancasActual = null;

const estadosPaneles = {};
const objetivosPaneles = {};

function cargarPalancasMapa() {
    palancasMapa = [];

    if (!mapa?.layers) {
        return;
    }

    const capaPalancas = mapa.layers.find(capa => capa.name === "Palancas");

    if (!capaPalancas?.objects) {
        return;
    }

    palancasMapa = capaPalancas.objects
        .filter(objeto => objeto.visible !== false && objeto.properties?.some(propiedad =>
            /^Palanca[1-4]$/.test(propiedad.name)))
        .sort((objetoA, objetoB) => objetoA.id - objetoB.id);

    const estadoGuardadoPalancas = progreso?.palancasEstado || {};

    palancasMapa.forEach(panel => {
        const clave = obtenerClavePanel(panel);
        objetivosPaneles[clave] = [1, 2, 3, 4].map(numero => {
            const propiedad = panel.properties?.find(
                propiedad => propiedad.name === `Palanca${numero}`
            );

            return propiedad?.value === true;
        });

        const estadoGuardado = estadoGuardadoPalancas[clave];
        estadosPaneles[clave] = Array.isArray(estadoGuardado)
            ? estadoGuardado.slice(0, 4)
            : [false, false, false, false];
    });
}

function obtenerClavePanel(panel) {
    return `${rutaMapa}#${panel.id}`;
}

function obtenerPanelCercano() {
    return palancasMapa.find(panel =>
        Math.abs(jugador.x - panel.x) < 52 &&
        Math.abs(jugador.y - panel.y) < 52
    ) || null;
}

function abrirMenuPalancas(panel) {
    const menu = document.getElementById("menuPalancas");

    if (!menu) {
        return;
    }

    panelPalancasActual = panel;
    palancasAbierto = true;
    menu.style.display = "flex";
    menu.setAttribute("aria-hidden", "false");
    renderizarPalancas();
}

function cerrarMenuPalancas() {
    const menu = document.getElementById("menuPalancas");

    palancasAbierto = false;
    panelPalancasActual = null;

    if (menu) {
        menu.style.display = "none";
        menu.setAttribute("aria-hidden", "true");
    }
}

function renderizarPalancas() {
    if (!panelPalancasActual) {
        return;
    }

    const lista = document.getElementById("listaPalancas");
    const estado = estadosPaneles[obtenerClavePanel(panelPalancasActual)];

    if (!lista || !estado) {
        return;
    }

    lista.innerHTML = "";
    estado.forEach((activa, indice) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = `palanca-control ${activa ? "activa" : "inactiva"}`;
        boton.setAttribute("aria-pressed", String(activa));
        boton.innerHTML = `<span class="palanca-control-numero">${indice + 1}</span><span class="palanca-control-icono" aria-hidden="true"></span><span class="palanca-control-estado">${activa ? "ACTIVA" : "INACTIVA"}</span>`;
        boton.addEventListener("click", () => alternarPalanca(indice));
        lista.appendChild(boton);
    });
}

function alternarPalanca(indice) {
    if (!panelPalancasActual) {
        return;
    }

    const clave = obtenerClavePanel(panelPalancasActual);
    estadosPaneles[clave][indice] = !estadosPaneles[clave][indice];
    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }
    renderizarPalancas();
    comprobarMecanismo();
}

function comprobarMecanismo() {
    const paneles = Object.keys(objetivosPaneles);
    const mecanismoCorrecto = paneles.length === 4 && paneles.every(clave =>
        objetivosPaneles[clave].every((objetivo, indice) =>
            estadosPaneles[clave][indice] === objetivo));

    if (mecanismoCorrecto && !progreso.palancasResueltas) {
        progreso.palancasResueltas = true;
        if (typeof marcarEstadoModificado === "function") {
            marcarEstadoModificado();
        }
        cargarTransiciones();
        cerrarMenuPalancas();
        abrirDialogoMensaje("Se escuchó el mecanismo en el segundo piso.");
    }
}

function comprobarPalancas() {
    if (dialogoAbierto || palancasAbierto) {
        mostrarIndicadorPalanca = false;
        return;
    }

    const panelCercano = obtenerPanelCercano();
    mostrarIndicadorPalanca = panelCercano !== null;

    if (panelCercano && teclas["e"]) {
        teclas["e"] = false;
        abrirMenuPalancas(panelCercano);
    }
}

function dibujarPalancas() {
    palancasMapa.forEach(panel => {
        const pantallaX = panel.x * escala - camara.x;
        const pantallaY = panel.y * escala - camara.y;
        const etiquetaX = pantallaX + (panel.width * escala) / 2;
        const etiquetaY = pantallaY - 8;

        ctx.save();
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "rgba(5, 10, 17, 0.88)";
        ctx.fillRect(etiquetaX - 30, etiquetaY - 15, 60, 17);
        ctx.fillStyle = "#f2cf78";
        ctx.fillText("PANEL", etiquetaX, etiquetaY);
        ctx.restore();
    });
}

document.addEventListener("keydown", function (evento) {
    if (palancasAbierto && evento.key === "Escape") {
        evento.preventDefault();
        cerrarMenuPalancas();
    }
});