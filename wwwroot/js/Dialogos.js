const dialogos =
{
    IntroduccionLaboratorio:
    [
        { tipo: "dialogo", personaje: "Investigadora", texto: "¿Finalmente despertaste?" },
        { tipo: "dialogo", personaje: "Investigadora", texto: "Pensé que ibas a tardar mucho más." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "Estás en el laboratorio de CHRONOS." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "La máquina funciona... pero tenemos un problema mucho más grave." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "Durante el experimento, algo salió mal y los fragmentos del núcleo temporal fueron expulsados hacia distintas épocas." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "Al principio pensamos que simplemente tendríamos que recuperarlos para reparar la máquina." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "Pero no es así." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "Los fragmentos mantienen estable la línea temporal." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "Sin ellos, el tiempo comienza a desestabilizarse." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "Si permanecen demasiado tiempo separados, los acontecimientos del pasado empezarán a cambiar." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "Y cuando el pasado cambia..." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "...también cambia nuestro presente." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "Todavía podemos utilizar CHRONOS para viajar a las épocas donde terminaron los fragmentos." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "Pero tenemos que recuperarlos antes de que la línea temporal colapse." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "El primer fragmento fue detectado en una época muy antigua." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "La Antigua Grecia." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "Tenemos que encontrarlo antes de que sea demasiado tarde." },
        { tipo: "dialogo", personaje: "Investigadora", texto: "Preparáte. El primer salto comienza ahora." }
    ],

    InvestigadoraInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Investigadora",
            texto: "Despertaste. El salto temporal nos dejó en un laboratorio que no reconozco."
        },
        {
            tipo: "dialogo",
            personaje: "Investigadora",
            texto: "CHRONOS perdió sus componentes durante la desincronización. Tenemos que encontrarlos antes de que la energía se agote."
        },
        {
            tipo: "dialogo",
            personaje: "Investigadora",
            texto: "Explorá el laboratorio y buscá cualquier rastro del primer fragmento temporal."
        }
    ],

    // =========================================================
    // ANTIGUA GRECIA
    // =========================================================

    Anciano:
    [
        {
            tipo: "dialogo",
            personaje: "Anciano",
            texto: "Hola, viajero. No pareces ser de esta isla.",
            imagen: "anciano.png"
        },
        {
            tipo: "dialogo",
            personaje: "Anciano",
            texto: "Hace poco vi una luz muy extraña caer cerca de la costa.",
            imagen: "anciano.png"
        },
        {
            tipo: "dialogo",
            personaje: "Anciano",
            texto: "Fue demasiado brillante para ser una antorcha o una estrella.",
            imagen: "anciano.png"
        },
        {
            tipo: "dialogo",
            personaje: "Anciano",
            texto: "El pescador estaba cerca cuando ocurrió. Quizás él pueda decirte algo más.",
            imagen: "anciano.png"
        }
    ],
    puertaAlmacen:
    [
        {
            tipo: "dialogo",
            personaje: "",
            texto: "Está cerrada con llave.",
        }
    ],
    puertaTemplo:
    [
        {
            tipo: "dialogo",
            personaje: "",
            texto: "No tienes permiso para entrar."
        }
    ],
    puertaTemploInterior:
    [
        {
            tipo: "dialogo",
            personaje: "",
            texto: "La puerta esta cerrada"
        }
    ],
    TrabajadorFabrica:
    [
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "¿Qué...? ¿De dónde saliste?"
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "No importa ahora. Si querés entrar a la fábrica, vas a tener que ayudarme."
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "La máquina que controla la puerta dejó de funcionar."
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "Intenté ponerla en marcha, pero los engranajes quedaron trabados."
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "Si conseguís hacer que vuelvan a sincronizarse, debería poder abrir la puerta."
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "Son cuatro engranajes. Cada uno afecta a los demás cuando lo movés."
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "Tenés que conseguir que todos queden en su posición inicial."
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "Cuando estén alineados, la máquina debería volver a funcionar."
        }
    ],
    TrabajadorFabricaDespues:
    [
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "Los engranajes siguen trabados."
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "Probá moverlos hasta que todos vuelvan a su posición inicial."
        }
    ],
    TrabajadorFabricaResuelto:
    [
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "¡Lo lograste!"
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "La máquina volvió a funcionar."
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "La puerta debería estar abierta ahora."
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "Podés entrar. Suerte ahí dentro... la vas a necesitar."
        }
    ],
    recepcionista:
    [
        { tipo: "dialogo", personaje: "Recepcionista", texto: "¿Vos sos el que arregló la máquina de la entrada?" },
        { tipo: "dialogo", personaje: "Recepcionista", texto: "No sé cómo lo hiciste, pero nos acabás de ahorrar un buen problema." },
        { tipo: "dialogo", personaje: "Recepcionista", texto: "Aunque arreglar esa máquina es lo de menos." },
        { tipo: "dialogo", personaje: "Recepcionista", texto: "Desde que instalaron el nuevo generador, toda la fábrica está funcionando de manera extraña." },
        { tipo: "dialogo", personaje: "Recepcionista", texto: "Las máquinas producen mucha más energía de la que deberían." },
        { tipo: "dialogo", personaje: "Recepcionista", texto: "Y cada tanto tenemos que detenerlas porque el sistema empieza a sobrecargarse." },
        { tipo: "dialogo", personaje: "Recepcionista", texto: "El ingeniero está en la sala de máquinas intentando averiguar qué está pasando." },
        { tipo: "dialogo", personaje: "Recepcionista", texto: "Si querés seguir avanzando, hablá con él." }
    ],
    IngenieroSalaMaquinas:
    [
        { tipo: "dialogo", personaje: "Ingeniero", texto: "Hay cinco máquinas funcionando y el fragmento sigue recibiendo energía." },
        { tipo: "dialogo", personaje: "Ingeniero", texto: "Para liberarlo hay que apagar las cinco: A, B, C, D y E. Podés hacerlo en el orden que quieras." },
        { tipo: "dialogo", personaje: "Ingeniero", texto: "Cada máquina tiene su propio panel de control. Acercate, presioná E y seguí las instrucciones del panel." },
        { tipo: "dialogo", personaje: "Ingeniero", texto: "Cuando la estabilices, vas a poder apagarla." }
    ],
    IngenieroSalaMaquinasDespues:
    [
        { tipo: "dialogo", personaje: "Ingeniero", texto: "Tenés que apagar las cinco máquinas, en el orden que quieras." },
        { tipo: "dialogo", personaje: "Ingeniero", texto: "Cada panel explica qué hacer para estabilizar su máquina antes de apagarla." }
    ],
    IngenieroPostDescarga:
    [
        { tipo: "dialogo", personaje: "Ingeniero", texto: "¡Ey! ¡Ey, despertá!" },
        { tipo: "dialogo", personaje: "Jugador", texto: "¿Qué pasó?" },
        { tipo: "dialogo", personaje: "Ingeniero", texto: "La energía del fragmento todavía estaba conectada." },
        { tipo: "dialogo", personaje: "Jugador", texto: "¿Pero no habíamos apagado todas las máquinas?" },
        { tipo: "dialogo", personaje: "Ingeniero", texto: "Sí... las máquinas. Me olvidé de algo." },
        { tipo: "dialogo", personaje: "Ingeniero", texto: "Apagarlas no era suficiente. Todavía quedaba energía acumulada en la línea principal." },
        { tipo: "dialogo", personaje: "Ingeniero", texto: "Antes de tocar el fragmento había que descargarla por completo." },
        { tipo: "dialogo", personaje: "Jugador", texto: "¿Y ahora?" },
        { tipo: "dialogo", personaje: "Ingeniero", texto: "Ahora tenemos un problema. La descarga activó el sistema de seguridad de la sala." },
        { tipo: "dialogo", personaje: "Ingeniero", texto: "Hay una cámara detrás de esa puerta que quedó bloqueada cuando empezó el colapso." },
        { tipo: "dialogo", personaje: "Ingeniero", texto: "Desde ahí podemos cortar la alimentación principal y descargar lo que queda." },
        { tipo: "dialogo", personaje: "Ingeniero", texto: "Pero vas a tener que entrar y hacerlo manualmente." }
    ],
    maquina1:
    [
        {
            tipo: "dialogo",
            personaje: "Máquina",
            texto: "Iniciando viaje temporal...",
            imagen: "maquina.png"
        },
        {
            tipo: "dialogo",
            personaje: "Máquina",
            texto: "Error: Iniciando autodiagnóstico...",
        },
        {
            tipo: "dialogo",
            personaje: "Máquina",
            texto: "Error: se requiere fragmento temporal para activar el viaje.",
        }
    ],
    PescadorInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "QUE QUERES?",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Estoy ocupado. Si buscás algo, preguntale a alguien que tenga tiempo para perder.",
            imagen: "pescador.png"
        }
    ],

    PescadorConAnciano:
    [
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "¿El anciano te mandó?",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Entonces supongo que puedo ayudarte.",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Vi algo extraño caer cerca de la costa.",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Cuando llegué encontré una piedra extraña. Brillaba de una forma que nunca había visto.",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Se la vendí al comerciante del pueblo.",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "También perdí una vieja llave de bronce cerca de la costa.",
            imagen: "pescador.png"
        }
    ],
    PescadorConAncianoYLlave:
    [
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "¿El anciano te mandó?",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Entonces supongo que puedo ayudarte.",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Vi algo extraño caer cerca de la costa.",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Cuando llegué encontré una piedra extraña. Brillaba de una forma que nunca había visto.",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Se la vendí al comerciante del pueblo.",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "También perdí una vieja llave de bronce cerca de la costa.",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Espera, ¿ya encontraste la llave?",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Es la llave del viejo almacén que está cerca del templo al norte.",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Hace años que casi nadie entra ahí.",
            imagen: "pescador.png"
        }
    ],

    PescadorConLlave:
    [
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Así que encontraste la llave.",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Es la llave del viejo almacén que está cerca del templo al norte.",
            imagen: "pescador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Pescador",
            texto: "Hace años que casi nadie entra ahí.",
            imagen: "pescador.png"
        }
    ],

    AlfareroInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Alfarero",
            texto: "¿Buscás alguna vasija?",
            imagen: "alfarero.png"
        },
        {
            tipo: "dialogo",
            personaje: "Alfarero",
            texto: "Tengo varias, pero no pienso regalar ninguna.",
            imagen: "alfarero.png"
        }
    ],

AlfareroConVasija:
[
    {
        tipo: "dialogo",
        personaje: "Alfarero",
        texto: "¿Dónde encontraste esta vasija?",
        imagen: "alfarero.png"
    },
    {
        tipo: "dialogo",
        personaje: "Alfarero",
        texto: "Es mucho más antigua de lo que parece.",
        imagen: "alfarero.png"
    },
    {
        tipo: "dialogo",
        personaje: "Alfarero",
        texto: "Está bastante dañada, pero todavía puedo restaurarla.",
        imagen: "alfarero.png"
    },
    {
        tipo: "dialogo",
        personaje: "Alfarero",
        texto: "Si querés, puedo arreglarla. Un comerciante podría pagar bastante por una pieza así.",
        imagen: "alfarero.png"
    },
    {
        tipo: "dialogo",
        personaje: "Alfarero",
        texto: "Dame un momento y te prepararé algo que pueda interesarle.",
        imagen: "alfarero.png"
    }
],

    ComercianteInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Comerciante",
            texto: "¿Querés comprar algo?",
            imagen: "comerciante.png"
        },
        {
            tipo: "dialogo",
            personaje: "Comerciante",
            texto: "Si no tenés nada que ofrecer, no tenemos nada de qué hablar.",
            imagen: "comerciante.png"
        }
    ],

    ComercianteConJarra:
    [
        {
            tipo: "dialogo",
            personaje: "Comerciante",
            texto: "¿Una jarra antigua?",
            imagen: "comerciante.png"
        },
        {
            tipo: "dialogo",
            personaje: "Comerciante",
            texto: "Esto es una pieza bastante interesante.",
            imagen: "comerciante.png"
        },
        {
            tipo: "dialogo",
            personaje: "Comerciante",
            texto: "El alfarero hizo un buen trabajo restaurándola.",
            imagen: "comerciante.png"
        },
        {
            tipo: "dialogo",
            personaje: "Comerciante",
            texto: "Puedo darte algo a cambio.",
            imagen: "comerciante.png"
        },
        {
            tipo: "dialogo",
            personaje: "Comerciante",
            texto: "Con esto vas a poder entrar al templo.",
            imagen: "comerciante.png"
        },
        {
            tipo: "dialogo",
            personaje: "Comerciante",
            texto: "El sacerdote sabe exactamente qué es la piedra.",
            imagen: "comerciante.png"
        }
    ],

    ComercianteFinal:
    [
        {
            tipo: "dialogo",
            personaje: "Comerciante",
            texto: "Ya te dije todo lo que sé.",
            imagen: "comerciante.png"
        },
        {
            tipo: "dialogo",
            personaje: "Comerciante",
            texto: "Si querés descubrir qué es esa piedra, hablá con el sacerdote.",
            imagen: "comerciante.png"
        }
    ],

    SacerdoteConInformacion:
    [
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Así que has venido en busca de la pieza que cayó del cielo.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Sé exactamente de qué hablas. La pieza está aquí, dentro del templo.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Pero no puedo entregártela simplemente porque la pidas.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "En este templo se encuentra un antiguo acertijo, creado hace siglos por nuestros antepasados.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Nadie ha conseguido resolverlo desde entonces.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Si realmente quieres esa pieza, tendrás que demostrar que eres digno de encontrarla.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Resuelve el acertijo y la pieza será tuya.",
            imagen: "sacerdote.png"
        }
    ],

        
        SacerdoteConAcertijo:
    [
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Lo has conseguido...",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Después de tantos siglos, finalmente alguien ha resuelto el acertijo.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Has demostrado que puedes recibir la llave.",
            imagen: "sacerdote.png"
        }
    ],

    EscribaInicial:
    [
        { tipo: "dialogo", personaje: "Escriba", texto: "¿Buscás algo?" },
        { tipo: "dialogo", personaje: "Escriba", texto: "Si querés acceder a las habitaciones superiores, necesitás mi autorización." },
        { tipo: "dialogo", personaje: "Escriba", texto: "Pero antes tengo que recuperar un documento muy importante que perdí." },
        { tipo: "dialogo", personaje: "Escriba", texto: "Lo perdí en la biblioteca de la sala de armas, la que está al sureste del castillo." },
        { tipo: "dialogo", personaje: "Escriba", texto: "Probablemente quedó guardado entre uno de los libros de ahí." },
        { tipo: "dialogo", personaje: "Escriba", texto: "Si lo encontrás, traémelo." }
    ],

    EscribaSinDocumento:
    [
        { tipo: "dialogo", personaje: "Escriba", texto: "¿Encontraste el documento?" },
        { tipo: "dialogo", personaje: "Escriba", texto: "Lo perdí en la biblioteca de la sala de armas. Probablemente esté entre uno de los libros de ahí." },
        { tipo: "dialogo", personaje: "Escriba", texto: "Sin ese registro no puedo darte la autorización." }
    ],

    EscribaConDocumento:
    [
        { tipo: "dialogo", personaje: "Escriba", texto: "¿Qué es eso que llevás?" },
        { tipo: "dialogo", personaje: "Escriba", texto: "¡El registro! Llevaba toda la mañana buscándolo." },
        { tipo: "dialogo", personaje: "Escriba", texto: "Si estabas buscando mi autorización, supongo que esto resuelve el asunto." },
        { tipo: "dialogo", personaje: "Escriba", texto: "Tomá. Mi sello debería ser suficiente para que el guardia te deje pasar." }
    ],

    EscribaDocumentoEncontrado:
    [
        { tipo: "dialogo", personaje: "Escriba", texto: "¿Encontraste el documento?" },
        { tipo: "dialogo", personaje: "Escriba", texto: "¡Excelente! Pensé que tendría que rehacer todos los registros." },
        { tipo: "dialogo", personaje: "Escriba", texto: "Como prometí, acá tenés mi autorización." },
        { tipo: "dialogo", personaje: "Escriba", texto: "Mostrásela al guardia de la entrada." }
    ],

    EscribaConPermiso:
    [
        { tipo: "dialogo", personaje: "Escriba", texto: "Ya tenés mi autorización." },
        { tipo: "dialogo", personaje: "Escriba", texto: "El guardia debería dejarte pasar sin problemas." }
    ],

    GuardiaInicial:
    [
        { tipo: "dialogo", personaje: "Guardia", texto: "¿Querés entrar a las habitaciones superiores?" },
        { tipo: "dialogo", personaje: "Guardia", texto: "Las habitaciones superiores están restringidas." },
        { tipo: "dialogo", personaje: "Guardia", texto: "Necesitás la autorización del escriba." }
    ],

    GuardiaSinPermiso:
    [
        { tipo: "dialogo", personaje: "Guardia", texto: "Ya te dije que no podés pasar." },
        { tipo: "dialogo", personaje: "Guardia", texto: "Necesitás la autorización del escriba." }
    ],

    GuardiaConPermiso:
    [
        { tipo: "dialogo", personaje: "Guardia", texto: "Veo el sello del escriba." },
        { tipo: "dialogo", personaje: "Guardia", texto: "Está bien. Podés pasar." }
    ],
    PistasPalancas:
    [
        { tipo: "dialogo", personaje: "Escrito Antiguo", texto: "El mecanismo que protege el pasaje secreto fue creado hace siglos." },
        { tipo: "dialogo", personaje: "Escrito Antiguo", texto: "Cada una de las cuatro salas del castillo tiene su propio PANEL DE PALANCAS: tres en la planta baja y uno en este piso." },
        { tipo: "dialogo", personaje: "Escrito Antiguo", texto: "Para abrir el pasaje tenés que ir a cada sala y activar las palancas correctas de su panel. Las palancas que no se nombran deben quedar inactivas." },
        { tipo: "dialogo", personaje: "Escrito Antiguo", texto: "En la sala de armas, donde descansa el acero: activá la segunda y la cuarta." },
        { tipo: "dialogo", personaje: "Escrito Antiguo", texto: "En la cámara olvidada, al final del pasillo norte: activá solo la primera." },
        { tipo: "dialogo", personaje: "Escrito Antiguo", texto: "En la sala del escriba, entre los libros: activá las dos últimas." },
        { tipo: "dialogo", personaje: "Escrito Antiguo", texto: "Aquí arriba, entre las estatuas: activá la primera y la tercera." },
        { tipo: "dialogo", personaje: "Escrito Antiguo", texto: "Cuando los cuatro paneles estén en orden, el pasaje se abrirá en este piso." }
    ]


    
};

let dialogoAbierto = false;
let dialogoActual = null;
let indiceDialogo = 0;
let bloquearE = false;
let npcDialogoActual = null;

function abrirDialogo(nombre, npc = null) {

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

    npcDialogoActual = npc;

    // Normalmente ya viene activa desde el fundido del fragmento; no se reinicia para no cortarla.
    if (nombre === "IngenieroPostDescarga" && !animacionDespertarActiva) {
        animacionDespertarActiva = true;
        frameAnimacion = 0;
        tiempoAnimacion = 0;
    }

    mostrarDialogo();
}

function abrirDialogoMensaje(texto) {

    dialogoActual = [
        {
            personaje: "",
            texto: texto
        }
    ];

    indiceDialogo = 0;
    dialogoAbierto = true;
    npcDialogoActual = null;

    mostrarDialogo();
}

function mostrarDialogo() {

    if (!dialogoAbierto || !dialogoActual) {
        return;
    }

    if (dialogoActual === dialogos.IngenieroPostDescarga && indiceDialogo >= 2) {
        animacionDespertarActiva = false;
        frameAnimacion = 0;
        tiempoAnimacion = 0;
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
    reproducirEfecto("dialogo");

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
        e.stopImmediatePropagation();

        indiceDialogo++;

        if (modoIntroduccion && dialogoActual === dialogos.IntroduccionLaboratorio && indiceDialogo >= 3) {
            introAnimacionNormal = true;
            jugador.moviendose = false;
            frameAnimacion = 0;
            tiempoAnimacion = 0;
        }

        mostrarDialogo();
    }
});
function cerrarDialogo() {

    if (npcDialogoActual && npcDialogoActual.alTerminar) {
        npcDialogoActual.alTerminar();
    }

    npcDialogoActual = null;

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