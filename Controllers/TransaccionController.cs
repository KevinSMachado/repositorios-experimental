using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;
using TK_ENERGY_GP_PORTAL.Models.Utils;
using TK_ENERGY_GP_PORTAL.Services.Contracts;

namespace TK_ENERGY_GP_PORTAL.Controllers
{

    [Authorize]
    public class TransaccionController : Controller
    {

        private readonly ITransaccionService _transaccion;

        public TransaccionController(ITransaccionService transaccion)
        {
            _transaccion = transaccion;
        }
        public async Task<IActionResult> Consultas()
        {

            ViewBag.ActiveMenu = "consultasTransacciones"; // Elemento del menú activo
            ViewBag.DropdownActive = "transacciones"; // Dropdown que debe estar desplegado
            //var transacciones = await consultarTransacciones();
            return View();
        }

        public IActionResult Informes()
        {
            ViewBag.ActiveMenu = "informesTransacciones"; // Elemento del menú activo
            ViewBag.DropdownActive = "transacciones"; // Dropdown que debe estar desplegado

            return View();
        }


        public async Task<IActionResult> consultarTransacciones(int page, int pageSize, string? sort, string? dateStart, string? dateEnd)
        {
            try
            {
                if (dateStart != null)
                {
                    DateTime fecha = DateTime.ParseExact(dateStart, "yyyy-MM-dd",
                                       System.Globalization.CultureInfo.InvariantCulture);

                    dateStart = fecha.ToString("yyyyMMdd");
                }

                if (dateEnd != null)
                {
                    DateTime fecha = DateTime.ParseExact(dateEnd, "yyyy-MM-dd",
                                       System.Globalization.CultureInfo.InvariantCulture);

                    dateEnd = fecha.ToString("yyyyMMdd");
                }

                var transacciones = await _transaccion.getTransacciones(page, pageSize, sort, dateStart, dateEnd);

                if (transacciones != null)
                {

                    return Json(new { data = transacciones });



                }
                else
                {
                    ViewData["MensajeError"] = "Error al consultar las transacciones";
                    return null;
                }


            }
            catch
            {
                ViewData["MensajeError"] = "Error inesperado";
                return null;

            }
        }


        public async Task<IActionResult> consultarInformeTransacciones([FromQuery] string? dateStart, [FromQuery] string? dateEnd)
        {
            try
            {
                if (dateStart != null)
                {
                    DateTime fecha = DateTime.ParseExact(dateStart, "yyyy-MM-dd",
                                       System.Globalization.CultureInfo.InvariantCulture);

                    dateStart = fecha.ToString("yyyyMMdd");
                }

                if (dateEnd != null)
                {
                    DateTime fecha = DateTime.ParseExact(dateEnd, "yyyy-MM-dd",
                                       System.Globalization.CultureInfo.InvariantCulture);

                    dateEnd = fecha.ToString("yyyyMMdd");
                }

                var transacciones = await _transaccion.getInformeTransacciones(dateStart, dateEnd);

                if (transacciones != null)
                {

                    return Json(new { success = true, data = transacciones });

                }
                else
                {
                    return Json(new { success = false, text = "Error al consultar el informe" });
                }


            }
            catch
            {
                return Json(new { success = false, text = "Error inesperado" });

            }
        }
    }
}
