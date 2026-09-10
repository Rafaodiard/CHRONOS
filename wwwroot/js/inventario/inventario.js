let inventario = [];

function agregarObjeto(idObjeto, cantidad = 1) {
    const objeto = inventario.find(objeto => objeto.id === idObjeto);

    if (objeto) {
        objeto.cantidad += cantidad;
        return;
    }

    inventario.push({
        id: idObjeto,
        cantidad: cantidad
    });
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

    return true;
}

agregarObjeto("llave_bronce", 1);