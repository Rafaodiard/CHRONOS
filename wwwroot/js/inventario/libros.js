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
}

function cerrarBiblioteca() {
    const menu = document.getElementById("menuBiblioteca");

    if (!menu) return;

    bibliotecaAbierta = false;
    menu.style.display = "none";
    menu.setAttribute("aria-hidden", "true");
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

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && bibliotecaAbierta) {
        cerrarBiblioteca();
    }
});