// Sistema de audio en tres capas independientes: música, ambiente y efectos.
//
// Música: una sola pista a la vez, en bucle, que arranca por la mitad.
// Si la canción pedida es la que ya suena, no se vuelve a cargar.
// Entre páginas se recuerda la canción y el segundo por el que iba (sessionStorage),
// así pasar de Home a Login no reinicia la música.
//
// Ambiente y efectos: ver las secciones al final del archivo.

// Volumen de cada capa (0 a 1). Prioridad de mezcla: efectos > música > ambiente.
// Los diálogos son texto; su efecto de avance tiene un volumen propio más bajo.
const VOLUMENES = {
    musica: 0.5,
    ambiente: 0.22,
    efectos: 0.6
};

const MUSICA_CARPETA = "/music/";
const MUSICA_CLAVE_ESTADO = "chronosMusica";

const CANCIONES = {
    Home: "Home.mp3",
    AncientGreekExterior: "AncienGreekExterior.mp3",
    LacrimosaTemple: "Lacrimosa(temple).mp3",
    EdadMediaExterior: "edadMediaExterior.mp3",
    Castillo: "castillo.mp3",
    Revind: "revind.mp3",
    Laboratorio: "laboratorio.wav"
};

// Nombre del archivo del mapa (sin .tmj, en minúsculas) -> canción. null = silencio.
const MUSICA_POR_MAPA = {
    labo: "Laboratorio",
    ancientgreek: "AncientGreekExterior",
    almacengrecia: "AncientGreekExterior",
    fragtemp1: "LacrimosaTemple",
    templogrecia: "LacrimosaTemple",
    "castillo edad media": "EdadMediaExterior",
    castilloprincipal: "Castillo",
    castillopiso2: "Castillo",
    fragtemp2: "Castillo",
    introrev: "Revind",
    recepcion: "Revind",
    salamaquinas: "Revind",
    salaelectricidad: "Revind"
};

const audioMusica = new Audio();
audioMusica.loop = true;
audioMusica.volume = VOLUMENES.musica;

let cancionActual = null;

function leerEstadoMusica() {
    try {
        return JSON.parse(sessionStorage.getItem(MUSICA_CLAVE_ESTADO)) || null;
    }
    catch {
        return null;
    }
}

function guardarEstadoMusica() {
    try {
        sessionStorage.setItem(MUSICA_CLAVE_ESTADO, JSON.stringify({
            cancion: cancionActual,
            tiempo: audioMusica.currentTime || 0
        }));
    }
    catch {
        // Sin sessionStorage la música simplemente vuelve a empezar por la mitad.
    }
}

function intentarReproducirMusica() {
    if (!cancionActual) {
        return;
    }

    audioMusica.play().catch(() => {
        // El navegador bloqueó la reproducción automática: se reintenta con la
        // primera interacción del jugador (ver listeners al final del archivo).
    });
}

function reproducirMusica(nombre) {
    if (!nombre || !CANCIONES[nombre]) {
        detenerMusica();
        return;
    }

    if (nombre === cancionActual) {
        if (audioMusica.paused) {
            intentarReproducirMusica();
        }
        return;
    }

    const estadoPrevio = leerEstadoMusica();
    const tiempoGuardado = estadoPrevio && estadoPrevio.cancion === nombre
        ? estadoPrevio.tiempo
        : null;

    cancionActual = nombre;
    audioMusica.src = MUSICA_CARPETA + encodeURIComponent(CANCIONES[nombre]);

    audioMusica.addEventListener("loadedmetadata", () => {
        audioMusica.currentTime = Number.isFinite(tiempoGuardado)
            ? tiempoGuardado
            : audioMusica.duration / 2;
    }, { once: true });

    intentarReproducirMusica();
    guardarEstadoMusica();
}

function detenerMusica() {
    cancionActual = null;
    audioMusica.pause();
    audioMusica.removeAttribute("src");
    audioMusica.load();
    guardarEstadoMusica();
}

// Nombre del archivo del mapa (sin .tmj, en minúsculas). Lo usan la música y el ambiente.
function obtenerNombreMapa(ruta) {
    if (!ruta) {
        return null;
    }

    return decodeURIComponent(ruta)
        .split("/")
        .pop()
        .replace(/\.tmj$/i, "")
        .trim()
        .toLowerCase();
}

function obtenerCancionMapa(ruta) {
    return MUSICA_POR_MAPA[obtenerNombreMapa(ruta)] ?? null;
}

function actualizarMusicaMapa(ruta) {
    reproducirMusica(obtenerCancionMapa(ruta));
}

// Cambia el volumen de una capa ("musica", "ambiente" o "efectos") y lo aplica a lo que ya suena.
function establecerVolumen(capa, valor) {
    if (!(capa in VOLUMENES)) {
        return;
    }

    VOLUMENES[capa] = limitarVolumen(Number(valor) || 0);

    if (capa === "musica") {
        audioMusica.volume = VOLUMENES.musica;
    }

    if (capa === "ambiente" && ambienteActual) {
        fundirVolumen(pistasAmbiente[indicePistaAmbiente], volumenAmbiente(ambienteActual), 200);
    }
}

function limitarVolumen(valor) {
    return Math.max(0, Math.min(1, valor));
}


// =========================================================
// ARCHIVOS DE AUDIO
// =========================================================

// Si un archivo no existe, se avisa una sola vez por consola y no se vuelve a pedir.
const archivosAudioFaltantes = new Set();

function marcarAudioFaltante(ruta) {
    if (archivosAudioFaltantes.has(ruta)) {
        return;
    }

    archivosAudioFaltantes.add(ruta);
    console.info("Audio no encontrado, se omite:", ruta);
}

// Reproduce un archivo una vez (efectos y detalles de ambiente). Se crea un Audio por
// reproducción para que el mismo sonido pueda superponerse consigo mismo.
function reproducirArchivoAudio(ruta, volumen, velocidad = 1) {
    if (archivosAudioFaltantes.has(ruta)) {
        return;
    }

    const audio = new Audio(ruta);
    audio.volume = limitarVolumen(volumen);
    audio.preservesPitch = false;
    audio.playbackRate = velocidad;
    audio.addEventListener("error", () => marcarAudioFaltante(ruta), { once: true });
    audio.play().catch(() => {
        // Archivo faltante o reproducción bloqueada por el navegador: se omite.
    });
}


// =========================================================
// EFECTOS DE SONIDO
// =========================================================

const CARPETA_EFECTOS = "/sonidos/efectos/";

// volumen: multiplicador sobre VOLUMENES.efectos.
const EFECTOS = {
    puerta: { archivo: "puerta_abrir.wav", volumen: 0.8 },
    objeto: { archivo: "objeto_recoger.wav", volumen: 0.9 },
    interactuar: { archivo: "interactuar.wav", volumen: 0.55 },
    dialogo: { archivo: "dialogo_avanzar.wav", volumen: 0.35 },
    puzzleCompletado: { archivo: "puzzle_completado.wav", volumen: 1 },
    puzzleError: { archivo: "puzzle_error.wav", volumen: 0.75 },
    transicionTemporal: { archivo: "transicion_temporal.wav", volumen: 1 },
    maquinaApagada: { archivo: "maquina_apagar.wav", volumen: 0.9 },
    fragmento: { archivo: "fragmento_temporal.wav", volumen: 1 },
    mecanismo: { archivo: "mecanismo_activar.wav", volumen: 0.6 }
};

// Un mismo efecto no se repite antes de este tiempo: evita duplicados cuando dos funciones
// reaccionan a la misma acción y cualquier repetición por frame.
const INTERVALO_MINIMO_EFECTO_MS = 90;
const ultimaReproduccionEfecto = {};
let efectosPrecargados = false;

// opciones.retraso: milisegundos de espera (para no pisar otro efecto que suena a la vez).
function reproducirEfecto(nombre, opciones = {}) {
    const efecto = EFECTOS[nombre];

    if (!efecto) {
        return;
    }

    const ahora = performance.now();

    if (ahora - (ultimaReproduccionEfecto[nombre] || 0) < INTERVALO_MINIMO_EFECTO_MS) {
        return;
    }

    ultimaReproduccionEfecto[nombre] = ahora;

    const reproducir = () => reproducirArchivoAudio(
        CARPETA_EFECTOS + efecto.archivo,
        VOLUMENES.efectos * efecto.volumen
    );

    if (opciones.retraso > 0) {
        setTimeout(reproducir, opciones.retraso);
        return;
    }

    reproducir();
}

// Descarga eléctrica sintetizada (no hay archivo): zumbido grave que tiembla y chasquidos
// de ruido al azar, con un golpe fuerte al principio. duracion en segundos.
let contextoAudioSintetizado = null;

function reproducirElectrocucion(duracion = 1.4) {
    const Contexto = window.AudioContext || window.webkitAudioContext;

    if (!Contexto) {
        return;
    }

    try {
        contextoAudioSintetizado = contextoAudioSintetizado || new Contexto();
    }
    catch {
        return;
    }

    const ctxAudio = contextoAudioSintetizado;

    if (ctxAudio.state === "suspended") {
        ctxAudio.resume().catch(() => { });
    }

    const inicio = ctxAudio.currentTime;
    const fin = inicio + duracion;
    const volumen = VOLUMENES.efectos;

    const salida = ctxAudio.createGain();
    salida.gain.setValueAtTime(0.0001, inicio);
    salida.gain.exponentialRampToValueAtTime(volumen * 0.9, inicio + 0.02);
    salida.gain.setValueAtTime(volumen * 0.9, fin - 0.35);
    salida.gain.exponentialRampToValueAtTime(0.0001, fin);
    salida.connect(ctxAudio.destination);

    // Zumbido: dos sierras levemente desafinadas, con un LFO que las hace vibrar.
    const filtroZumbido = ctxAudio.createBiquadFilter();
    filtroZumbido.type = "lowpass";
    filtroZumbido.frequency.value = 1800;
    filtroZumbido.connect(salida);

    const gananciaZumbido = ctxAudio.createGain();
    gananciaZumbido.gain.value = 0.35;
    gananciaZumbido.connect(filtroZumbido);

    const lfo = ctxAudio.createOscillator();
    const profundidadLfo = ctxAudio.createGain();
    lfo.frequency.value = 23;
    profundidadLfo.gain.value = 0.3;
    lfo.connect(profundidadLfo);
    profundidadLfo.connect(gananciaZumbido.gain);
    lfo.start(inicio);
    lfo.stop(fin);

    [110, 116.5].forEach(frecuencia => {
        const osc = ctxAudio.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(frecuencia, inicio);
        osc.frequency.linearRampToValueAtTime(frecuencia * 0.8, fin);
        osc.connect(gananciaZumbido);
        osc.start(inicio);
        osc.stop(fin);
    });

    // Chasquidos: un buffer de ruido blanco que se abre en ráfagas cortas.
    const muestras = Math.floor(ctxAudio.sampleRate * duracion);
    const buffer = ctxAudio.createBuffer(1, muestras, ctxAudio.sampleRate);
    const datos = buffer.getChannelData(0);
    for (let i = 0; i < muestras; i++) {
        datos[i] = Math.random() * 2 - 1;
    }

    const ruido = ctxAudio.createBufferSource();
    ruido.buffer = buffer;

    const filtroRuido = ctxAudio.createBiquadFilter();
    filtroRuido.type = "highpass";
    filtroRuido.frequency.value = 1200;

    const gananciaRuido = ctxAudio.createGain();
    gananciaRuido.gain.setValueAtTime(0, inicio);

    // Golpe inicial fuerte y después chasquidos irregulares.
    gananciaRuido.gain.linearRampToValueAtTime(1, inicio + 0.01);
    gananciaRuido.gain.exponentialRampToValueAtTime(0.05, inicio + 0.18);

    let tiempo = inicio + 0.2;
    while (tiempo < fin - 0.05) {
        const largo = 0.015 + Math.random() * 0.05;
        gananciaRuido.gain.setValueAtTime(0.05, tiempo);
        gananciaRuido.gain.linearRampToValueAtTime(0.4 + Math.random() * 0.6, tiempo + 0.004);
        gananciaRuido.gain.linearRampToValueAtTime(0.05, tiempo + largo);
        tiempo += largo + 0.02 + Math.random() * 0.09;
    }

    ruido.connect(filtroRuido);
    filtroRuido.connect(gananciaRuido);
    gananciaRuido.connect(salida);
    ruido.start(inicio);
    ruido.stop(fin);
}

// Se precargan al entrar al juego para que el primer uso no tenga demora.
function precargarEfectos() {
    if (efectosPrecargados) {
        return;
    }

    efectosPrecargados = true;

    Object.values(EFECTOS).forEach(efecto => {
        const ruta = CARPETA_EFECTOS + efecto.archivo;
        const audio = new Audio();
        audio.preload = "auto";
        audio.addEventListener("error", () => marcarAudioFaltante(ruta), { once: true });
        audio.src = ruta;
    });
}


// =========================================================
// AMBIENTE
// =========================================================

// Cada ambiente es un loop de fondo más "detalles": sonidos sueltos que se disparan a
// intervalos y velocidades al azar para que el ambiente no suene siempre igual.
// volumen: multiplicador sobre VOLUMENES.ambiente. intervaloDetalles: [mínimo, máximo] en ms.
const CARPETA_AMBIENTE = "/sonidos/ambiente/";
const DURACION_FUNDIDO_AMBIENTE_MS = 1200;

const AMBIENTES = {
    Laboratorio: {
        archivo: "laboratorio.wav",
        volumen: 0.8,
        detalles: ["laboratorio_pitido.wav", "laboratorio_equipo.wav"],
        intervaloDetalles: [14000, 35000]
    },
    GreciaExterior: {
        archivo: "grecia_exterior.wav",
        volumen: 1,
        detalles: ["grecia_pajaro_1.wav", "grecia_pajaro_2.wav", "grecia_gaviota.wav"],
        intervaloDetalles: [6000, 16000]
    },
    GreciaTemplo: {
        archivo: "grecia_templo.wav",
        volumen: 0.8,
        detalles: ["templo_eco_piedra.wav"],
        intervaloDetalles: [20000, 45000]
    },
    MedievalExterior: {
        archivo: "medieval_exterior.wav",
        volumen: 1,
        detalles: ["medieval_pajaro.wav", "medieval_actividad_lejana.wav"],
        intervaloDetalles: [9000, 22000]
    },
    Castillo: {
        archivo: "castillo_interior.wav",
        volumen: 0.85,
        detalles: ["castillo_madera.wav", "castillo_piedra.wav"],
        intervaloDetalles: [15000, 35000]
    },
    Industrial: {
        archivo: "industrial.wav",
        volumen: 0.9,
        detalles: ["industrial_golpe_metalico.wav", "industrial_vapor.wav", "industrial_valvula.wav", "industrial_engranajes.wav"],
        intervaloDetalles: [4000, 11000]
    }
};

// Nombre del mapa -> ambiente. Los mapas que no figuran quedan sin ambiente.
const AMBIENTE_POR_MAPA = {
    labo: "Laboratorio",
    ancientgreek: "GreciaExterior",
    almacengrecia: "GreciaTemplo",
    templogrecia: "GreciaTemplo",
    fragtemp1: "GreciaTemplo",
    "castillo edad media": "MedievalExterior",
    castilloprincipal: "Castillo",
    castillopiso2: "Castillo",
    fragtemp2: "Castillo",
    introrev: "Industrial",
    recepcion: "Industrial",
    salamaquinas: "Industrial",
    salaelectricidad: "Industrial"
};

// Dos pistas que se alternan: la entrante sube mientras la saliente baja y se libera.
// Nunca hay más de un ambiente a volumen pleno, y como máximo dos durante el fundido.
const pistasAmbiente = [crearPistaAmbiente(), crearPistaAmbiente()];
let indicePistaAmbiente = 0;
let ambienteActual = null;
let temporizadorDetalleAmbiente = null;

function crearPistaAmbiente() {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0;
    return audio;
}

function volumenAmbiente(nombre) {
    return VOLUMENES.ambiente * (AMBIENTES[nombre]?.volumen ?? 1);
}

function fundirVolumen(audio, destino, duracion, alTerminar = null) {
    clearInterval(audio.fundidoAmbiente);

    const inicio = audio.volume;
    const pasos = Math.max(1, Math.round(duracion / 50));
    let paso = 0;

    audio.fundidoAmbiente = setInterval(() => {
        paso++;
        audio.volume = limitarVolumen(inicio + (destino - inicio) * (paso / pasos));

        if (paso >= pasos) {
            clearInterval(audio.fundidoAmbiente);
            audio.fundidoAmbiente = null;
            alTerminar?.();
        }
    }, 50);
}

function liberarPistaAmbiente(audio) {
    clearInterval(audio.fundidoAmbiente);
    audio.fundidoAmbiente = null;
    audio.onerror = null;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    audio.volume = 0;
}

function intentarReproducirAmbiente() {
    const pista = pistasAmbiente[indicePistaAmbiente];

    if (ambienteActual && pista.getAttribute("src") && pista.paused) {
        pista.play().catch(() => {
            // Bloqueado hasta la primera interacción del jugador (ver listeners al final).
        });
    }
}

// Cambia al ambiente pedido con un fundido corto. null o un nombre desconocido lo apagan.
function reproducirAmbiente(nombre) {
    const clave = nombre && AMBIENTES[nombre] ? nombre : null;

    if (clave === ambienteActual) {
        intentarReproducirAmbiente();
        return;
    }

    ambienteActual = clave;
    clearTimeout(temporizadorDetalleAmbiente);

    const saliente = pistasAmbiente[indicePistaAmbiente];

    if (saliente.getAttribute("src")) {
        fundirVolumen(saliente, 0, DURACION_FUNDIDO_AMBIENTE_MS, () => liberarPistaAmbiente(saliente));
    }

    if (!clave) {
        return;
    }

    indicePistaAmbiente = 1 - indicePistaAmbiente;

    const entrante = pistasAmbiente[indicePistaAmbiente];
    const ruta = CARPETA_AMBIENTE + AMBIENTES[clave].archivo;

    // Si esta pista todavía se estaba apagando por un cambio anterior, se corta ya.
    liberarPistaAmbiente(entrante);

    if (!archivosAudioFaltantes.has(ruta)) {
        entrante.onerror = () => marcarAudioFaltante(ruta);

        // Cada visita arranca en un punto distinto del loop.
        entrante.addEventListener("loadedmetadata", () => {
            if (entrante.getAttribute("src") === ruta && Number.isFinite(entrante.duration)) {
                entrante.currentTime = Math.random() * entrante.duration;
            }
        }, { once: true });

        entrante.src = ruta;
        intentarReproducirAmbiente();
        fundirVolumen(entrante, volumenAmbiente(clave), DURACION_FUNDIDO_AMBIENTE_MS);
    }

    programarDetalleAmbiente();
}

function detenerAmbiente() {
    reproducirAmbiente(null);
}

function programarDetalleAmbiente() {
    clearTimeout(temporizadorDetalleAmbiente);

    const ambiente = AMBIENTES[ambienteActual];

    if (!ambiente?.detalles?.length) {
        return;
    }

    const [minimo, maximo] = ambiente.intervaloDetalles || [8000, 20000];
    const espera = minimo + Math.random() * (maximo - minimo);

    temporizadorDetalleAmbiente = setTimeout(() => {
        if (!document.hidden) {
            const archivo = ambiente.detalles[Math.floor(Math.random() * ambiente.detalles.length)];
            const volumen = volumenAmbiente(ambienteActual) * (0.55 + Math.random() * 0.45);
            const velocidad = 0.92 + Math.random() * 0.16;
            reproducirArchivoAudio(CARPETA_AMBIENTE + archivo, volumen, velocidad);
        }

        programarDetalleAmbiente();
    }, espera);
}

function actualizarAmbienteMapa(ruta) {
    precargarEfectos();
    reproducirAmbiente(AMBIENTE_POR_MAPA[obtenerNombreMapa(ruta)] ?? null);
}


// =========================================================
// ARRANQUE Y DESBLOQUEO
// =========================================================

["pointerdown", "keydown"].forEach(tipo => {
    window.addEventListener(tipo, () => {
        if (cancionActual && audioMusica.paused) {
            intentarReproducirMusica();
        }

        intentarReproducirAmbiente();
    });
});

window.addEventListener("pagehide", guardarEstadoMusica);

// Fuera del juego suena "Home". En el juego la elige el mapa y en los créditos, final.js.
document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.dataset.musica) {
        reproducirMusica("Home");
    }
});
