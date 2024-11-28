using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    [Authorize]
    public class ManualController : Controller
    {
        public IActionResult Index()
        {
            ViewBag.ActiveMenu = "manual";
            return View();
        }
    }
}
