using Microsoft.AspNetCore.Mvc;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    public class SolicitudController : Controller
    {
        public IActionResult Gestionar()
        {

            ViewBag.ActiveMenu = "gestionarSolicitudes"; // Elemento del menú activo
            ViewBag.DropdownActive = "solicitudes"; // Dropdown que debe estar desplegado
            return View();
        }
        public IActionResult Informes()
        {
            ViewBag.ActiveMenu = "informesSolicitudes"; // Elemento del menú activo
            ViewBag.DropdownActive = "solicitudes"; // Dropdown que debe estar desplegado
            return View();
        }

    }
}
