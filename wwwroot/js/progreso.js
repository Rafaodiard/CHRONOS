const progreso = {
    introduccionCompletada: localStorage.getItem("chronosIntroduccionCompletada") === "true",
    objetosRecogidos: {},
    habloConAnciano: false,
    habloConPescador: false,
    habloConPescadorDespuesDeAnciano: false,
    habloConComerciante: false,
    encontroSimboloSol: false,
    encontroSimboloMar: false,
    encontroSimboloTiempo: false,
    habloConSacerdote: false,
    puedeEntrarTemplo: false,

    habloConAldeano: false,
    habloConGuardia: false,
    habloConEscriba: false,
    tienePermisoEscriba: false,
    consiguioHerramienta: false,

    habloConTrabajador: false,
    habloConEncargado: false,
    encontroEngranaje: false,
    reparoMaquina: false,

    consiguioTarjeta: false,
    encontroDisquete: false,
    encontroCodigo: false,
    leyoInvestigacion: false
    ,
    // bandera para indicar que el guardia llegó y desbloqueó la puerta
    guardiaLlegado: false,
    guardiaX: null,
    guardiaY: null,
    palancasResueltas: false,
    palancasEstado: {}
};