let transiciones = [];
let mostrarIndicadorInteraccion = false;
let transicionEnCurso = false;
let opacidadFade = 0;
let fadeActivo = false;

function cargarTransiciones() {

    transiciones = [];

    if (!mapa || !mapa.layers) {
        return;
    }

    const capasTransiciones = mapa.layers.filter(capa =>
        capa.name === "Transiciones" ||
        (capa.name === "PuertaOcultaTransicion" && progreso.palancasResueltas)
    );

    if (capasTransiciones.length === 0) {
        return;
    }

    transiciones = capasTransiciones.flatMap(capa => capa.objects || []);

    console.log("TRANSICIONES CARGADAS:", transiciones);
}

function jugadorEnTransicion(transicion) {

    const jugadorIzquierda = jugador.x;
    const jugadorDerecha = jugador.x + jugador.ancho / escala;

    const jugadorArriba = jugador.y + (jugador.alto / escala) / 2;
    const jugadorAbajo = jugador.y + jugador.alto / escala;

    const transicionIzquierda = transicion.x;
    const transicionDerecha = transicion.x + transicion.width;

    const transicionArriba = transicion.y;
    const transicionAbajo = transicion.y + transicion.height;

    return (
        jugadorIzquierda < transicionDerecha &&
        jugadorDerecha > transicionIzquierda &&
        jugadorArriba < transicionAbajo &&
        jugadorAbajo > transicionArriba
    );
}

function obtenerTransicionActual() {

    for (const transicion of transiciones) {

        if (jugadorEnTransicion(transicion)) {
            return transicion;
        }
    }

    return null;
}
function jugadorEnTransicionActual() {
    return obtenerTransicionActual() !== null;
}

function actualizarInteraccion() {

    const transicionActual = obtenerTransicionActual();

    mostrarIndicadorInteraccion = transicionActual !== null;
}

document.addEventListener("keydown", function (e) {

    if (dialogoAbierto) {
        return;
    }
    if (e.key.toLowerCase() !== "e") {
        return;
    }

    const transicionActual = obtenerTransicionActual();

    if (!transicionActual) {
        return;
    }

    ejecutarTransicion(transicionActual);
});

function ejecutarTransicion(transicion) {
    

    if (transicionEnCurso) return;

    const requisito = transicion.properties?.find(
        propiedad => propiedad.name === "Requisito"
    );

    const permiso = puedeUsarTransicion(transicion);

    console.log('Intentando ejecutar transición. jugador=', { x: jugador.x, y: jugador.y });
    console.log('Transición seleccionada:', transicion);
    console.log('puedeUsarTransicion ->', permiso);

    if (!permiso) {

        const dialogoBloqueado = transicion.properties?.find(
            propiedad => propiedad.name === "Dialogo"
        );

        if (dialogoBloqueado) {
            abrirDialogo(dialogoBloqueado.value);
        }

        const esEntradaFabrica = transicion.properties?.some(propiedad =>
            propiedad.name === "MapaDestino" && String(propiedad.value).includes("FabricaEntrada1")
        );

        if (esEntradaFabrica) {
            abrirDialogoMensaje("La puerta de la fábrica está trabada. Primero tenés que sincronizar los engranajes de la máquina.");
            return;
        }

        // Si la transición está marcada como Desbloqueada pero sigue fallando por colisión,
        // mostrar un dialogo informativo.
        const des = transicion.properties?.find(p => p.name === 'Desbloqueada' && p.value === true);
        if (des) {
            abrirDialogo('puertaTemplo');
        }

        return;
    }
    console.log("REQUISITO:", requisito);
    console.log("TIENE OBJETO:", requisito ? tieneObjeto(requisito.value) : "sin requisito");
    const mapaDestino = transicion.properties.find(
        propiedad => propiedad.name === "MapaDestino"
    );

    const spawnX = transicion.properties.find(
        propiedad => propiedad.name === "SpawnX"
    );

    const spawnY = transicion.properties.find(
        propiedad => propiedad.name === "SpawnY"
    );

    if (!mapaDestino || !spawnX || !spawnY) {
        console.error("La transición no tiene todas las propiedades necesarias.");
        return;
    }

    transicionEnCurso = true;

    const esCambioDeEpoca = obtenerPropiedadTransicion(transicion, "Dialogo") === "maquina1"
        && obtenerPropiedadTransicion(transicion, "Requisito")?.startsWith("fragmento_temporal");

    if (esCambioDeEpoca) {
        mostrarTransicionEpoca(mapaDestino.value, Number(spawnX.value), Number(spawnY.value));
        return;
    }

    iniciarFadeTransicion(mapaDestino.value, Number(spawnX.value), Number(spawnY.value));
}

function obtenerPropiedadTransicion(transicion, nombre) {
    const propiedad = transicion.properties?.find(item => item.name === nombre);
    return typeof propiedad?.value === "string" ? propiedad.value.trim() : propiedad?.value;
}

function mostrarTransicionEpoca(rutaDestino, spawnX, spawnY) {
    const datosEpoca = obtenerDatosEpoca(rutaDestino);
    const pantalla = document.getElementById("transicionEpoca");
    const anio = document.getElementById("transicionEpocaAnio");
    const nombre = document.getElementById("transicionEpocaNombre");

    if (!pantalla || !anio || !nombre) {
        iniciarFadeTransicion(rutaDestino, spawnX, spawnY);
        return;
    }

    anio.textContent = datosEpoca.anio;
    nombre.textContent = datosEpoca.nombre;
    pantalla.classList.add("visible");

    setTimeout(() => {
        iniciarFadeTransicion(rutaDestino, spawnX, spawnY);
    }, 1600);

    setTimeout(() => {
        pantalla.classList.remove("visible");
    }, 2800);
}

function obtenerDatosEpoca(rutaDestino) {
    const ruta = rutaDestino.toLowerCase();

    if (ruta.includes("castillo edad media")) {
        return { nombre: "Edad Media", anio: "Año 1348" };
    }

    if (ruta.includes("fabrica")) {
        return { nombre: "Revolución Industrial", anio: "Año 1889" };
    }

    if (ruta.includes("ancientgreek")) {
        return { nombre: "Antigua Grecia", anio: "Año 450 a. C." };
    }

    return { nombre: "Nueva época", anio: "Destino temporal" };
}
function puedeUsarTransicion(transicion) {
    // Mostrar estados para depuración
    console.log('puedeUsarTransicion: progreso=', {
        tienePermisoEscriba: progreso.tienePermisoEscriba,
        habloConGuardia: progreso.habloConGuardia,
        guardiaLlegado: progreso.guardiaLlegado
    });

    // Si la transición fue marcada como desbloqueada por el guardia, permitirla
    const desbloqueada = transicion.properties?.find(p => p.name === 'Desbloqueada' && p.value === true);
    if (desbloqueada) {
        console.log('Transición marcada como Desbloqueada -> permitida');
        return true;
    }

    const requisito = transicion.properties?.find(
        propiedad => propiedad.name === "Requisito"
    );

    if (requisito) {
        const requisitoValor = String(requisito.value || "").trim();

        if (requisitoValor === "ninguno") {
            return true;
        }

        if (requisitoValor === "permiso_escriba") {
            return progreso.tienePermisoEscriba;
        }

        if (requisitoValor === "reparoMaquina" || requisitoValor === "reparo_maquina") {
            return Boolean(progreso.reparoMaquina);
        }

        return tieneObjeto(requisitoValor);
    }

    // Si no hay requisito explícito, forzar permiso para la puerta
    // principal del castillo que lleva a "CastilloPiso2.tmj".
    const mapaDestino = transicion.properties?.find(p => p.name === "MapaDestino")?.value;

    if (mapaDestino === "/Maps/mapasJson/CastilloPiso2.tmj") {
        // Requiere permiso del escriba y que el guardia haya llegado a la puerta
        return progreso.tienePermisoEscriba && progreso.guardiaLlegado;
    }

    return true;
}
function iniciarFadeTransicion(mapaDestino, spawnX, spawnY) {

    fadeActivo = true;
    opacidadFade = 0;

    const intervalo = setInterval(function () {

        opacidadFade += 0.05;

        if (opacidadFade >= 1) {

            opacidadFade = 1;

            clearInterval(intervalo);

            cambiarMapa(
                mapaDestino,
                spawnX,
                spawnY
            );

            iniciarFadeSalida();
        }

    }, 25);
}

function iniciarFadeSalida() {

    const intervalo = setInterval(function () {

        opacidadFade -= 0.05;

        if (opacidadFade <= 0) {

            opacidadFade = 0;
            fadeActivo = false;
            transicionEnCurso = false;

            clearInterval(intervalo);
        }

    }, 25);
}

function dibujarIndicadorInteraccion() {
    if (!mostrarIndicadorInteraccion) return;

    const tamaño = 28;

    const jugadorPantallaX =
        jugador.x * escala - camara.x;

    const jugadorPantallaY =
        jugador.y * escala - camara.y;

    const x =
        jugadorPantallaX +
        jugador.ancho / 2 -
        tamaño / 2;

    const y =
        jugadorPantallaY -
        tamaño -
        10;

    ctx.fillStyle = "red";
    ctx.fillRect(x, y, tamaño, tamaño);

    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        "E",
        x + tamaño / 2,
        y + tamaño / 2
    );
}
function dibujarFade() {

    if (!fadeActivo) {
        return;
    }

    ctx.fillStyle = `rgba(0, 0, 0, ${opacidadFade})`;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}