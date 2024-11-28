using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Drawing;
using System.Numerics;
using System.Security.Claims;
using TK_ENERGY_GP_PORTAL.Models;
using TK_ENERGY_GP_PORTAL.Services.Contracts;

namespace TK_ENERGY_GP_PORTAL.Controllers
{

    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IFuncionarioService _funcionario;


        public HomeController(ILogger<HomeController> logger, IFuncionarioService funcionario)
        {
            _logger = logger;
            _funcionario = funcionario;
        }

        public IActionResult Index()
        {

            if (!string.IsNullOrEmpty(HttpContext.Session.GetString("funcionario")))
            {
                ClaimsPrincipal claimFuncionario = HttpContext.User;
                string correoFuncionario = "";

                if (claimFuncionario.Identity.IsAuthenticated)
                {
                    correoFuncionario = claimFuncionario.Claims.Where(c => c.Type == ClaimTypes.Name).
                        Select(c => c.Value).SingleOrDefault();
                }


                return View();

            }
            else
            {
                _logger.LogInformation($"Intento de logueo sin acceso ");

                return RedirectToAction("SignIn", "Login");
            }

        }

        public IActionResult Privacy()
        {
            return View();
        }

        public async Task<IActionResult> SignOut()
        {

            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            // Se borran las variables de sesión para seguridad
            HttpContext.Session.Clear();
            return RedirectToAction("SignIn", "Login");

        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

