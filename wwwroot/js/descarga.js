// =========================================================
// PANEL DE DESCARGA - SALA DE ELECTRICIDAD (LÓGICA)
// =========================================================

const ID_PANEL_DESCARGA = "PanelDescarga";
const TIPO_DESAFIO_DESCARGA = "descarga";

const FILAS_DESCARGA = 3;
const COLUMNAS_DESCARGA = 4;

// Celda y lado por donde la FUENTE entra al tablero y por donde sale hacia la DESCARGA.
const FUENTE_DESCARGA = { fila: 0, columna: 1, lado: "top" };
const SALIDA_DESCARGA = { fila: FILAS_DESCARGA - 1, columna: 2, lado: "bottom" };

const LADOS_DESCARGA = ["top", "right", "bottom", "left"];

const LADO_OPUESTO_DESCARGA = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
};

const DESPLAZAMIENTO_LADO_DESCARGA = {
    top: { fila: -1, columna: 0 },
    right: { fila: 0, columna: 1 },
    bottom: { fila: 1, columna: 0 },
    left: { fila: 0, columna: -1 }
};

// Conectores de cada tipo con rotación 0.
// Las demás rotaciones se calculan girando en sentido horario.
const CONECTORES_BASE_DESCARGA = {
    recto: ["left", "right"],
    curva: ["top", "right"],
    T: ["top", "left", "right"]
};

// Versión simplificada: un solo camino en serie con dos rectos y dos curvas.
const PIEZAS_INICIALES_DESCARGA = [
    { id: "A", tipo: "recto" },
    { id: "B", tipo: "curva" },
    { id: "C", tipo: "recto" },
    { id: "D", tipo: "curva" }
];

// Una de las configuraciones correctas (hay varias: el panel valida las reglas, no esta posición).
// Solo se usa para comprobar al cargar que el desafío tiene solución.
const SOLUCION_DESCARGA = {
    B: { fila: 0, columna: 1, rotacion: 0 },
    D: { fila: 0, columna: 2, rotacion: 180 },
    A: { fila: 1, columna: 2, rotacion: 90 },
    C: { fila: 2, columna: 2, rotacion: 90 }
};

const ESTADOS_CIRCUITO = {
    interrumpida: "CONEXIÓN INTERRUMPIDA",
    cerrado: "FLUJO CERRADO",
    inestable: "DESCARGA INESTABLE",
    estable: "DESCARGA ESTABLE"
};

let piezasDescarga = [];
let celdasDescarga = [];
let panelDescargaObjeto = null;
let mostrarIndicadorPanelDescarga = false;


// =========================================================
// CREAR PIEZAS Y TABLERO
// =========================================================

function crearPiezaDescarga(datos) {
    const pieza = {
        id: datos.id,
        tipo: datos.tipo,
        rotacion: 0,
        conectores: [],
        posicionFila: null,
        posicionColumna: null,
        colocada: false
    };

    pieza.conectores = obtenerConectores(pieza);
    return pieza;
}

function crearTableroDescarga() {
    const celdas = [];

    for (let fila = 0; fila < FILAS_DESCARGA; fila++) {
        celdas[fila] = [];

        for (let columna = 0; columna < COLUMNAS_DESCARGA; columna++) {
            celdas[fila][columna] = {
                fila: fila,
                columna: columna,
                pieza: null
            };
        }
    }

    return celdas;
}

function inicializarPuzzleDescarga() {
    piezasDescarga = PIEZAS_INICIALES_DESCARGA.map(crearPiezaDescarga);
    celdasDescarga = crearTableroDescarga();
}

function obtenerPiezaDescarga(id) {
    return piezasDescarga.find(pieza => pieza.id === id) || null;
}

function obtenerCeldaDescarga(fila, columna) {
    return celdasDescarga[fila]?.[columna] || null;
}


// =========================================================
// CONECTORES
// =========================================================

function obtenerConectores(pieza) {
    const base = CONECTORES_BASE_DESCARGA[pieza?.tipo] || [];
    const pasos = Math.round((((pieza?.rotacion || 0) % 360) + 360) % 360 / 90);

    return base.map(lado => {
        const indice = LADOS_DESCARGA.indexOf(lado);
        return LADOS_DESCARGA[(indice + pasos) % LADOS_DESCARGA.length];
    });
}

function obtenerLadoHacia(pieza1, pieza2) {
    const diferenciaFila = pieza2.posicionFila - pieza1.posicionFila;
    const diferenciaColumna = pieza2.posicionColumna - pieza1.posicionColumna;

    return LADOS_DESCARGA.find(lado => {
        const desplazamiento = DESPLAZAMIENTO_LADO_DESCARGA[lado];
        return desplazamiento.fila === diferenciaFila &&
            desplazamiento.columna === diferenciaColumna;
    }) || null;
}

function estanConectadas(pieza1, pieza2) {
    if (!pieza1?.colocada || !pieza2?.colocada || pieza1 === pieza2) {
        return false;
    }

    // 1. Deben ser adyacentes.
    const lado = obtenerLadoHacia(pieza1, pieza2);

    if (!lado) {
        return false;
    }

    // 2 y 3. Cada una debe tener un conector apuntando hacia la otra.
    return obtenerConectores(pieza1).includes(lado) &&
        obtenerConectores(pieza2).includes(LADO_OPUESTO_DESCARGA[lado]);
}


// =========================================================
// MOVER Y ROTAR PIEZAS
// =========================================================

function liberarCeldaDePieza(pieza) {
    const celda = obtenerCeldaDescarga(pieza.posicionFila, pieza.posicionColumna);

    if (celda && celda.pieza === pieza) {
        celda.pieza = null;
    }
}

function colocarPiezaEnCelda(pieza, fila, columna) {
    const celda = obtenerCeldaDescarga(fila, columna);

    if (!pieza || !celda) {
        return false;
    }

    if (celda.pieza && celda.pieza !== pieza) {
        return false;
    }

    liberarCeldaDePieza(pieza);

    celda.pieza = pieza;
    pieza.posicionFila = fila;
    pieza.posicionColumna = columna;
    pieza.colocada = true;

    return true;
}

function devolverPiezaABandeja(pieza) {
    if (!pieza) {
        return;
    }

    liberarCeldaDePieza(pieza);

    pieza.posicionFila = null;
    pieza.posicionColumna = null;
    pieza.colocada = false;
}

function rotarPieza(pieza) {
    if (!pieza?.colocada) {
        return false;
    }

    pieza.rotacion = (pieza.rotacion + 90) % 360;
    pieza.conectores = obtenerConectores(pieza);

    return true;
}


// =========================================================
// ENERGÍA
// =========================================================

function obtenerPiezaEnPosicion(piezas, fila, columna) {
    return piezas.find(pieza =>
        pieza.colocada &&
        pieza.posicionFila === fila &&
        pieza.posicionColumna === columna
    ) || null;
}

function esPuertoTerminal(pieza, lado, terminal) {
    return pieza.posicionFila === terminal.fila &&
        pieza.posicionColumna === terminal.columna &&
        lado === terminal.lado;
}

function claveArista(nodoA, nodoB) {
    return nodoA < nodoB ? `${nodoA}|${nodoB}` : `${nodoB}|${nodoA}`;
}

// Recorre todos los caminos simples FUENTE -> DESCARGA y devuelve las conexiones que usan.
function obtenerAristasEnCaminos(vecinos) {
    const usadas = new Set();
    const camino = ["FUENTE"];
    const visitados = new Set(["FUENTE"]);

    function recorrer(nodo) {
        if (nodo === "DESCARGA") {
            for (let i = 0; i < camino.length - 1; i++) {
                usadas.add(claveArista(camino[i], camino[i + 1]));
            }
            return;
        }

        for (const siguiente of vecinos.get(nodo) || []) {
            if (visitados.has(siguiente)) {
                continue;
            }

            visitados.add(siguiente);
            camino.push(siguiente);
            recorrer(siguiente);
            camino.pop();
            visitados.delete(siguiente);
        }
    }

    recorrer("FUENTE");
    return usadas;
}

// Una conexión forma parte de un ciclo si sus extremos siguen unidos sin usarla.
function aristaFormaCiclo(vecinos, nodoA, nodoB) {
    const visitados = new Set([nodoA]);
    const cola = [nodoA];

    while (cola.length > 0) {
        const nodo = cola.shift();

        for (const siguiente of vecinos.get(nodo) || []) {
            if (
                (nodo === nodoA && siguiente === nodoB) ||
                (nodo === nodoB && siguiente === nodoA)
            ) {
                continue;
            }

            if (siguiente === nodoB) {
                return true;
            }

            if (!visitados.has(siguiente)) {
                visitados.add(siguiente);
                cola.push(siguiente);
            }
        }
    }

    return false;
}

function calcularRed(piezas = piezasDescarga) {
    const vecinos = new Map();
    const aristas = new Set();
    const energizadas = new Set();
    let extremosAbiertos = 0;
    let descargaAlcanzada = false;

    function agregarArista(nodoA, nodoB) {
        if (!vecinos.has(nodoA)) vecinos.set(nodoA, new Set());
        if (!vecinos.has(nodoB)) vecinos.set(nodoB, new Set());

        vecinos.get(nodoA).add(nodoB);
        vecinos.get(nodoB).add(nodoA);
        aristas.add(claveArista(nodoA, nodoB));
    }

    // BFS desde la FUENTE.
    const cola = [];
    const piezaFuente = obtenerPiezaEnPosicion(
        piezas,
        FUENTE_DESCARGA.fila,
        FUENTE_DESCARGA.columna
    );

    if (piezaFuente && obtenerConectores(piezaFuente).includes(FUENTE_DESCARGA.lado)) {
        agregarArista("FUENTE", piezaFuente.id);
        energizadas.add(piezaFuente.id);
        cola.push(piezaFuente);
    }

    while (cola.length > 0) {
        const pieza = cola.shift();

        for (const lado of obtenerConectores(pieza)) {
            if (esPuertoTerminal(pieza, lado, FUENTE_DESCARGA)) {
                continue;
            }

            if (esPuertoTerminal(pieza, lado, SALIDA_DESCARGA)) {
                descargaAlcanzada = true;
                agregarArista(pieza.id, "DESCARGA");
                continue;
            }

            const desplazamiento = DESPLAZAMIENTO_LADO_DESCARGA[lado];
            const vecina = obtenerPiezaEnPosicion(
                piezas,
                pieza.posicionFila + desplazamiento.fila,
                pieza.posicionColumna + desplazamiento.columna
            );

            if (!vecina || !estanConectadas(pieza, vecina)) {
                extremosAbiertos++;
                continue;
            }

            agregarArista(pieza.id, vecina.id);

            if (!energizadas.has(vecina.id)) {
                energizadas.add(vecina.id);
                cola.push(vecina);
            }
        }
    }

    // Conexiones que realmente llevan energía de la FUENTE a la DESCARGA.
    const aristasEnCaminos = obtenerAristasEnCaminos(vecinos);

    // Un ciclo es inválido si alguna de sus conexiones no participa de ningún camino hacia la DESCARGA.
    const cicloInvalido = [...aristas].some(clave => {
        if (aristasEnCaminos.has(clave)) {
            return false;
        }

        const [nodoA, nodoB] = clave.split("|");
        return aristaFormaCiclo(vecinos, nodoA, nodoB);
    });

    const todasColocadas = piezas.every(pieza => pieza.colocada);
    const todasEnergizadas = piezas.every(pieza => energizadas.has(pieza.id));
    const sinRamasMuertas = [...aristas].every(clave => aristasEnCaminos.has(clave));

    const resuelto =
        descargaAlcanzada &&
        !cicloInvalido &&
        extremosAbiertos === 0 &&
        todasColocadas &&
        todasEnergizadas &&
        sinRamasMuertas;

    let estado = "estable";

    if (cicloInvalido) {
        estado = "cerrado";
    }
    else if (!descargaAlcanzada) {
        estado = "interrumpida";
    }
    else if (!resuelto) {
        estado = "inestable";
    }

    return {
        energizadas: energizadas,
        descargaAlcanzada: descargaAlcanzada,
        extremosAbiertos: extremosAbiertos,
        cicloInvalido: cicloInvalido,
        resuelto: resuelto,
        estado: estado,
        texto: ESTADOS_CIRCUITO[estado]
    };
}

function verificarSolucionFijaDescarga() {
    const piezas = PIEZAS_INICIALES_DESCARGA.map(datos => {
        const pieza = crearPiezaDescarga(datos);
        const destino = SOLUCION_DESCARGA[pieza.id];

        pieza.rotacion = destino.rotacion;
        pieza.conectores = obtenerConectores(pieza);
        pieza.posicionFila = destino.fila;
        pieza.posicionColumna = destino.columna;
        pieza.colocada = true;

        return pieza;
    });

    return calcularRed(piezas).resuelto;
}

console.assert(
    verificarSolucionFijaDescarga(),
    "La solución fija del panel de descarga no cumple las reglas del circuito."
);


// =========================================================
// OBJETO DE TILED
// =========================================================

function esObjetoPanelDescarga(objeto) {
    const id = String(obtenerPropiedadInteractuable(objeto, "Id") || "").toLowerCase();
    const tipo = String(obtenerPropiedadInteractuable(objeto, "TipoDesafio") || "").toLowerCase();

    return id === ID_PANEL_DESCARGA.toLowerCase() || tipo === TIPO_DESAFIO_DESCARGA;
}

function cargarPanelDescargaMapa() {
    panelDescargaObjeto = null;
    mostrarIndicadorPanelDescarga = false;

    if (!mapa?.layers) {
        return;
    }

    for (const capa of mapa.layers) {
        if (capa.type !== "objectgroup" || !capa.objects) {
            continue;
        }

        const objeto = capa.objects.find(esObjetoPanelDescarga);

        if (objeto) {
            panelDescargaObjeto = objeto;
            break;
        }
    }

    if (panelDescargaObjeto && progreso?.panelDescargaCompletado) {
        marcarObjetoPanelDescargaCompletado();
    }
}

function marcarObjetoPanelDescargaCompletado() {
    if (!panelDescargaObjeto) {
        return;
    }

    panelDescargaObjeto.properties ??= [];

    const propiedad = panelDescargaObjeto.properties.find(
        item => String(item?.name).toLowerCase() === "completado"
    );

    if (propiedad) {
        propiedad.value = true;
    }
    else {
        panelDescargaObjeto.properties.push({ name: "Completado", type: "bool", value: true });
    }
}

function panelDescargaCompletado() {
    return Boolean(progreso?.panelDescargaCompletado) ||
        obtenerPropiedadInteractuable(panelDescargaObjeto, "Completado") === true;
}

function obtenerPanelDescargaCercano() {
    if (!panelDescargaObjeto) {
        return null;
    }

    const margen = 16;
    const objeto = panelDescargaObjeto;

    const objetoIzquierda = (objeto.x || 0) - margen;
    const objetoDerecha = (objeto.x || 0) + (objeto.width || 0) + margen;
    const objetoArriba = (objeto.y || 0) - margen;
    const objetoAbajo = (objeto.y || 0) + (objeto.height || 0) + margen;

    // Misma caja que usa colisiones.js: desde la mitad del personaje hasta los pies.
    const jugadorIzquierda = jugador.x;
    const jugadorDerecha = jugador.x + jugador.ancho / escala;
    const jugadorArriba = jugador.y + (jugador.alto / escala) / 2;
    const jugadorAbajo = jugador.y + jugador.alto / escala;

    const cerca =
        jugadorIzquierda < objetoDerecha &&
        jugadorDerecha > objetoIzquierda &&
        jugadorArriba < objetoAbajo &&
        jugadorAbajo > objetoArriba;

    return cerca ? objeto : null;
}

function comprobarPanelDescarga() {
    if (dialogoAbierto || panelDescargaAbierto) {
        mostrarIndicadorPanelDescarga = false;
        return;
    }

    const panel = obtenerPanelDescargaCercano();

    mostrarIndicadorPanelDescarga = panel !== null;

    if (panel && teclas["e"]) {
        teclas["e"] = false;
        interactuarPanelDescarga();
    }
}

function interactuarPanelDescarga() {
    if (panelDescargaCompletado()) {
        abrirDialogoMensaje("El panel de descarga está desactivado. Energía residual: 0.");
        return;
    }

    const estado = String(obtenerPropiedadInteractuable(panelDescargaObjeto, "Estado") || "desbloqueado");

    if (estado.toLowerCase() !== "desbloqueado") {
        abrirDialogoMensaje("El panel de descarga está bloqueado.");
        return;
    }

    abrirPanelDescarga();
}


// =========================================================
// FINALIZAR DESAFÍO
// =========================================================

// El fragmento temporal 3 (Sala de Máquinas) solo se puede recoger con la descarga completada.
function puedeRecogerFragmentoTemporal3() {
    return Boolean(progreso?.panelDescargaCompletado);
}

function completarDesafioDescarga() {
    if (progreso.panelDescargaCompletado) {
        return;
    }

    progreso.panelDescargaCompletado = true;
    marcarObjetoPanelDescargaCompletado();

    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }

    document.dispatchEvent(new CustomEvent("desafioDescargaCompletado"));
}
