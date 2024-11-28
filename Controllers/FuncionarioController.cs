using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Reflection;
using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;
using TK_ENERGY_GP_PORTAL.Resources;
using TK_ENERGY_GP_PORTAL.Services.Contracts;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    public class FuncionarioController : Controller
    {

        private readonly IRolService _rol;
        private readonly IFuncionarioService _funcionario;


        public FuncionarioController(IRolService rol, IFuncionarioService funcionario)
        {
            _rol = rol;
            _funcionario = funcionario;
        }


        public async Task<IActionResult> Gestionar()
        {

            ViewBag.ActiveMenu = "gestionarFuncionarios"; // Elemento del menú activo
            ViewBag.DropdownActive = "funcionarios"; // Dropdown que debe estar desplegado

            var roles = await consultarRoles(1, 100000000, null);

            return View();
        }

        public IActionResult Consultas()
        {
            ViewBag.ActiveMenu = "consultasFuncionarios"; // Elemento del menú activo
            ViewBag.DropdownActive = "funcionarios"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult Informes()
        {
            ViewBag.ActiveMenu = "informesFuncionarios"; // Elemento del menú activo
            ViewBag.DropdownActive = "funcionarios"; // Dropdown que debe estar desplegado
            return View();
        }


        public async Task<IActionResult> consultarFuncionarios(int page, int pageSize, string? sort)
        {
            try
            {


                var funcionarios = await _funcionario.GetFuncionarios(page, pageSize, sort);

                if (funcionarios != null)
                {

                    return Json(new { data = funcionarios });



                }
                else
                {
                    ViewData["MensajeError"] = "Error al consultar los funcionarios";
                    return null;
                }


            }
            catch
            {
                ViewData["MensajeError"] = "Error inesperado";
                return null;

            }
        }

        [HttpPost]
        public async Task<IActionResult> crearFuncionario(Funcionario funcionario)
        {

            try
            {


                if (ModelState.IsValid)
                {

                    if (funcionario != null)
                    {

                        var funcionarioLogueado = new UserCredentialsDto();
                        var funcionarioLogueadoString = HttpContext.Session.GetString("funcionario");

                        if (funcionarioLogueadoString != null)
                        {
                            funcionarioLogueado = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLogueadoString);


                        }


                        funcionario.IdFuncionario = 0;
                        funcionario.IdEmpresa = funcionarioLogueado.Funcionario.IdEmpresa;
                        funcionario.IdProyecto = funcionarioLogueado.Funcionario.IdProyecto;

                        funcionario.IdPerfil = funcionarioLogueado.Funcionario.IdPerfil;

                        funcionario.IdFuncionarioCrea = funcionarioLogueado.Funcionario.IdFuncionario;
                        funcionario.IdFuncionarioModifica = funcionarioLogueado.Funcionario.IdFuncionario;

                        funcionario.Clave = Utilities.Encript(funcionario.Clave);


                        funcionario.FModificacion = DateTime.Now;
                        funcionario.FCreacion = DateTime.Now;

                        if (funcionario.Correo == null)
                        {
                            funcionario.Correo = "";
                        }

                        if (funcionario.Movil == null)
                        {
                            funcionario.Movil = "";
                        }


                        var funcionarioRegistrado = await _funcionario.Create(funcionario);

                        if (funcionarioRegistrado != null)
                        {
                            return Json(new { success = true, text = "Funcionario creado con éxito" });

                        }
                        else
                        {
                            return Json(new { success = false, text = "No se pudo crear el funcionario" });
                        }

                    }
                    else
                    {
                        return Json(new { success = false, text = "Funcionario a crear nulo" });
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
        public async Task<IActionResult> actualizarFuncionario(Funcionario funcionario)
        {

            try
            {


                if (ModelState.IsValid)
                {

                    if (funcionario != null)
                    {

                        var funcionarioActualizado = await _funcionario.Create(funcionario);

                        if (funcionarioActualizado != null)
                        {
                            return Json(new { success = true, text = "Funcionario actualizado con éxito" });

                        }
                        else
                        {
                            return Json(new { success = false, text = "No se pudo actualizar el funcionario" });
                        }

                    }
                    else
                    {
                        return Json(new { success = false, text = "Funcionario a actualizar nulo" });
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
        public async Task<IActionResult> eliminarFuncionario(Funcionario funcionario)
        {

            try
            {


                if (ModelState.IsValid)
                {

                    if (funcionario != null)
                    {



                        funcionario.Estado = 1;
                        funcionario.IdPerfil = 1;
                        funcionario.rolFuncionario = null;
                        funcionario.Permisos = null;

                        var funcionarioEliminado = await _funcionario.Create(funcionario);

                        if (funcionarioEliminado != null)
                        {
                            return Json(new { success = true, text = "Funcionario eliminado con éxito" });

                        }
                        else
                        {
                            return Json(new { success = false, text = "No se pudo eliminar el funcionario" });
                        }

                    }
                    else
                    {
                        return Json(new { success = false, text = "Funcionario a eliminar nulo" });
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

        [HttpGet]
        public async Task<List<RolPermisos>> consultarRoles(int page, int pageSize, string? sort)
        {
            try
            {
                var roles = await _rol.getRoles(page, pageSize, sort);

                if (roles != null)
                {

                    TempData["roles"] = roles;
                    return roles;


                }
                else
                {
                    ViewData["MensajeError"] = "Error al consultar los roles";
                    return null;
                }


            }
            catch
            {
                ViewData["MensajeError"] = "Error inesperado";
                return null;

            }
        }

    }
}