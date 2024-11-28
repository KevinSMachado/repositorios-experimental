using Microsoft.AspNetCore.Mvc;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    public class FabricanteController : Controller
    {
        public IActionResult Consultas()
        {

            ViewBag.ActiveMenu = "consultasFabricantes"; // Elemento del menú activo
            ViewBag.DropdownActive = "fabricantes"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult Gestionar()
        {
            ViewBag.ActiveMenu = "gestionarFabricantes"; // Elemento del menú activo
            ViewBag.DropdownActive = "fabricantes"; // Dropdown que debe estar desplegado
            return View();
        }
        public IActionResult Informes()
        {
            ViewBag.ActiveMenu = "informesFabricantes"; // Elemento del menú activo
            ViewBag.DropdownActive = "fabricantes"; // Dropdown que debe estar desplegado
            return View();
        }
    }
}
