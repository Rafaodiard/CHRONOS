using System;

namespace EscapeRoom.Models;

public class Usuarios
{
    public int ID { get; set; }
    public string Nombre { get; set; }
    public string Usuario { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public DateTime FechaRegistro { get; set; }
}
