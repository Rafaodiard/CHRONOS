let inventario = [];

function agregarObjeto(idObjeto, cantidad = 1) {
    const objeto = inventario.find(objeto => objeto.id === idObjeto);

    if (objeto) {
        objeto.cantidad += cantidad;
    } else {
        inventario.push({
            id: idObjeto,
            cantidad: cantidad
        });
    }

    if (progreso && typeof progreso === "object") {
        progreso.objetosRecogidos ??= {};
        progreso.objetosRecogidos[idObjeto] = true;
    }

    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }
    mostrarMensajeObjetoRecibido(idObjeto);
}

function mostrarMensajeObjetoRecibido(idObjeto) {

    const objetoDefinido =
        Object.values(objetos).find(
            objeto => objeto.id === idObjeto
        );

    const nombreObjeto =
        objetoDefinido
            ? objetoDefinido.nombre
            : "Objeto desconocido";

    const mostrarMensaje = () => {
        abrirDialogoMensaje(
            `Recibiste ${nombreObjeto}`
        );
    };

    if (dialogoAbierto) {
        setTimeout(mostrarMensaje, 0);
        return;
    }

    mostrarMensaje();
}

function tieneObjeto(idObjeto) {
    return inventario.some(objeto => objeto.id === idObjeto);
}

function obtenerCantidad(idObjeto) {
    const objeto = inventario.find(objeto => objeto.id === idObjeto);

    return objeto ? objeto.cantidad : 0;
}

function quitarObjeto(idObjeto, cantidad = 1) {
    const objeto = inventario.find(objeto => objeto.id === idObjeto);

    if (!objeto) return false;

    objeto.cantidad -= cantidad;

    if (objeto.cantidad <= 0) {
        inventario = inventario.filter(objeto => objeto.id !== idObjeto);
    }

    if (typeof marcarEstadoModificado === "function") {
        marcarEstadoModificado();
    }
    return true;
}

