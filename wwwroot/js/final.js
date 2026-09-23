// Secuencia final: video sin controles y pantalla de agradecimiento.
let finalJuegoActivo = false;
let finalPermiteSaltar = false;
let finalVideoTerminado = false;

function mostrarGraciasFinal() {
    const video = document.getElementById("videoFinal");
    const botonIniciar = document.getElementById("finalIniciarVideo");
    const gracias = document.getElementById("finalGracias");

    finalVideoTerminado = true;
    document.getElementById("finalAvisoSaltar").hidden = true;
    video.pause();
    video.hidden = true;
    botonIniciar.hidden = true;
    gracias.hidden = false;
    reproducirMusica("Home");
}

// opciones.permitirSaltar: con Escape se saltea el video (solo en los créditos).
function iniciarFinalJuego(opciones = {}) {
    const contenedor = document.getElementById("finalJuego");
    const video = document.getElementById("videoFinal");
    const botonIniciar = document.getElementById("finalIniciarVideo");
    const gracias = document.getElementById("finalGracias");

    if (!contenedor || !video || finalJuegoActivo) {
        return;
    }

    finalJuegoActivo = true;
    detenerMusica();
    detenerAmbiente();
    finalPermiteSaltar = Boolean(opciones.permitirSaltar);
    document.getElementById("finalAvisoSaltar").hidden = !finalPermiteSaltar;
    contenedor.classList.add("visible");
    contenedor.setAttribute("aria-hidden", "false");

    let tiempoPermitido = 0;

    // Impide adelantar o atrasar el video.
    video.addEventListener("timeupdate", () => {
        if (!video.seeking && video.currentTime > tiempoPermitido) {
            tiempoPermitido = video.currentTime;
        }
    });

    video.addEventListener("seeking", () => {
        if (Math.abs(video.currentTime - tiempoPermitido) > 0.5) {
            video.currentTime = tiempoPermitido;
        }
    });

    // Impide pausarlo (por ejemplo con las teclas multimedia).
    video.addEventListener("pause", () => {
        if (!video.ended && !finalVideoTerminado && botonIniciar.hidden) {
            video.play().catch(() => {});
        }
    });

    video.addEventListener("ended", mostrarGraciasFinal);

    // Si el video no se puede cargar, se pasa directo al agradecimiento.
    video.addEventListener("error", mostrarGraciasFinal);

    video.addEventListener("contextmenu", evento => evento.preventDefault());

    botonIniciar.addEventListener("click", () => {
        botonIniciar.hidden = true;
        video.play().catch(() => {});
    });

    video.currentTime = 0;
    video.play().catch(() => {
        // El navegador bloqueó la reproducción automática: se pide un clic.
        botonIniciar.hidden = false;
    });
}

// Mientras corre el final, ninguna tecla llega al juego (ni el menú de pausa).
window.addEventListener("keydown", evento => {
    if (!finalJuegoActivo) {
        return;
    }

    const esBotonEnfocado = document.activeElement?.closest?.(".final-boton");
    if (esBotonEnfocado && (evento.key === "Enter" || evento.key === " " || evento.key === "Tab")) {
        return;
    }

    evento.preventDefault();
    evento.stopImmediatePropagation();

    if (evento.key === "Escape" && finalPermiteSaltar && !finalVideoTerminado) {
        mostrarGraciasFinal();
    }
}, true);
