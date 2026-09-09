const dialogos = 
{
    Anciano:
    [
        {
            tipo: "dialogo",
            personaje: "Anciano",
            texto: "Hola, viajero.",
            imagen: "anciano.png"
        },
        {
            tipo: "dialogo",
            personaje: "Anciano",
            texto: "No pareces ser de estas tierras.",
            imagen: "anciano.png"
        },
        {
            tipo: "dialogo",
            personaje: "Anciano",
            texto: "¿Acaso has llegado desde otro tiempo?",
            imagen: "anciano.png"
        },
        {
            tipo: "dialogo",
            personaje: "Anciano",
            texto: "Si buscas respuestas, deberías visitar el templo.",
            imagen: "anciano.png"
        }
    ],
    Sacerdote:[

    ]
};

let dialogoAbierto = false;
let dialogoActual = null;
let indiceDialogo = 0;
let bloquearE = false;

function abrirDialogo(nombre) {
        console.log("ABRIENDO DIALOGO");

    if (typeof dialogos === "undefined") {

        console.error("No existe dialogos.js");
        return;

    }

    if (!dialogos[nombre]) {

        console.error("No existe el diálogo:", nombre);
        return;

    }

    dialogoActual = dialogos[nombre];
    indiceDialogo = 0;
    dialogoAbierto = true;

    mostrarDialogo();
}

function mostrarDialogo() {

    if (!dialogoAbierto || !dialogoActual) {
        return;
    }

    if (indiceDialogo >= dialogoActual.length) {

        cerrarDialogo();
        return;

    }

    const dialogo =
        dialogoActual[indiceDialogo];

    const caja =
        document.getElementById("dialogo");

    const nombre =
        document.getElementById("nombrePersonaje");

    const texto =
        document.getElementById("texto");

    const imagen =
        document.getElementById("imagenPersonaje");

    if (!caja || !nombre || !texto) {
        return;
    }

    caja.style.display = "flex";

    nombre.textContent =
        dialogo.personaje;

    texto.textContent =
        dialogo.texto;

    if (imagen && dialogo.imagen) {

        imagen.style.backgroundImage =
            `url('/img/personajes/${dialogo.imagen}')`;

        imagen.style.backgroundSize =
            "contain";

        imagen.style.backgroundRepeat =
            "no-repeat";

        imagen.style.backgroundPosition =
            "center";

        imagen.textContent = "";

    }
}

document.addEventListener("keydown", function (e) {
    if (!dialogoAbierto) {
        return;
    }

    const tecla = e.key.toLowerCase();

    if (
        e.key === "Enter" ||
        e.key === " " ||
        tecla === "e"
    ) {
        e.preventDefault();
        e.stopPropagation();

        indiceDialogo++;
        mostrarDialogo();
    }
});

function cerrarDialogo() {
    dialogoAbierto = false;
    dialogoActual = null;
    indiceDialogo = 0;

    const caja = document.getElementById("dialogo");

    if (caja) {
        caja.style.display = "none";
    }

    setTimeout(function () {
        puedeHablar = true;
    }, 500);
}