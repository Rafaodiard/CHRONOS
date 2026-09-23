const librosBiblioteca = [
    "Crónicas del Reino del Norte",
    "Historia de la Corona",
    "Los Reyes de Occidente",
    "La Caída de los Antiguos Reyes",
    "Grandes Batallas del Reino",
    "El Arte de la Guerra",
    "Tácticas de Caballería",
    "Arquitectura de las Fortalezas",
    "Plantas y Hierbas Medicinales",
    "Bestiario de los Bosques",
    "Viajes por Occidente",
    "Tierras Más Allá del Mar",
    "Relatos de Grandes Exploradores",
    "Los Misterios del Cielo",
    "Mapas de los Reinos Conocidos",
    "El Estudio de los Astros",
    "Calendarios y Mareas",
    "Tratado sobre los Planetas",
    "Astronomía de los Antiguos"
];

const paginasLibro = Array.from({ length: 5 }, (_, indice) =>
    `Las páginas están cubiertas de notas antiguas. Este es el capítulo ${indice + 1}.`
);

let libroSeleccionado = 0;
let paginaSeleccionada = 0;
let bibliotecaAbierta = false;

// Presentación de la placa: la primera vez que se abre la biblioteca
// la escena se centra en la placa antes de mostrar el catálogo.
const DURACION_NARRACION_PLACA = 1800;
const DURACION_ENFOQUE_PLACA = 900;
const DURACION_LECTURA_PLACA = 2400;
const FASES_PLACA = ["presentando-placa", "fase-narracion", "fase-enfoque", "fase-lectura", "placa-lista", "mostrar-catalogo"];

let presentacionPlacaActiva = false;
let presentacionPlacaLista = false;
let temporizadoresPlaca = [];

function abrirBiblioteca() {
    if (typeof tieneObjeto === "function" && tieneObjeto("Documento1")) {
        return;
    }

    const menu = document.getElementById("menuBiblioteca");

    if (!menu) return;

    bibliotecaAbierta = true;
    menu.style.display = "flex";
    menu.setAttribute("aria-hidden", "false");
    seleccionarLibro(0);

    if (!progreso?.placaBibliotecaLeida) {
        presentarPlacaBiblioteca(true);
    }
}

function cerrarBiblioteca() {
    const menu = document.getElementById("menuBiblioteca");

    if (!menu) return;

    limpiarPresentacionPlaca(menu);
    bibliotecaAbierta = false;
    menu.style.display = "none";
    menu.setAttribute("aria-hidden", "true");
}

function presentarPlacaBiblioteca(conNarracion) {
    const menu = document.getElementById("menuBiblioteca");

    if (!menu) return;

    limpiarPresentacionPlaca(menu);
    presentacionPlacaActiva = true;
    menu.classList.add("presentando-placa");

    let espera = 0;

    if (conNarracion) {
        menu.classList.add("fase-narracion");
        espera += DURACION_NARRACION_PLACA;
    }

    programarFasePlaca(espera, () => {
        menu.classList.remove("fase-narracion");
        menu.classList.add("fase-enfoque");
    });

    espera += DURACION_ENFOQUE_PLACA;

    programarFasePlaca(espera, () => {
        menu.classList.add("fase-lectura");

        if (progreso) {
            progreso.placaBibliotecaLeida = true;
        }
    });

    espera += DURACION_LECTURA_PLACA;

    programarFasePlaca(espera, () => {
        presentacionPlacaLista = true;
        menu.classList.add("placa-lista");
    });
}

function terminarPresentacionPlaca() {
    if (!presentacionPlacaActiva || !presentacionPlacaLista) return;

    const menu = document.getElementById("menuBiblioteca");

    if (!menu) return;

    limpiarPresentacionPlaca(menu);
    menu.classList.add("mostrar-catalogo");
}

function programarFasePlaca(espera, fase) {
    temporizadoresPlaca.push(setTimeout(fase, espera));
}

function limpiarPresentacionPlaca(menu) {
    temporizadoresPlaca.forEach(clearTimeout);
    temporizadoresPlaca = [];
    presentacionPlacaActiva = false;
    presentacionPlacaLista = false;
    menu.classList.remove(...FASES_PLACA);
}

function seleccionarLibro(indice) {
    libroSeleccionado = indice;
    paginaSeleccionada = 0;

    const lista = document.getElementById("librosDisponibles");
    const titulo = document.getElementById("tituloLibroActual");

    if (!lista || !titulo) return;

    lista.innerHTML = "";

    librosBiblioteca.forEach((libro, indiceLibro) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "libro-disponible";
        boton.textContent = libro;
        boton.classList.toggle("seleccionado", indiceLibro === indice);
        boton.addEventListener("click", () => seleccionarLibro(indiceLibro));
        lista.appendChild(boton);
    });

    titulo.textContent = librosBiblioteca[indice];
    mostrarPaginaLibro();
}

function mostrarPaginaLibro() {
    const pagina = document.getElementById("paginaLibroActual");
    const contador = document.getElementById("contadorPagina");
    const anterior = document.getElementById("paginaAnterior");
    const siguiente = document.getElementById("paginaSiguiente");

    if (!pagina || !contador || !anterior || !siguiente) return;

    const esLibroCorrecto =
        librosBiblioteca[libroSeleccionado] === "Los Misterios del Cielo";
    const esPaginaDocumento = esLibroCorrecto && paginaSeleccionada === 3;

    pagina.innerHTML = esPaginaDocumento
        ? `<p>Entre las anotaciones sobre los ciclos celestes encuentras un documento antiguo, cuidadosamente doblado.</p>
           <button id="recogerDocumentoAntiguo" class="boton-documento" type="button">Recoger documento antiguo</button>`
        : `<p>${paginasLibro[paginaSeleccionada]}</p>`;

    contador.textContent = `Página ${paginaSeleccionada + 1} de 5`;
    anterior.disabled = paginaSeleccionada === 0;
    siguiente.disabled = paginaSeleccionada === 4;

    const recoger = document.getElementById("recogerDocumentoAntiguo");
    recoger?.addEventListener("click", recogerDocumentoAntiguo);
}

function recogerDocumentoAntiguo() {
    if (typeof tieneObjeto === "function" && tieneObjeto("Documento1")) {
        cerrarBiblioteca();
        return;
    }

    agregarObjeto("Documento1");
    cerrarBiblioteca();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("cerrarBiblioteca")?.addEventListener("click", cerrarBiblioteca);

    // Volver a leer la placa una vez descubierta.
    document.getElementById("placaBiblioteca")?.addEventListener("click", () => {
        if (!presentacionPlacaActiva) {
            presentarPlacaBiblioteca(false);
        }
    });

    document.getElementById("menuBiblioteca")?.addEventListener("click", () => {
        if (presentacionPlacaActiva) {
            terminarPresentacionPlaca();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (!bibliotecaAbierta || e.repeat) return;

        const tecla = e.key.toLowerCase();

        if (tecla !== "e" && tecla !== " " && tecla !== "enter") return;

        if (presentacionPlacaActiva) {
            e.preventDefault();
            terminarPresentacionPlaca();
            return;
        }

        if (tecla === "enter" && document.activeElement?.id === "placaBiblioteca") {
            e.preventDefault();
            presentarPlacaBiblioteca(false);
        }
    });
    document.getElementById("paginaAnterior")?.addEventListener("click", () => {
        if (paginaSeleccionada > 0) {
            paginaSeleccionada--;
            mostrarPaginaLibro();
        }
    });
    document.getElementById("paginaSiguiente")?.addEventListener("click", () => {
        if (paginaSeleccionada < 4) {
            paginaSeleccionada++;
            mostrarPaginaLibro();
        }
    });
});

