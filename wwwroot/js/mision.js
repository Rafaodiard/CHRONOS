// =========================================================
// PANEL DE MISIÓN
// =========================================================
// Muestra arriba de la pantalla qué tiene que hacer el jugador en cada momento.
// Indica el objetivo o adónde ir, nunca la solución de un acertijo.

const MAPAS_MISION = {
    grecia: "/Maps/mapasJson/AncientGreek.tmj",
    almacen: "/Maps/mapasJson/AlmacenGrecia.tmj",
    templo: "/Maps/mapasJson/TemploGrecia.tmj",
    camaraTemplo: "/Maps/mapasJson/fragtemp1.tmj",
    castilloExterior: "/Maps/mapasJson/castillo edad media .tmj",
    castillo: "/Maps/mapasJson/CastilloPrincipal.tmj",
    castilloPiso2: "/Maps/mapasJson/CastilloPiso2.tmj",
    pasajeSecreto: "/Maps/mapasJson/fragtemp2.tmj",
    fabricaEntrada: "/Maps/mapasJson/IntroRev.tmj",
    recepcion: "/Maps/mapasJson/recepcion.tmj",
    salaMaquinas: "/Maps/mapasJson/SalaMaquinas.tmj",
    salaElectricidad: "/Maps/mapasJson/SalaElectricidad.tmj"
};

const EPOCAS_MISION = [
    { nombre: "Antigua Grecia", mapas: ["grecia", "almacen", "templo", "camaraTemplo"], mision: misionGrecia },
    { nombre: "Edad Media", mapas: ["castilloExterior", "castillo", "castilloPiso2", "pasajeSecreto"], mision: misionEdadMedia },
    { nombre: "Revolución Industrial", mapas: ["fabricaEntrada", "recepcion", "salaMaquinas", "salaElectricidad"], mision: misionRevolucionIndustrial }
];

// Algunas transiciones de Tiled escriben la ruta con otra capitalización (p. ej. "temploGrecia.tmj").
function enMapaMision(...claves) {
    const ruta = String(typeof rutaMapa !== "undefined" ? rutaMapa : "").trim().toLowerCase();
    return claves.some(clave => MAPAS_MISION[clave].toLowerCase() === ruta);
}

function misionGrecia() {
    if (tieneObjeto("fragmento_temporal1")) {
        return "Volver a la máquina del tiempo";
    }

    if (tieneObjeto("llave_templo")) {
        if (enMapaMision("camaraTemplo")) return "Tomar el fragmento temporal";
        if (enMapaMision("templo")) return "Abrir la puerta del fondo del templo";
        return "Volver al templo y abrir la puerta del fondo";
    }

    if (progreso.puedeEntrarTemplo) {
        return enMapaMision("templo") ? "Hablar con el sacerdote" : "Volver al templo y hablar con el sacerdote";
    }

    if (tieneObjeto("sello_del_templo")) {
        if (!enMapaMision("templo")) return "Ir al templo";
        return progreso.sacerdoteExplicoAcertijo ? "Resolver el acertijo del templo" : "Hablar con el sacerdote";
    }

    if (tieneObjeto("vasija_antigua")) return "Llevarle la vasija al comerciante";
    if (tieneObjeto("vasija_rota")) return "Llevarle la vasija rota al alfarero";

    if (tieneObjeto("llave_bronce")) {
        return enMapaMision("almacen")
            ? "Revisar las vasijas del almacén"
            : "Abrir el almacén que está al norte, cerca del templo";
    }

    if (progreso.habloConPescadorDespuesDeAnciano) return "Buscar la llave de bronce cerca de la costa";
    if (progreso.habloConAnciano) return "Hablar con el pescador";
    return "Hablar con el anciano del pueblo";
}

function misionEdadMedia() {
    if (tieneObjeto("fragmento_temporal2")) {
        return "Volver a la máquina del tiempo, afuera del castillo";
    }

    if (progreso.palancasResueltas) {
        if (enMapaMision("pasajeSecreto")) return "Abrir el cofre";
        if (enMapaMision("castilloPiso2")) return "Entrar al pasaje secreto que se abrió en este piso";
        return "Subir al segundo piso y entrar al pasaje secreto";
    }

    if (progreso.pistasPalancasLeidas) {
        const { correctos, total } = contarPanelesCorrectos();
        return `Activar las palancas correctas en el panel de cada sala (${correctos}/${total})`;
    }

    if (progreso.guardiaAutorizo || progreso.guardiaLlegado) {
        return enMapaMision("castilloPiso2") ? "Buscar el escrito antiguo de este piso" : "Subir al segundo piso";
    }

    if (progreso.tienePermisoEscriba) return "Mostrarle la autorización al guardia";
    if (tieneObjeto("Documento1")) return "Llevarle el documento al escriba";
    if (progreso.habloConEscriba) return "Buscar el documento entre los libros de la sala de armas";

    return enMapaMision("castilloExterior") ? "Entrar al castillo" : "Hablar con el escriba";
}

function misionRevolucionIndustrial() {
    if (tieneObjeto("fragmento_temporal3")) {
        return enMapaMision("fabricaEntrada")
            ? "Volver a la máquina del tiempo"
            : "Volver a la máquina del tiempo, en la entrada de la fábrica";
    }

    if (!progreso.reparoMaquina) {
        // habloConIngenieroIndustrial se marca al hablar con el trabajador de la entrada.
        return progreso.habloConIngenieroIndustrial
            ? "Sincronizar los engranajes de la máquina de la puerta"
            : "Hablar con el trabajador";
    }

    if (!progreso.habloConEncargado) {
        return enMapaMision("recepcion") ? "Hablar con la recepcionista" : "Entrar a la fábrica";
    }

    if (!progreso.habloConIngenieroMaquinas) {
        return enMapaMision("salaMaquinas") ? "Hablar con el ingeniero" : "Ir a la sala de máquinas";
    }

    if (!todasLasMaquinasApagadas()) {
        if (!enMapaMision("salaMaquinas")) return "Volver a la sala de máquinas";
        const apagadas = idsMaquinas.filter(id => obtenerEstadoMaquina(id)?.apagada).length;
        return `Apagar las cinco máquinas (${apagadas}/${idsMaquinas.length})`;
    }

    if (!progreso.fragmentoDescargaRealizada) return "Tomar el fragmento temporal";
    if (!progreso.dialogoPostDescargaCompletado) return "Escuchar al ingeniero";

    if (!progreso.panelDescargaCompletado) {
        return enMapaMision("salaElectricidad")
            ? "Conectar el circuito del panel de descarga"
            : "Entrar a la sala de electricidad y descargar la energía";
    }

    return enMapaMision("salaMaquinas")
        ? "Tomar el fragmento temporal"
        : "Volver a la sala de máquinas y tomar el fragmento";
}

function obtenerMisionActual() {
    if (typeof progreso !== "object" || !progreso) {
        return null;
    }

    if (typeof modoIntroduccion !== "undefined" && modoIntroduccion) {
        return null;
    }

    const epoca = EPOCAS_MISION.find(item => enMapaMision(...item.mapas));

    if (!epoca) {
        return null;
    }

    return { epoca: epoca.nombre, texto: epoca.mision() };
}

let misionMostrada = "";

function actualizarPanelMision() {
    const panel = document.getElementById("panelMision");
    const texto = document.getElementById("textoMision");
    const epoca = document.getElementById("epocaMision");

    if (!panel || !texto || !epoca) {
        return;
    }

    // Mientras se carga la partida o se cambia de mapa no se actualiza, para no mostrar
    // por un instante la misión de otra época.
    if (typeof mapa === "undefined" || !mapa) {
        return;
    }

    let mision = null;

    try {
        mision = obtenerMisionActual();
    } catch (error) {
        console.error("No se pudo calcular la misión actual:", error);
    }

    if (!mision) {
        panel.hidden = true;
        misionMostrada = "";
        return;
    }

    const clave = `${mision.epoca}|${mision.texto}`;

    if (clave === misionMostrada) {
        return;
    }

    const cambioDeMision = misionMostrada !== "";
    misionMostrada = clave;

    epoca.textContent = ` · ${mision.epoca.toUpperCase()}`;
    texto.textContent = mision.texto;
    panel.hidden = false;

    if (cambioDeMision) {
        panel.classList.remove("actualizada");
        void panel.offsetWidth;
        panel.classList.add("actualizada");
    }
}

setInterval(actualizarPanelMision, 250);
