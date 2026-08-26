using System;

namespace EscapeRoom.Models;

public class Partidas
{
    public int ID { get; set; }
    public int IDUsuario { get; set; }
    public int IDSala { get; set; }
    public int IDCheckPoint { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime UltimoGuardado { get; set; }
    public bool Finalizada { get; set; }
}
