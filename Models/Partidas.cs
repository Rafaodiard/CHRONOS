using System;

namespace EscapeRoom.Models;

public class Partidas
{
    public int ID { get; set; }
    public int IDUsuario { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime UltimoGuardado { get; set; }
    public bool Finalizada { get; set; }
    public string EstadoJuego { get; set; } = string.Empty;
}
