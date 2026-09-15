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

        return RedirectToAction("Index", "Juego", new { introduccion = true });
    }
    public IActionResult NewGamePrueba()
    {
        return RedirectToAction("Index", "Juego", new { introduccion = true });
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
