let palancasMapa = [];
let mostrarIndicadorPalanca = false;
let palancasAbierto = false;
let panelPalancasActual = null;

const estadosPaneles = {};
const objetivosPaneles = {};

// Los cuatro paneles del mecanismo están repartidos entre la planta baja (tres)
// y el segundo piso (uno) del castillo.
const MAPAS_CON_PALANCAS = [
    "/Maps/mapasJson/CastilloPrincipal.tmj",
    "/Maps/mapasJson/CastilloPiso2.tmj"
];
const TOTAL_PANELES_PALANCAS = 4;
const mapasPalancasRegistrados = new Set();

// Resumen de lo que dice el escrito antiguo, para consultarlo desde cualquier panel.
const PISTAS_PANELES_PALANCAS = [
    "Sala de armas: la segunda y la cuarta.",
    "Cámara olvidada, al final del pasillo norte: solo la primera.",
    "Sala del escriba, entre los libros: las dos últimas.",
    "Segundo piso, entre las estatuas: la primera y la tercera."
];

function obtenerPanelesDeMapa(datosMapa) {
    const capaPalancas = datosMapa?.layers?.find(capa => capa.name === "Palancas");

    return (capaPalancas?.objects || [])
        .filter(objeto => objeto.visible !== false && objeto.properties?.some(propiedad =>
            /^Palanca[1-4]$/.test(propiedad.name)))
        .sort((objetoA, objetoB) => objetoA.id - objetoB.id);
}

function registrarPanelesDeMapa(ruta, paneles) {
    const estadoGuardadoPalancas = progreso?.palancasEstado || {};

    paneles.forEach(panel => {
        const clave = `${ruta}#${panel.id}`;

        objetivosPaneles[clave] = [1, 2, 3, 4].map(numero => {
            const propiedad = panel.properties?.find(
                propiedad => propiedad.name === `Palanca${numero}`
            );

            return propiedad?.value === true;
        });

        // Lo que está en memoria es lo más reciente; lo guardado solo se usa al cargar la partida.
        if (!Array.isArray(estadosPaneles[clave])) {
            const estadoGuardado = estadoGuardadoPalancas[clave];
            estadosPaneles[clave] = Array.isArray(estadoGuardado)
                ? estadoGuardado.slice(0, 4)
                : [false, false, false, false];
        }
    });

    mapasPalancasRegistrados.add(ruta);
}

// Carga en segundo plano los paneles del otro piso del castillo, así el mecanismo
// y el contador de la misión conocen los cuatro paneles aunque el jugador no haya pasado por ahí.
function precargarPanelesDelCastillo() {
    MAPAS_CON_PALANCAS
        .filter(ruta => ruta !== rutaMapa && !mapasPalancasRegistrados.has(ruta))
        .forEach(ruta => {
            fetch(ruta)
                .then(respuesta => respuesta.ok ? respuesta.json() : null)
                .then(datos => {
                    if (!datos || mapasPalancasRegistrados.has(ruta)) {
                        return;
                    }

                    registrarPanelesDeMapa(ruta, obtenerPanelesDeMapa(datos));
                    comprobarMecanismo();
                })
                .catch(error => console.error("No se pudieron precargar los paneles de", ruta, error));
        });
}

function cargarPalancasMapa() {
    palancasMapa = [];

    if (!mapa?.layers) {
        return;
    }

    palancasMapa = obtenerPanelesDeMapa(mapa);

    if (palancasMapa.length === 0) {
        return;
    }

    registrarPanelesDeMapa(rutaMapa, palancasMapa);
    precargarPanelesDelCastillo();
    comprobarMecanismo();
}

function obtenerClavePanel(panel) {
    return `${rutaMapa}#${panel.id}`;
}

function panelEstaCorrecto(clave) {
    const objetivo = objetivosPaneles[clave];
    const estado = estadosPaneles[clave];

    return Boolean(objetivo && estado) &&
        objetivo.every((valor, indice) => Boolean(estado[indice]) === valor);
}

function contarPanelesCorrectos() {
    return {
        correctos: Object.keys(objetivosPaneles).filter(panelEstaCorrecto).length,
        total: TOTAL_PANELES_PALANCAS
    };
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

    reproducirEfecto("interactuar");
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
    const clave = obtenerClavePanel(panelPalancasActual);
    const estado = estadosPaneles[clave];

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

    renderizarEstadoPalancas(clave);
}

function renderizarEstadoPalancas(clave) {
    const estado = document.getElementById("estadoPalancas");
    const pistas = document.getElementById("pistasPanelPalancas");
    const { correctos, total } = contarPanelesCorrectos();

    if (estado) {
        const correcto = panelEstaCorrecto(clave);
        estado.dataset.correcto = String(correcto);
        estado.innerHTML = `
            <strong>${correcto ? "✓ Este panel está en la posición correcta." : "Este panel todavía no está en la posición correcta."}</strong>
            <span>Paneles correctos: ${correctos} de ${total}</span>
        `;
    }

    if (pistas) {
        pistas.innerHTML = progreso?.pistasPalancasLeidas
            ? `<span class="etiqueta-palancas">LO QUE DICE EL ESCRITO ANTIGUO</span>
               <ul>${PISTAS_PANELES_PALANCAS.map(pista => `<li>${pista}</li>`).join("")}</ul>`
            : `<span class="etiqueta-palancas">PISTA</span>
               <p>En el segundo piso hay un escrito antiguo que dice qué palancas activar en cada sala.</p>`;
    }
}

function alternarPalanca(indice) {
    if (!panelPalancasActual) {
        return;
    }

    const clave = obtenerClavePanel(panelPalancasActual);
    estadosPaneles[clave][indice] = !estadosPaneles[clave][indice];
    reproducirEfecto("mecanismo");
    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }
    renderizarPalancas();
    comprobarMecanismo();
}

function comprobarMecanismo() {
    const paneles = Object.keys(objetivosPaneles);
    const mecanismoCorrecto = paneles.length === TOTAL_PANELES_PALANCAS && paneles.every(panelEstaCorrecto);

    if (mecanismoCorrecto && !progreso.palancasResueltas) {
        progreso.palancasResueltas = true;
        reproducirEfecto("puzzleCompletado");
        if (typeof marcarEstadoModificado === "function") {
            marcarEstadoModificado();
        }
        cargarTransiciones();
        cerrarMenuPalancas();
        abrirDialogoMensaje("Se escuchó el mecanismo en el segundo piso: el pasaje secreto está abierto.");
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
        const correcto = panelEstaCorrecto(obtenerClavePanel(panel));

        ctx.save();
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "rgba(5, 10, 17, 0.88)";
        ctx.fillRect(etiquetaX - 30, etiquetaY - 15, 60, 17);
        ctx.fillStyle = correcto ? "#9ce5a9" : "#f2cf78";
        ctx.fillText(correcto ? "PANEL ✓" : "PANEL", etiquetaX, etiquetaY);
        ctx.restore();
    });
}
