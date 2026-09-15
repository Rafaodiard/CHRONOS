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
    renderizarFragmentosTemporales();

    const inventarioLista = document.getElementById("inventarioLista");

    if (!inventarioLista) return;

    inventarioLista.innerHTML = "";

    inventario.forEach(objetoInventario => {
        if (objetoInventario.id.startsWith("fragmento_temporal")) return;

        const objeto = Object.values(objetos).find(
            objeto => objeto.id === objetoInventario.id
        );

        if (!objeto) return;

        const elemento = document.createElement("article");
        elemento.className = "inventario-objeto";
        elemento.dataset.tipo = objeto.tipo;

        const icono = document.createElement("div");
        icono.className = "inventario-objeto-icono";
        icono.setAttribute("aria-hidden", "true");
        icono.textContent = objeto.tipo === "llave" ? "LL" : "MI";

        const contenido = document.createElement("div");
        contenido.className = "inventario-objeto-contenido";

        const etiquetaTipo = document.createElement("span");
        etiquetaTipo.className = "inventario-objeto-tipo";
        etiquetaTipo.textContent = objeto.tipo === "llave" ? "Llave" : "Mision";

        const nombre = document.createElement("h3");
        nombre.className = "inventario-objeto-nombre";
        nombre.textContent = objeto.nombre;

        const descripcion = document.createElement("p");
        descripcion.className = "inventario-objeto-descripcion";
        descripcion.textContent = objeto.descripcion;

        const cantidad = document.createElement("span");
        cantidad.className = "inventario-objeto-cantidad";
        cantidad.textContent = `x${objetoInventario.cantidad}`;

        contenido.append(etiquetaTipo, nombre, descripcion);
        elemento.append(icono, contenido, cantidad);

        inventarioLista.appendChild(elemento);
    });
}

function renderizarFragmentosTemporales() {
    const fragmentosLista = document.getElementById("fragmentosTemporalesLista");
    const progresoFragmentos = document.getElementById("progresoFragmentosTemporales");

    if (!fragmentosLista || !progresoFragmentos) return;

    const fragmentos = Object.values(objetos).filter(
        objeto => objeto.id.startsWith("fragmento_temporal")
    );
    const conseguidos = fragmentos.filter(fragmento => tieneObjeto(fragmento.id)).length;

    progresoFragmentos.textContent = `${conseguidos} / ${fragmentos.length}`;
    fragmentosLista.innerHTML = "";

    fragmentos.forEach(fragmento => {
        const conseguido = tieneObjeto(fragmento.id);
        const elemento = document.createElement("article");
        elemento.className = `fragmento-temporal ${conseguido ? "conseguido" : "pendiente"}`;
        elemento.dataset.estado = conseguido ? "conseguido" : "pendiente";

        const icono = document.createElement("div");
        icono.className = "fragmento-temporal-icono";
        icono.setAttribute("aria-hidden", "true");
        icono.textContent = conseguido ? "FT" : "?";

        const contenido = document.createElement("div");
        contenido.className = "fragmento-temporal-contenido";

        const nombre = document.createElement("h4");
        nombre.className = "fragmento-temporal-nombre";
        nombre.textContent = conseguido ? fragmento.nombre : `${fragmento.nombre} - ???`;

        const estado = document.createElement("span");
        estado.className = "fragmento-temporal-estado";
        estado.textContent = conseguido ? "Conseguido" : "No conseguido";

        const descripcion = document.createElement("p");
        descripcion.className = "fragmento-temporal-descripcion";
        descripcion.textContent = conseguido
            ? fragmento.descripcion
            : "Todavia no encontraste este fragmento.";

        contenido.append(nombre, estado, descripcion);
        elemento.append(icono, contenido);
        fragmentosLista.appendChild(elemento);
    });
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
        e.preventDefault();
        alternarInventario();
    }
});

