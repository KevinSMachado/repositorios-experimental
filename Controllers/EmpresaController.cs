using Microsoft.AspNetCore.Mvc;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    public class EmpresaController : Controller
    {
        public IActionResult Consultas()
        {

            ViewBag.ActiveMenu = "consultasEmpresas"; // Elemento del menú activo
            ViewBag.DropdownActive = "empresas"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult Gestionar()
        {
            ViewBag.ActiveMenu = "gestionarEmpresas"; // Elemento del menú activo
            ViewBag.DropdownActive = "empresas"; // Dropdown que debe estar desplegado
            return View();
        }
        public IActionResult Informes()
        {
            ViewBag.ActiveMenu = "informesEmpresas"; // Elemento del menú activo
            ViewBag.DropdownActive = "empresas"; // Dropdown que debe estar desplegado
            return View();
        }
    }
}
