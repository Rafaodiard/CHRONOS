namespace EscapeRoom.Models;

public class EstadoPartida
{
    public float PosicionX { get; set; }
    public float PosicionY { get; set; }

    public string MapaActual { get; set; } = "";

    public List<ObjetoPartida> Inventario { get; set; } = new();

    public Dictionary<string, bool> Progreso { get; set; } = new();
}

public class ObjetoPartida
{
    public string Id { get; set; } = "";
    public int Cantidad { get; set; }
}