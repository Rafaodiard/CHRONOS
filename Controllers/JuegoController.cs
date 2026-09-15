using Microsoft.AspNetCore.Mvc;
using EscapeRoom.Models;

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
}