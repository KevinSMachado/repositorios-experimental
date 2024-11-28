using Microsoft.AspNetCore.Mvc;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    public class ServicioController : Controller
    {
        public IActionResult Consultas()
        {

            ViewBag.ActiveMenu = "consultasServicios"; // Elemento del menú activo
            ViewBag.DropdownActive = "servicios"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult Gestionar()
        {
            ViewBag.ActiveMenu = "gestionarServicios"; // Elemento del menú activo
            ViewBag.DropdownActive = "servicios"; // Dropdown que debe estar desplegado
            return View();
        }
        public IActionResult Informes()
        {
            ViewBag.ActiveMenu = "informesServicios"; // Elemento del menú activo
            ViewBag.DropdownActive = "servicios"; // Dropdown que debe estar desplegado
            return View();
        }
    }
}
