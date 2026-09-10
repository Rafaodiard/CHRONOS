const dialogos =
{
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
            texto: "También perdí una vieja llave de bronce mientras buscaba por la costa.",
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
            texto: "Es la llave del viejo almacén que está cerca de la costa.",
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

    AlfareroConInformacion:
    [
        {
            tipo: "dialogo",
            personaje: "Alfarero",
            texto: "¿Una jarra antigua?",
            imagen: "alfarero.png"
        },
        {
            tipo: "dialogo",
            personaje: "Alfarero",
            texto: "Sí, puedo hacer una. Pero me va a llevar un momento.",
            imagen: "alfarero.png"
        },
        {
            tipo: "dialogo",
            personaje: "Alfarero",
            texto: "Los comerciantes suelen pagar bastante por las piezas antiguas.",
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
            texto: "Eso sí que me interesa.",
            imagen: "comerciante.png"
        },
        {
            tipo: "dialogo",
            personaje: "Comerciante",
            texto: "Aceptaré la jarra a cambio de información.",
            imagen: "comerciante.png"
        },
        {
            tipo: "dialogo",
            personaje: "Comerciante",
            texto: "La piedra que encontró el pescador fue llevada al templo.",
            imagen: "comerciante.png"
        },
        {
            tipo: "dialogo",
            personaje: "Comerciante",
            texto: "El sacerdote sabe exactamente qué es.",
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

    SacerdoteInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Detente.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "No puedes entrar al templo.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Solo quienes conocen los símbolos sagrados pueden atravesar sus puertas.",
            imagen: "sacerdote.png"
        }
    ],

    SacerdoteConInformacion:
    [
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Así que has venido por la piedra extraña.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Lo que buscas está dentro del templo.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Pero primero debes encontrar los tres símbolos.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "El Sol, el Mar y el Tiempo.",
            imagen: "sacerdote.png"
        }
    ],

    SacerdoteConSimbolos:
    [
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Has encontrado los tres símbolos.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Entonces las puertas del templo se abrirán para ti.",
            imagen: "sacerdote.png"
        },
        {
            tipo: "dialogo",
            personaje: "Sacerdote",
            texto: "Pero ten cuidado con lo que encuentres allí.",
            imagen: "sacerdote.png"
        }
    ],


    // =========================================================
    // EDAD MEDIA
    // =========================================================

    AldeanoInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Aldeano",
            texto: "¿Sos nuevo por acá?",
            imagen: "aldeano.png"
        },
        {
            tipo: "dialogo",
            personaje: "Aldeano",
            texto: "Últimamente están pasando cosas extrañas alrededor de la fortaleza.",
            imagen: "aldeano.png"
        },
        {
            tipo: "dialogo",
            personaje: "Aldeano",
            texto: "Los guardias no dejan que nadie se acerque.",
            imagen: "aldeano.png"
        }
    ],

    AldeanoAvanzado:
    [
        {
            tipo: "dialogo",
            personaje: "Aldeano",
            texto: "¿Todavía estás investigando la fortaleza?",
            imagen: "aldeano.png"
        },
        {
            tipo: "dialogo",
            personaje: "Aldeano",
            texto: "Entonces hablá con el escriba. Él sabe más de lo que cuenta.",
            imagen: "aldeano.png"
        }
    ],

    GuardiaInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Guardia",
            texto: "Alto.",
            imagen: "guardia.png"
        },
        {
            tipo: "dialogo",
            personaje: "Guardia",
            texto: "No podés entrar a la fortaleza.",
            imagen: "guardia.png"
        },
        {
            tipo: "dialogo",
            personaje: "Guardia",
            texto: "Volvé al pueblo.",
            imagen: "guardia.png"
        }
    ],

    GuardiaConInformacion:
    [
        {
            tipo: "dialogo",
            personaje: "Guardia",
            texto: "¿Venís por los rumores de la fortaleza?",
            imagen: "guardia.png"
        },
        {
            tipo: "dialogo",
            personaje: "Guardia",
            texto: "No sé qué está pasando ahí dentro.",
            imagen: "guardia.png"
        },
        {
            tipo: "dialogo",
            personaje: "Guardia",
            texto: "Pero el escriba tiene una llave que podría ayudarte.",
            imagen: "guardia.png"
        }
    ],

    EscribaInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Escriba",
            texto: "¿Qué necesitás?",
            imagen: "escriba.png"
        },
        {
            tipo: "dialogo",
            personaje: "Escriba",
            texto: "No tengo tiempo para hablar con curiosos.",
            imagen: "escriba.png"
        }
    ],

    EscribaConInformacion:
    [
        {
            tipo: "dialogo",
            personaje: "Escriba",
            texto: "Así que estás investigando la fortaleza.",
            imagen: "escriba.png"
        },
        {
            tipo: "dialogo",
            personaje: "Escriba",
            texto: "Encontré registros sobre una cámara cerrada dentro de ella.",
            imagen: "escriba.png"
        },
        {
            tipo: "dialogo",
            personaje: "Escriba",
            texto: "Tengo una llave, pero necesito una herramienta para abrir el mecanismo.",
            imagen: "escriba.png"
        },
        {
            tipo: "dialogo",
            personaje: "Escriba",
            texto: "El herrero quizás pueda ayudarte.",
            imagen: "escriba.png"
        }
    ],

    HerreroInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Herrero",
            texto: "¿Qué necesitás?",
            imagen: "herrero.png"
        },
        {
            tipo: "dialogo",
            personaje: "Herrero",
            texto: "Estoy trabajando. Volvé cuando tengas algo que reparar.",
            imagen: "herrero.png"
        }
    ],

    HerreroConInformacion:
    [
        {
            tipo: "dialogo",
            personaje: "Herrero",
            texto: "¿Una herramienta para abrir un mecanismo?",
            imagen: "herrero.png"
        },
        {
            tipo: "dialogo",
            personaje: "Herrero",
            texto: "Puedo darte una.",
            imagen: "herrero.png"
        },
        {
            tipo: "dialogo",
            personaje: "Herrero",
            texto: "Pero tené cuidado. Algunos mecanismos de la fortaleza son bastante viejos.",
            imagen: "herrero.png"
        }
    ],

    HerreroFinal:
    [
        {
            tipo: "dialogo",
            personaje: "Herrero",
            texto: "¿Encontraste algo en la fortaleza?",
            imagen: "herrero.png"
        },
        {
            tipo: "dialogo",
            personaje: "Herrero",
            texto: "No me sorprende. Ese lugar guarda secretos desde hace siglos.",
            imagen: "herrero.png"
        }
    ],


    // =========================================================
    // REVOLUCIÓN INDUSTRIAL
    // =========================================================

    TrabajadorInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "¿Qué hacés acá?",
            imagen: "trabajador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "La fábrica no es un lugar para visitantes.",
            imagen: "trabajador.png"
        }
    ],

    TrabajadorConInformacion:
    [
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "¿Buscás información sobre las máquinas?",
            imagen: "trabajador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "Últimamente algunas funcionan solas.",
            imagen: "trabajador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "El encargado está tratando de descubrir qué pasa.",
            imagen: "trabajador.png"
        }
    ],

    TrabajadorAvanzado:
    [
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "Encontraste algo, ¿no?",
            imagen: "trabajador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "El ingeniero está en la sala de máquinas.",
            imagen: "trabajador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Trabajador",
            texto: "Si alguien entiende esas máquinas, es él.",
            imagen: "trabajador.png"
        }
    ],

    EncargadoInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Encargado",
            texto: "¿Quién te dejó entrar?",
            imagen: "encargado.png"
        },
        {
            tipo: "dialogo",
            personaje: "Encargado",
            texto: "Volvé por donde viniste.",
            imagen: "encargado.png"
        }
    ],

    EncargadoConInformacion:
    [
        {
            tipo: "dialogo",
            personaje: "Encargado",
            texto: "El trabajador te mandó conmigo, ¿verdad?",
            imagen: "encargado.png"
        },
        {
            tipo: "dialogo",
            personaje: "Encargado",
            texto: "Hay una máquina que lleva días funcionando de manera extraña.",
            imagen: "encargado.png"
        },
        {
            tipo: "dialogo",
            personaje: "Encargado",
            texto: "El ingeniero está intentando repararla.",
            imagen: "encargado.png"
        }
    ],

    IngenieroInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Ingeniero",
            texto: "No me molestes mientras trabajo.",
            imagen: "ingeniero.png"
        },
        {
            tipo: "dialogo",
            personaje: "Ingeniero",
            texto: "Tengo una máquina fuera de control.",
            imagen: "ingeniero.png"
        }
    ],

    IngenieroConEngranaje:
    [
        {
            tipo: "dialogo",
            personaje: "Ingeniero",
            texto: "¿Encontraste un engranaje?",
            imagen: "ingeniero.png"
        },
        {
            tipo: "dialogo",
            personaje: "Ingeniero",
            texto: "Perfecto. Eso es exactamente lo que necesito.",
            imagen: "ingeniero.png"
        },
        {
            tipo: "dialogo",
            personaje: "Ingeniero",
            texto: "Con esto debería poder activar el mecanismo.",
            imagen: "ingeniero.png"
        }
    ],

    IngenieroFinal:
    [
        {
            tipo: "dialogo",
            personaje: "Ingeniero",
            texto: "La máquina ya funciona.",
            imagen: "ingeniero.png"
        },
        {
            tipo: "dialogo",
            personaje: "Ingeniero",
            texto: "Pero encontré algo que no debería existir.",
            imagen: "ingeniero.png"
        },
        {
            tipo: "dialogo",
            personaje: "Ingeniero",
            texto: "Hay planos de una tecnología que está décadas adelantada a la nuestra.",
            imagen: "ingeniero.png"
        }
    ],


    // =========================================================
    // AÑOS 80
    // =========================================================

    InvestigadorInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Investigador",
            texto: "¿Quién sos?",
            imagen: "investigador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Investigador",
            texto: "Esta instalación no está abierta al público.",
            imagen: "investigador.png"
        }
    ],

    InvestigadorConTarjeta:
    [
        {
            tipo: "dialogo",
            personaje: "Investigador",
            texto: "¿Te dieron acceso?",
            imagen: "investigador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Investigador",
            texto: "Entonces probablemente estés buscando lo mismo que nosotros.",
            imagen: "investigador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Investigador",
            texto: "Hay registros sobre experimentos que nunca deberían haberse realizado.",
            imagen: "investigador.png"
        }
    ],

    InvestigadorAvanzado:
    [
        {
            tipo: "dialogo",
            personaje: "Investigador",
            texto: "Encontraste el disquete.",
            imagen: "investigador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Investigador",
            texto: "Entonces ya podés acceder a los registros antiguos.",
            imagen: "investigador.png"
        },
        {
            tipo: "dialogo",
            personaje: "Investigador",
            texto: "Buscá cualquier referencia a experimentos temporales.",
            imagen: "investigador.png"
        }
    ],

    TecnicoInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Técnico",
            texto: "Estoy ocupado.",
            imagen: "tecnico.png"
        },
        {
            tipo: "dialogo",
            personaje: "Técnico",
            texto: "Si necesitás entrar a alguna sala, necesitás una tarjeta.",
            imagen: "tecnico.png"
        }
    ],

    TecnicoConTarjeta:
    [
        {
            tipo: "dialogo",
            personaje: "Técnico",
            texto: "¿Ya conseguiste una tarjeta?",
            imagen: "tecnico.png"
        },
        {
            tipo: "dialogo",
            personaje: "Técnico",
            texto: "Bien. Algunas puertas requieren además un código.",
            imagen: "tecnico.png"
        },
        {
            tipo: "dialogo",
            personaje: "Técnico",
            texto: "El código debería estar en los registros del laboratorio.",
            imagen: "tecnico.png"
        }
    ],

    TecnicoFinal:
    [
        {
            tipo: "dialogo",
            personaje: "Técnico",
            texto: "¿Llegaste hasta la sala de comunicaciones?",
            imagen: "tecnico.png"
        },
        {
            tipo: "dialogo",
            personaje: "Técnico",
            texto: "Entonces ya viste la señal.",
            imagen: "tecnico.png"
        },
        {
            tipo: "dialogo",
            personaje: "Técnico",
            texto: "Nadie sabe de dónde viene.",
            imagen: "tecnico.png"
        }
    ],

    Guardia80Inicial:
    [
        {
            tipo: "dialogo",
            personaje: "Guardia",
            texto: "Identificación.",
            imagen: "guardia80.png"
        },
        {
            tipo: "dialogo",
            personaje: "Guardia",
            texto: "Sin autorización no podés pasar.",
            imagen: "guardia80.png"
        }
    ],

    Guardia80ConTarjeta:
    [
        {
            tipo: "dialogo",
            personaje: "Guardia",
            texto: "La tarjeta parece válida.",
            imagen: "guardia80.png"
        },
        {
            tipo: "dialogo",
            personaje: "Guardia",
            texto: "Podés pasar a las oficinas.",
            imagen: "guardia80.png"
        },
        {
            tipo: "dialogo",
            personaje: "Guardia",
            texto: "Pero el acceso al laboratorio principal sigue restringido.",
            imagen: "guardia80.png"
        }
    ],

    InvestigadorPrincipalInicial:
    [
        {
            tipo: "dialogo",
            personaje: "Investigador Principal",
            texto: "¿Cómo llegaste hasta acá?",
            imagen: "investigadorPrincipal.png"
        },
        {
            tipo: "dialogo",
            personaje: "Investigador Principal",
            texto: "Este laboratorio debería estar completamente aislado.",
            imagen: "investigadorPrincipal.png"
        }
    ],

    InvestigadorPrincipalConRegistros:
    [
        {
            tipo: "dialogo",
            personaje: "Investigador Principal",
            texto: "Entonces encontraste nuestros registros.",
            imagen: "investigadorPrincipal.png"
        },
        {
            tipo: "dialogo",
            personaje: "Investigador Principal",
            texto: "Hace años intentamos estudiar algo que llamábamos desplazamiento temporal.",
            imagen: "investigadorPrincipal.png"
        },
        {
            tipo: "dialogo",
            personaje: "Investigador Principal",
            texto: "Pero los experimentos terminaron cuando comenzaron a aparecer anomalías.",
            imagen: "investigadorPrincipal.png"
        },
        {
            tipo: "dialogo",
            personaje: "Investigador Principal",
            texto: "Nunca encontramos el origen de esas anomalías.",
            imagen: "investigadorPrincipal.png"
        }
    ],

    InvestigadorPrincipalFinal:
    [
        {
            tipo: "dialogo",
            personaje: "Investigador Principal",
            texto: "Ese fragmento que llevás no pertenece a esta época.",
            imagen: "investigadorPrincipal.png"
        },
        {
            tipo: "dialogo",
            personaje: "Investigador Principal",
            texto: "Y si apareció acá, significa que alguien o algo está alterando el tiempo.",
            imagen: "investigadorPrincipal.png"
        },
        {
            tipo: "dialogo",
            personaje: "Investigador Principal",
            texto: "Tenés que volver al momento del que viniste.",
            imagen: "investigadorPrincipal.png"
        }
    ]
};

let dialogoAbierto = false;
let dialogoActual = null;
let indiceDialogo = 0;
let bloquearE = false;
let npcDialogoActual = null;

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