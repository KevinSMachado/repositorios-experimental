using Microsoft.AspNetCore.Mvc;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    public class CajaController : Controller
    {
        public IActionResult Gestionar()
        {

            ViewBag.ActiveMenu = "gestionarCajas"; // Elemento del menú activo
            ViewBag.DropdownActive = "cajas"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult Consultas()
        {
            ViewBag.ActiveMenu = "consultasCajas"; // Elemento del menú activo
            ViewBag.DropdownActive = "cajas"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult Informes()
        {

            ViewBag.ActiveMenu = "informesCajas"; // Elemento del menú activo
            ViewBag.DropdownActive = "cajas"; // Dropdown que debe estar desplegado
            return View();
        }
    }
}
