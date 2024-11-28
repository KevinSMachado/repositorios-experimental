using Microsoft.AspNetCore.Mvc;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    public class InstalacionController : Controller
    {
        public IActionResult Consultas()
        {

            ViewBag.ActiveMenu = "consultasInstalaciones"; // Elemento del menú activo
            ViewBag.DropdownActive = "instalaciones"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult Gestionar()
        {
            ViewBag.ActiveMenu = "gestionarInstalaciones"; // Elemento del menú activo
            ViewBag.DropdownActive = "instalaciones"; // Dropdown que debe estar desplegado
            return View();
        }
        public IActionResult Informes()
        {
            ViewBag.ActiveMenu = "informesInstalaciones"; // Elemento del menú activo
            ViewBag.DropdownActive = "instalaciones"; // Dropdown que debe estar desplegado
            return View();
        }
    }
}
