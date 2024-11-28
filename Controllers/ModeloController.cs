using Microsoft.AspNetCore.Mvc;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    public class ModeloController : Controller
    {
        public IActionResult Consultas()
        {

            ViewBag.ActiveMenu = "consultasModelos"; // Elemento del menú activo
            ViewBag.DropdownActive = "modelos"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult Gestionar()
        {
            ViewBag.ActiveMenu = "gestionarModelos"; // Elemento del menú activo
            ViewBag.DropdownActive = "modelos"; // Dropdown que debe estar desplegado
            return View();
        }
        public IActionResult Informes()
        {
            ViewBag.ActiveMenu = "informesModelos"; // Elemento del menú activo
            ViewBag.DropdownActive = "modelos"; // Dropdown que debe estar desplegado
            return View();
        }
    }
}
