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
        return View("~/Views/Juego/Juego.cshtml");
    }

    [HttpPost]
    public IActionResult GuardarEstado([FromBody] EstadoPartida estado)
    {
        HttpContext.Session.SetString(
            "EstadoPartida",
            JsonSerializer.Serialize(estado)
        );

        return Ok();
    }
    [HttpGet]
    public IActionResult ObtenerEstado()
    {
        var datos = HttpContext.Session.GetString("EstadoPartida");

        if (datos == null)
        {
            return Content("null", "application/json");
        }

        return Content(datos, "application/json");
    }
}