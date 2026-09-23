// Sistema de música: una sola pista a la vez, en bucle, que arranca por la mitad.
// Si la canción pedida es la que ya suena, no se vuelve a cargar.
// Entre páginas se recuerda la canción y el segundo por el que iba (sessionStorage),
// así pasar de Home a Login no reinicia la música.

const MUSICA_CARPETA = "/music/";
const MUSICA_VOLUMEN = 0.5;
const MUSICA_CLAVE_ESTADO = "chronosMusica";

const CANCIONES = {
    Home: "Home.mp3",
    AncientGreekExterior: "AncienGreekExterior.mp3",
    LacrimosaTemple: "Lacrimosa(temple).mp3",
    EdadMediaExterior: "edadMediaExterior.mp3",
    Castillo: "castillo.mp3",
    Revind: "revind.mp3"
};

// Nombre del archivo del mapa (sin .tmj, en minúsculas) -> canción. null = silencio.
const MUSICA_POR_MAPA = {
    labo: null,
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
audioMusica.volume = MUSICA_VOLUMEN;

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

function obtenerCancionMapa(ruta) {
    if (!ruta) {
        return null;
    }

    const nombreMapa = decodeURIComponent(ruta)
        .split("/")
        .pop()
        .replace(/\.tmj$/i, "")
        .trim()
        .toLowerCase();

    return MUSICA_POR_MAPA[nombreMapa] ?? null;
}

function actualizarMusicaMapa(ruta) {
    reproducirMusica(obtenerCancionMapa(ruta));
}

["pointerdown", "keydown"].forEach(tipo => {
    window.addEventListener(tipo, () => {
        if (cancionActual && audioMusica.paused) {
            intentarReproducirMusica();
        }
    });
});

window.addEventListener("pagehide", guardarEstadoMusica);

// Fuera del juego suena "Home". En el juego la elige el mapa y en los créditos, final.js.
document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.dataset.musica) {
        reproducirMusica("Home");
    }
});
