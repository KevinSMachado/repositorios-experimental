using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TK_ENERGY_GP_PORTAL.Models.Utils;
using TK_ENERGY_GP_PORTAL.Resources;
using TK_ENERGY_GP_PORTAL.Services.Contracts;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    public class PerfilController : Controller
    {
        private readonly IFuncionarioService _funcionario;
        public PerfilController(IFuncionarioService funcionario)
        {
            _funcionario = funcionario;
        }

        public IActionResult Index()
        {
            ViewBag.ActiveMenu = "perfil";
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> actualizarPerfil(string funcionario)
        {

            try
            {

                if (ModelState.IsValid)
                {

                    if (funcionario != null)
                    {

                        var funcionarioObj = JsonConvert.DeserializeObject<Funcionario>(funcionario);
                        funcionarioObj.Clave = Utilities.Encript(funcionarioObj.Clave);

                        funcionarioObj.Permisos = null;
                        funcionarioObj.rolFuncionario = null;


                        var funcionarioActualizado = await _funcionario.Update(funcionarioObj);

                        if (funcionarioActualizado != null)
                        {
                            return Json(new
                            {
                                success = true,
                                text = "Funcionario actualizado con éxito. Debes Iniciar Sesión " +
                                "nuevamente."
                            });

                        }
                        else
                        {
                            return Json(new { success = false, text = "No se pudo actualizar el funcionario." });
                        }

                    }
                    else
                    {
                        return Json(new { success = false, text = "Funcionario nulo" });
                    }
                }
                else
                {
                    return Json(new { success = false, text = "Funcionario inválido, todos los campos obligatorios deben ser válidos" });
                }


            }
            catch (Exception ex)
            {
                return Json(new { success = false, text = "Ocurrió un error inesperado" });
            }

        }

        [HttpPost]
        public async Task<IActionResult> eliminarPerfil(string funcionario)
        {

            try
            {

                if (ModelState.IsValid)
                {

                    if (funcionario != null)
                    {

                        var funcionarioObj = JsonConvert.DeserializeObject<Funcionario>(funcionario);
                        funcionarioObj.Clave = Utilities.Encript(funcionarioObj.Clave);

                        funcionarioObj.Permisos = null;
                        funcionarioObj.rolFuncionario = null;


                        var funcionarioActualizado = await _funcionario.Update(funcionarioObj);

                        if (funcionarioActualizado != null)
                        {
                            return Json(new
                            {
                                success = true,
                                text = "Funcionario eliminado con éxito"

                            });

                        }
                        else
                        {
                            return Json(new { success = false, text = "No se pudo eliminar el funcionario." });
                        }

                    }
                    else
                    {
                        return Json(new { success = false, text = "Funcionario nulo" });
                    }
                }
                else
                {
                    return Json(new { success = false, text = "Funcionario inválido, todos los campos obligatorios deben ser válidos" });
                }


            }
            catch (Exception ex)
            {
                return Json(new { success = false, text = "Ocurrió un error inesperado" });
            }

        }
    }
}
