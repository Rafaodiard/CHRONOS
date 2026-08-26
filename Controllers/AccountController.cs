using Microsoft.AspNetCore.Mvc;
using TP04Prog.Models;

namespace TP04Prog.Controllers;

public class AccountController : Controller
{
    public IActionResult Index()
    {
        return View("LogIn");
    }

    public IActionResult Register()
    {
        return View();
    }

    public IActionResult ChangePassword()
    {
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");

        if (usuarioId == null)
        {
            return RedirectToAction("Index", "Account");
        }

        return View();
    }

    [HttpPost]
    public IActionResult Login(LogInViewModel l)
    {
        Usuario? u = DB.Login(l);

        if (u != null)
        {
            HttpContext.Session.SetInt32("UsuarioId", u.ID);

            return RedirectToAction("Index", "Sala");
        }

        ViewBag.Error = "Usuario o contraseña incorrectos";
        return View("LogIn");
    }

    [HttpPost]
    public IActionResult Register(Usuario u, string password2)
    {
        if (DB.UsuarioExiste(u.Usuario))
        {
            ViewBag.Error = "Ese usuario ya existe.";
            return View();
        }

        if (u.Password != password2)
        {
            ViewBag.Error = "Las contraseñas no coinciden.";
            return View();
        }

        DB.Register(u);

        LogInViewModel login = new LogInViewModel
        {
            usuario = u.Usuario,
            password = u.Password
        };

        Usuario? usuario = DB.Login(login);

        if (usuario != null)
        {
            HttpContext.Session.SetInt32("UsuarioId", usuario.ID);
        }

        return RedirectToAction("Index", "Sala");
    }

    [HttpPost]
    public IActionResult ChangePassword(
        string currentPassword,
        string newPassword,
        string confirmPassword)
    {
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");

        if (usuarioId == null)
        {
            return RedirectToAction("Index", "Account");
        }

        Usuario? usuario = DB.GetUsuarioById(usuarioId.Value);

        if (usuario == null)
        {
            return RedirectToAction("Index", "Account");
        }

        if (usuario.Password != currentPassword)
        {
            ViewBag.Error = "La contraseña actual es incorrecta.";
            return View();
        }

        if (newPassword != confirmPassword)
        {
            ViewBag.Error = "Las nuevas contraseñas no coinciden.";
            return View();
        }

        usuario.Password = newPassword;

        DB.UpdateUsuario(usuario);

        ViewBag.Message = "Contraseña cambiada exitosamente.";

        return View();
    }

    public IActionResult Logout()
    {
        HttpContext.Session.Clear();

        return RedirectToAction("Index", "Account");
    }
}