using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using EscapeRoom.Models;

namespace EscapeRoom.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");
        bool usuarioLogueado = usuarioId != null;
        bool tienePartidaGuardada = false;

        if (!string.IsNullOrWhiteSpace(HttpContext.Session.GetString("EstadoPartida")))
        {
            tienePartidaGuardada = true;
        }
        else if (usuarioId != null)
        {
            var partida = DB.ObtenerPartidaActual(usuarioId.Value);
            tienePartidaGuardada = partida != null;
        }

        ViewBag.UsuarioLogueado = usuarioLogueado;
        ViewBag.TienePartidaGuardada = tienePartidaGuardada;
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }
    public IActionResult NewGame()
    {
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");
        if (usuarioId == null)
        {
            return RedirectToAction("Index", "Account");
        }

        HttpContext.Session.Remove("EstadoPartida");
        DB.BorrarPartidasUsuario(usuarioId.Value);

        return RedirectToAction("Index", "Juego", new { introduccion = true, mapa = "/Maps/mapasJson/labo.tmj" });
    }
    public IActionResult NewGamePrueba()
    {
        return RedirectToAction("Index", "Juego", new { introduccion = true, mapa = "/Maps/mapasJson/labo.tmj" });
    }
    public IActionResult Login()
    {
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");
        int? IdUsuario = HttpContext.Session.GetInt32("UsuarioId");


        if (usuarioId == null)
        {
            return RedirectToAction("Index", "Account");
        }
        else
        {
            return RedirectToAction("Profile", "Account");
        }
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
