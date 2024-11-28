using Microsoft.AspNetCore.Mvc;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    public class PermisoController : Controller
    {
        public IActionResult Index()
        {
            ViewBag.ActiveMenu = "permisos";

            return View();
        }
    }
}
