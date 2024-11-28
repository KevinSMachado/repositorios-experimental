using Microsoft.AspNetCore.Mvc;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    public class ProyectoController : Controller
    {
        public IActionResult Consultas()
        {


            ViewBag.ActiveMenu = "consultasProyectos"; // Elemento del menú activo
            ViewBag.DropdownActive = "proyectos"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult Gestionar()
        {
            ViewBag.ActiveMenu = "gestionarProyectos"; // Elemento del menú activo
            ViewBag.DropdownActive = "proyectos"; // Dropdown que debe estar desplegado
            return View();
        }
        public IActionResult Informes()
        {
            ViewBag.ActiveMenu = "informesProyectos"; // Elemento del menú activo
            ViewBag.DropdownActive = "proyectos"; // Dropdown que debe estar desplegado
            return View();
        }
    }
}
