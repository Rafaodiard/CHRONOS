using Microsoft.AspNetCore.Mvc;
using EscapeRoom.Models;

namespace EscapeRoom.Controllers;

public class SalaController : Controller
{
   public IActionResult Introduccion()
    {
        ViewBag.Dialogo = new DialogoViewModel
        {
            Fondo = "fondo_intro.jpg",
            Imagen = "imagen_intro.png",
            Secuencia = new List<Dialogo>
            {
                new Dialogo { tipo = "dialogo", Personaje = "Dr. Anderson", Texto = "¿Todos listos? Iniciamos la prueba en cinco segundos." },
                new Dialogo { tipo = "dialogo", Personaje = "Dra. MILLER", Texto = "Los sistemas están estables. Coordenadas fijadas en el año 2026." },
                new Dialogo { tipo = "dialogo", Personaje = "Dr. Anderson", Texto = "Perfecto. Iniciando salto temporal." },
                new Dialogo { tipo = "evento", Evento = "comienzoMaquina" },
                new Dialogo { tipo = "dialogo", Personaje = "Dra. MILLER", Texto = "Esperá... ¿qué está pasando?" },
                new Dialogo { tipo = "dialogo", Personaje = "Dr. Anderson", Texto = "¡No puede ser! ¡Estamos perdiendo las coordenadas!" },
                new Dialogo { tipo = "dialogo", Personaje = "Dra. MILLER", Texto = "¡La energía está cayendo!" },
                new Dialogo { tipo = "dialogo", Personaje = "Dr. Anderson", Texto = "¡Intentá cancelar el salto!" },
                new Dialogo { tipo = "dialogo", Personaje = "Dra. MILLER", Texto = "¡No puedo! ¡El sistema está bloqueado!" },
                new Dialogo { tipo = "evento", Evento = "sistemaBloqueado" },
                new Dialogo { tipo = "dialogo", Personaje = "Dra. MILLER", Texto = "...¿Donde estamos?" },
                new Dialogo { tipo = "dialogo", Personaje = "Dr. Anderson", Texto = "No lo sé" },
                new Dialogo { tipo = "dialogo", Personaje = "Dra. MILLER", Texto = "¿Y la máquina?" },
                new Dialogo { tipo = "dialogo", Personaje = "Dr. Anderson", Texto = "La energía está casi agotada." },
                new Dialogo { tipo = "dialogo", Personaje = "Dra. MILLER", Texto = "Entonces tenemos que volver ahora." },
                new Dialogo { tipo = "dialogo", Personaje = "Dr. Anderson", Texto = "No podemos. El salto se llevó parte de los componentes de CHRONOS." },
                new Dialogo { tipo = "dialogo", Personaje = "Dra. MILLER", Texto = "¿Y dónde están?" },
                new Dialogo { tipo = "dialogo", Personaje = "Dr. Anderson", Texto = "Dispersos por las épocas que atravesamos." },
                new Dialogo { tipo = "dialogo", Personaje = "Dra. MILLER", Texto = "¿Estás diciendo que tenemos que buscarlos... viajando por el pasado?" },
                new Dialogo { tipo = "dialogo", Personaje = "Dr. Anderson", Texto = "Exactamente." },
                new Dialogo { tipo = "evento", Evento = "mapaTemporal" },
                new Dialogo { tipo = "dialogo", Personaje = "SISTEMA CHRONOS", Texto = "FRAGMENTOS TEMPORALES DETECTADOS: 6\nENERGÍA RESTANTE: 18%\nDESTINO DE REGRESO: 2026" },
                new Dialogo { tipo = "dialogo", Personaje = "Dra. MILLER", Texto = "Tenemos una sola oportunidad." },
                new Dialogo { tipo = "dialogo", Personaje = "Dr. Anderson", Texto = "Entonces será mejor empezar." },
                new Dialogo { tipo = "evento", Evento = "fundidoNegro" },

            }
        };
        return View("Dialogo");
    }
}