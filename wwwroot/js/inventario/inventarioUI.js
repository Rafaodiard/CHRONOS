let inventarioAbierto = false;

function abrirInventario() {
    inventarioAbierto = true;

    const inventario = document.getElementById("inventario");

    if (!inventario) return;

    inventario.style.display = "block";

    actualizarInventarioUI();
}

function cerrarInventario() {
    inventarioAbierto = false;

    const inventario = document.getElementById("inventario");

    if (!inventario) return;

    inventario.style.display = "none";
}

function alternarInventario() {
    if (inventarioAbierto) {
        cerrarInventario();
    } else {
        abrirInventario();
    }
}

function actualizarInventarioUI() {
    const inventarioLista = document.getElementById("inventarioLista");

    if (!inventarioLista) return;

    inventarioLista.innerHTML = "";

    inventario.forEach(objetoInventario => {
        const objeto = Object.values(objetos).find(
            objeto => objeto.id === objetoInventario.id
        );

        if (!objeto) return;

        const elemento = document.createElement("div");

        elemento.textContent =
            `${objeto.nombre} ×${objetoInventario.cantidad}`;

        inventarioLista.appendChild(elemento);
    });
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
        e.preventDefault();
        alternarInventario();
    }
});

