using Microsoft.AspNetCore.Mvc;


// Importamos las librerias para realizar la autentificación por cookies;

using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using TK_ENERGY_GP_PORTAL.Services.Implementations;
using TK_ENERGY_GP_PORTAL.Services.Contracts;
using TK_ENERGY_GP_PORTAL.Resources;




namespace TK_ENERGY_GP_PORTAL.Controllers
{


    public class LoginController : Controller
    {

        private readonly IFuncionarioService _funcionarioService;
        private readonly ILogger<LoginController> _logger;


        public LoginController(IFuncionarioService funcionarioService, ILogger<LoginController> logger)
        {
            _funcionarioService = funcionarioService;
            _logger = logger;
        }

        public IActionResult SignIn()
        {

            if (!string.IsNullOrEmpty(HttpContext.Session.GetString("funcionario")))
            {
                ClaimsPrincipal claimFuncionario = HttpContext.User;


                if (claimFuncionario.Identity.IsAuthenticated)
                {
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    return View();
                }
            }
            else
            {
                return View();
            }



        }


        [HttpPost]
        public async Task<IActionResult> SignIn(string Codigo, string Clave)
        {

            // Encriptamos la clave ingresada
            //Clave = Utilities.Encript(Clave);

            // Buscamos en la base de datos si existen un registro con dicho correo y clave
            var funcionarioLoggedIn = await _funcionarioService.GetFuncionario(Codigo, Clave);

            // En caso de que no existan coincidencias, configuramos un mensaje de error para mostrar en la vista
            if (funcionarioLoggedIn == null)
            {
                ViewData["ErrorMessage"] = "No se encontraron coincidencias";
                return Json(new { success = false, text = "No se encontraron coincidencias" });

            }
            else
            {
                // Creamos una lista de claims
                // Con el cual podremos crear un identificador de la autentificación y autorización que
                // tiene el usuario que ha iniciado sesión

                // Basicamente es la información del usuario del cual podemos confiar
                // En este caso vamos a usar como claim el rol del funcionario que ha iniciado sesión
                // Con el fin de poderle dar ciertos permisos dentro del portal
                List<Claim> claims = new List<Claim>(){
                new Claim(ClaimTypes.Name, funcionarioLoggedIn.Funcionario.Correo)
            };


                // Configuramos la identidad del claims usando un esquema basado en cookies
                ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                AuthenticationProperties properties = new AuthenticationProperties()
                {
                    AllowRefresh = true
                };

                // Indicamos que el usuario se encuentra loggueado en el portal
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    properties);

                // Vamos a la página de inicio del portal

                _logger.LogInformation($"Logueo realizado con éxito");

                return Json(new { success = true, text = "Datos correctos." });

            }






        }
    }
}
