using Microsoft.AspNetCore.Mvc;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    public class RolController : Controller
    {
        public IActionResult Consultas()
        {

            ViewBag.ActiveMenu = "consultasRoles"; // Elemento del menú activo
            ViewBag.DropdownActive = "roles"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult Gestionar()
        {
            ViewBag.ActiveMenu = "gestionarRoles"; // Elemento del menú activo
            ViewBag.DropdownActive = "roles"; // Dropdown que debe estar desplegado
            return View();
        }
        public IActionResult Informes()
        {
            ViewBag.ActiveMenu = "informesRoles"; // Elemento del menú activo
            ViewBag.DropdownActive = "roles"; // Dropdown que debe estar desplegado
            return View();
        }
    }
}
