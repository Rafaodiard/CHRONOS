using Microsoft.AspNetCore.Mvc;
using EscapeRoom.Models;

namespace EscapeRoom.Controllers;

public class SalaController : Controller
{
   public IActionResult Introduccion()
    {
        return View();
    }
}