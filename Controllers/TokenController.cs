using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Reflection;
using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;
using TK_ENERGY_GP_PORTAL.Services.Contracts;
using TK_ENERGY_GP_PORTAL.Services.Implementations;

namespace TK_ENERGY_GP_PORTAL.Controllers
{
    [Authorize]
    public class TokenController : Controller
    {
        private readonly ILogger<TokenController> _logger;

        private readonly ITokenService _tokenService;

        public TokenController(ITokenService tokenService, ILogger<TokenController> logger)
        {
            _tokenService = tokenService;
            _logger = logger;
        }

        public IActionResult Administrativos()
        {
            ViewBag.ActiveMenu = "administrativos"; // Elemento del menú activo
            ViewBag.DropdownActive = "tokens"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult Tecnicos()
        {
            ViewBag.ActiveMenu = "tecnicos"; // Elemento del menú activo
            ViewBag.DropdownActive = "tokens"; // Dropdown que debe estar desplegado

            return View();
        }

        public IActionResult RecargasTecnicas(string? source)
        {


            if (source == "atencionReclamos")
            {
                ViewBag.ActiveMenu = "recargaTecnicaAR"; // Elemento del menú activo
                ViewBag.DropdownActive2 = "atencionReclamos"; // Dropdown que debe estar desplegado
            }
            else
            {
                ViewBag.ActiveMenu = "recargaTecnica"; // Elemento del menú activo

            }

            ViewBag.DropdownActive = "tokens"; // Dropdown que debe estar desplegado

            return View();
        }

        public IActionResult CambioLlaves(string? source)
        {

            if (source == "atencionCliente")
            {
                ViewBag.ActiveMenu = "cambioLlavesAC"; // Elemento del menú activo
                ViewBag.DropdownActive2 = "atencionCliente"; // Dropdown que debe estar desplegado
            }
            else
            {
                ViewBag.ActiveMenu = "cambioLlaves"; // Elemento del menú activo

            }

            ViewBag.DropdownActive = "tokens"; // Dropdown que debe estar desplegado


            return View();
        }


        public IActionResult Consultas()
        {
            ViewBag.ActiveMenu = "consultasTokens"; // Elemento del menú activo
            ViewBag.DropdownActive = "tokens"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult Informes()
        {
            ViewBag.ActiveMenu = "informesTokens"; // Elemento del menú activo
            ViewBag.DropdownActive = "tokens"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult GeneracionMasiva()
        {
            ViewBag.ActiveMenu = "generacionMasiva"; // Elemento del menú activo
            ViewBag.DropdownActive = "tokens"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult TokensGenerados()
        {
            ViewBag.ActiveMenu = "verTokensMasivos"; // Elemento del menú activo
            ViewBag.DropdownActive = "tokens"; // Dropdown que debe estar desplegado
            return View();
        }

        public IActionResult BorradoCredito()
        {
            ViewBag.ActiveMenu = "borradoCredito"; // Elemento del menú activo
            ViewBag.DropdownActive = "tokens"; // Dropdown que debe estar desplegado
            ViewBag.DropdownActive2 = "atencionTecnica"; // Dropdown que debe estar desplegado

            return View();
        }

        public IActionResult Desbloqueo(string? source)
        {
            // Elemento del menú activo
            ViewBag.DropdownActive = "tokens"; // Dropdown que debe estar desplegado

            if (source == "atencionCliente")
            {
                ViewBag.ActiveMenu = "desbloqueoAC";
                ViewBag.DropdownActive2 = "atencionCliente";
            }
            else if (source == "atencionTecnica")
            {
                ViewBag.ActiveMenu = "desbloqueoAT";

                ViewBag.DropdownActive2 = "atencionTecnica";
            }


            return View();
        }

        public IActionResult PreAPost()
        {
            ViewBag.ActiveMenu = "preAPost"; // Elemento del menú activo
            ViewBag.DropdownActive = "tokens"; // Dropdown que debe estar desplegado
            ViewBag.DropdownActive2 = "tecnicosAvanzados"; // Dropdown que debe estar desplegado

            return View();
        }

        public IActionResult PostAPre()
        {
            ViewBag.ActiveMenu = "postAPre"; // Elemento del menú activo
            ViewBag.DropdownActive = "tokens"; // Dropdown que debe estar desplegado
            ViewBag.DropdownActive2 = "tecnicosAvanzados"; // Dropdown que debe estar desplegado

            return View();
        }


        public IActionResult descargarFormatoGeneracionTokens()
        {


            //string filePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), relativePath);
            string fileName = "formato_generacion_masiva_tokens.xlsx";
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\files", fileName);





            byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);

            return File(fileBytes, "application/force-download", fileName);

        }

        public async Task<IActionResult> consultarResultadoTransaccionesMasivasPorSolicitud(int page, int pageSize, int solicitud)
        {
            try
            {

                var transaccionesRespuesta = await _tokenService.getResultadoTransaccionesMasivasPorFuncionarioSolicitud(page, pageSize, solicitud);

                if (transaccionesRespuesta != null)
                {

                    return Json(new { data = transaccionesRespuesta });

                }
                else
                {
                    ViewData["MensajeError"] = "Error al consultar las transacciones masivas";
                    return null;
                }


            }
            catch
            {
                ViewData["MensajeError"] = "Error inesperado";
                return null;

            }
        }

        public async Task<IActionResult> consultarResultadoTransaccionesMasivas(int page, int pageSize)
        {
            try
            {

                var transaccionesRespuesta = await _tokenService.getResultadoTransaccionesMasivasPorFuncionario(page, pageSize);

                if (transaccionesRespuesta != null)
                {

                    return Json(new { data = transaccionesRespuesta });

                }
                else
                {
                    ViewData["MensajeError"] = "Error al consultar las transacciones masivas";
                    return null;
                }


            }
            catch
            {
                ViewData["MensajeError"] = "Error inesperado";
                return null;

            }
        }

        public async Task<IActionResult> consultarTodosResultadoTransaccionesMasivas()
        {
            try
            {

                var transaccionesRespuesta = await _tokenService.getAllResultadoTransaccionesMasivasPorFuncionario();

                if (transaccionesRespuesta != null)
                {

                    return Json(new { data = transaccionesRespuesta });

                }
                else
                {
                    ViewData["MensajeError"] = "Error al consultar las transacciones masivas";
                    return null;
                }


            }
            catch
            {
                ViewData["MensajeError"] = "Error inesperado";
                return null;

            }
        }


        public async Task<IActionResult> consultarSolicitudes()
        {
            try
            {

                var solicitudes = await _tokenService.getSolicitudesPorFuncionario();

                if (solicitudes != null)
                {

                    return Json(new { data = solicitudes });

                }
                else
                {
                    ViewData["MensajeError"] = "Error al consultar las solicitudes";
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
        public async Task<IActionResult> cargarArchivo(string? archivo, string? tiposToken, string? descripcionSolicitud)
        {

            if (ModelState.IsValid)
            {

                if (tiposToken == null && descripcionSolicitud == null)
                {
                    try
                    {
                        if (archivo != null)
                        {

                            var archivoModelo = JsonConvert.DeserializeObject<List<MedidorValorDTO>>(archivo);

                            if (archivoModelo.Count > 1)
                            {

                                if (string.IsNullOrEmpty(archivoModelo[archivoModelo.Count - 1].medidor) && string.IsNullOrEmpty(archivoModelo[archivoModelo.Count - 1].valor))
                                {
                                    archivoModelo.RemoveAt(archivoModelo.Count - 1);
                                }

                                int index = 1;
                                foreach (var medidor in archivoModelo)
                                {


                                    if (!string.IsNullOrEmpty(medidor.medidor))
                                    {
                                        if (!long.TryParse(medidor.medidor, out long result))
                                        {

                                            return Json(new
                                            {
                                                success = false,
                                                text = $"El medidor en la fila {index + 1} debe " +
                                                $"ser unicamente numérico."
                                            });
                                        }
                                        else
                                        {

                                            if (medidor.medidor.Length != 11 && medidor.medidor.Length != 13)
                                            {
                                                return Json(new
                                                {
                                                    success = false,
                                                    text = $"El medidor en la fila {index + 1} debe " +
                                                $"tener 11 o 13 digitos."
                                                });
                                            }
                                        }

                                    }
                                    else
                                    {
                                        return Json(new
                                        {
                                            success = false,
                                            text = $"El medidor en la fila {index + 1} es " +
                                            $"nulo o vacio."
                                        });
                                    }


                                    if (!string.IsNullOrEmpty(medidor.valor))
                                    {
                                        if (!int.TryParse(medidor.valor, out int result))
                                        {
                                            return Json(new
                                            {
                                                success = false,
                                                text = $"El valor en la fila {index + 1} debe " +
                                                $"ser unicamente numérico."
                                            });
                                        }
                                        else
                                        {
                                            var valorEntero = int.Parse(medidor.valor);

                                            if (valorEntero < 0)
                                            {
                                                return Json(new
                                                {
                                                    success = false,
                                                    text = $"El valor en la fila {index + 1} no debe ser " +
                                                    $"un número negativo."
                                                });
                                            }
                                        }

                                    }
                                    else
                                    {
                                        return Json(new
                                        {
                                            success = false,
                                            text = $"El valor en la fila {index + 1} es " +
                                            $"nulo o vacio."
                                        });
                                    }


                                    index++;
                                }
                                var archivoLista = JsonConvert.DeserializeObject<List<MedidorValorDTO>>(archivo);
                                return Json(new { success = true, text = "Archivo cargado con éxito", data = archivoLista });
                            }
                            else
                            {

                                return Json(new { success = false, text = "Debes de cargar un archivo con información." });

                            }



                        }
                        else
                        {
                            return Json(new { success = false, text = "Debes de cargar un archivo." });
                        }
                    }
                    catch
                    {
                        return Json(new { success = false, text = "Formato de archivo inválido." });
                    }

                }
                else
                {
                    var MedidoresTokens = new generacionMasivaDTO();
                    var funcObj = new DB_InfoToken();

                    var medidores = JsonConvert.DeserializeObject<List<MedidorValorDTO>>(archivo);
                    var tokens = JsonConvert.DeserializeObject<List<TipoTokenDTO>>(tiposToken);

                    MedidoresTokens.medidores = medidores;
                    MedidoresTokens.tipos = tokens;
                    MedidoresTokens.descripcionSolicitud = descripcionSolicitud;

                    var funcionarioLogueado = new UserCredentialsDto();
                    var funcionarioLogueadoString = HttpContext.Session.GetString("funcionario");

                    if (funcionarioLogueadoString != null)
                    {
                        funcionarioLogueado = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLogueadoString);


                    }
                    funcObj.Funcionario = funcionarioLogueado.Funcionario.Codigo;
                    MedidoresTokens.funcionario = funcObj;


                    ResultadoOperacion<string> resultado = await _tokenService.solicitudTokensMasivos(MedidoresTokens);

                    if (resultado.esExitosa)
                    {
                        return Json(new { success = true, text = "Solicitud realizada con éxito. Puedes ver los tokens en el submenu TokensGenerados.", data = MedidoresTokens });

                    }
                    else
                    {
                        return Json(new { success = false, data = resultado.mensajeError,
                            text = "Se encontraron uno o más errores en el archivo, puedes revisarlos " +
                                        "en el documento que se descargará a continuación.",
                            codigo = resultado.codigoEstado });

                    }


                }


            }
            else
            {
                return Json(new { success = false, text = "Debes de cargar un archivo válido" });
            }

        }

        [HttpPost]
        public async Task<IActionResult> genTokenAdminTec(string serial, string? descripcion, string tipoToken, string vista)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var tokensGenerados = await _tokenService.generarTokensAdminTec(serial, descripcion, tipoToken);

                    if (tokensGenerados != null)
                    {

                        TempData["tokensGenerados"] = JsonConvert.SerializeObject(tokensGenerados.tokensSts);

                    }
                    else
                    {
                        _logger.LogError($"Error: Hubo un error al generar el token");

                        TempData["MensajeError"] = "No se pudo generar el token";
                    }


                    if (vista == "Administrativos")
                    {
                        return RedirectToAction("Administrativos");
                    }
                    else if (vista == "Tecnicos")
                    {
                        return RedirectToAction("Tecnicos");
                    }
                    else if (vista == "RecargasTecnicas")
                    {
                        return RedirectToAction("RecargasTecnicas");
                    }
                    else if (vista == "CambioLlaves")
                    {
                        return RedirectToAction("CambioLlaves");

                    }
                    else if (vista == "Desbloqueo")
                    {
                        return RedirectToAction("Desbloqueo");
                    }
                    else if (vista == "BorradoCredito")
                    {
                        return RedirectToAction("BorradoCredito");

                    }
                    else if (vista == "PreAPost")
                    {
                        return RedirectToAction("PreAPost");

                    }
                    else if (vista == "PostAPre")
                    {
                        return RedirectToAction("PostAPre");

                    }
                    else
                    {
                        TempData["MensajeError"] = "Vista desconocida";

                        return null;

                    }


                }
                else
                {

                    _logger.LogError($"Error: alguno de los campos es inválido");

                    TempData["MensajeError"] = "Se presento un error inesperado.";

                    return null;

                }
            }
            catch (Exception ex)
            {

                _logger.LogCritical($"Error: {ex.Message}");

                TempData["MensajeError"] = "Se presento un error inesperado.";

                return null;

            }

        }

        [HttpPost]

        public async Task<IActionResult> genTokenRecargasTec(string serial, string? descripcion, string tipoToken, string kWh, string vista)
        {

            try
            {
                if (ModelState.IsValid)
                {
                    var tokensGenerados = await _tokenService.generarTokensRecargasTec(serial, descripcion, tipoToken, kWh);

                    if (tokensGenerados != null)
                    {
                        TempData["tokensGenerados"] = JsonConvert.SerializeObject(tokensGenerados.tokensSts);

                    }
                    else
                    {
                        _logger.LogError($"Error: Hubo un error al generar el token");

                        TempData["MensajeError"] = "No se pudo generar el token";

                    }

                    if (vista == "Administrativos")
                    {
                        return RedirectToAction("Administrativos");
                    }
                    else if (vista == "Tecnicos")
                    {
                        return RedirectToAction("Tecnicos");
                    }
                    else if (vista == "RecargasTecnicas")
                    {
                        return RedirectToAction("RecargasTecnicas");
                    }
                    else
                    {
                        TempData["MensajeError"] = "Vista desconocida";
                        return null;

                    }

                }
                else
                {
                    _logger.LogError($"Error: alguno de los campos es inválido");

                    TempData["MensajeError"] = "Se presento un error inesperado.";
                    return null;


                }
            }
            catch (Exception ex)
            {

                _logger.LogCritical($"Error: {ex.Message}");

                TempData["MensajeError"] = "Se presento un error inesperado.";
                return null;
            }
        }
    }
}
