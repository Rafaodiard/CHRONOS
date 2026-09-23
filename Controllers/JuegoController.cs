using Microsoft.AspNetCore.Mvc;
using EscapeRoom.Models;
using System.Text.Json;

namespace EscapeRoom.Controllers;

public class JuegoController : Controller
{
    public IActionResult Introduccion()
    {
        return RedirectToAction("Index", new { introduccion = true });
    }

    public IActionResult Index()
    {
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");

        if (usuarioId == null)
        {
            TempData["Error"] = "Debes iniciar sesión para continuar una partida.";
            return RedirectToAction("Index", "Account");
        }

        return View("~/Views/Juego/Juego.cshtml");
    }

[HttpPost]
public async Task<IActionResult> GuardarEstado()
{
    using var reader = new StreamReader(Request.Body);
    var cuerpo = await reader.ReadToEndAsync();

    var estado = JsonSerializer.Deserialize<EstadoPartida>(
        cuerpo,
        new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        }
    );

    if (estado == null)
    {
        return BadRequest();
    }

    int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");

    HttpContext.Session.SetString(
        "EstadoPartida",
        JsonSerializer.Serialize(estado)
    );

    if (usuarioId != null)
    {
        DB.GuardarPartida(usuarioId.Value, estado);
    }

    Console.WriteLine("ESTADO GUARDADO EN SESSION Y SQL:");
    Console.WriteLine(
        HttpContext.Session.GetString("EstadoPartida")
    );

    return Ok();
}
    [HttpPost]
    public IActionResult Completar()
    {
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");

        if (usuarioId == null)
        {
            return Unauthorized();
        }

        DB.MarcarJuegoCompletado(usuarioId.Value);
        return Ok();
    }

    public IActionResult Creditos()
    {
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");

        if (usuarioId == null || !DB.UsuarioCompletoJuego(usuarioId.Value))
        {
            return RedirectToAction("Index", "Home");
        }

        return View("~/Views/Juego/Creditos.cshtml");
    }

    [HttpGet]
    public IActionResult ObtenerEstado()
    {
        Console.WriteLine("SESSION GET: " + HttpContext.Session.Id);

        var datos = HttpContext.Session.GetString("EstadoPartida");

        if (datos == null)
        {
            int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");

            if (usuarioId != null)
            {
                var partidaGuardada = DB.ObtenerPartidaActual(usuarioId.Value);

                if (partidaGuardada != null)
                {
                    datos = JsonSerializer.Serialize(partidaGuardada);
                    HttpContext.Session.SetString("EstadoPartida", datos);
                }
            }
        }

        if (datos == null)
        {
            return Content("null", "application/json");
        }

        return Content(datos, "application/json");
    }
}