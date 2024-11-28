
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NuGet.Packaging;
using OfficeOpenXml;
using System.Reflection;
using System.Text.Json.Serialization;
using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;
using TK_ENERGY_GP_PORTAL.Resources;
using TK_ENERGY_GP_PORTAL.Services.Contracts;
using TK_ENERGY_GP_PORTAL.Services.Implementations;




namespace TK_ENERGY_GP_PORTAL.Controllers
{
    [Authorize]
    public class MedidorController : Controller
    {

        private readonly IFabricanteService _fabricante;
        private readonly IMedidorService _medidor;
        private readonly IServicioService _servicio;

        public MedidorController(IFabricanteService fabricante, IMedidorService medidor, IServicioService servicio)
        {

            _fabricante = fabricante;
            _medidor = medidor;
            _servicio = servicio;
        }


        public async Task<IActionResult> Gestionar()
        {

            ViewBag.ActiveMenu = "gestionarMedidores"; // Elemento del menú activo
            ViewBag.DropdownActive = "medidores"; // Dropdown que debe estar desplegado

            var fabricantes = await consultarFabricantes();

            var servicios = await consultarServicios();

            //var medidores = await consultarMedidores();

            return View();

        }

        public IActionResult Consultas()
        {

            ViewBag.ActiveMenu = "consultasMedidores"; // Elemento del menú activo
            ViewBag.DropdownActive = "medidores"; // Dropdown que debe estar desplegado
            return View();
        }

        public async Task<IActionResult> Informes()
        {

            ViewBag.ActiveMenu = "informesMedidores"; // Elemento del menú activo
            ViewBag.DropdownActive = "medidores"; // Dropdown que debe estar desplegado

            var medidores = await consultarTotalMedidores();

            return View();
        }

        public IActionResult Importar()
        {

            return View();
        }

        public async Task<string> CrearArchivoImportacion()
        {
            var fileName = "formato_importacion_masiva_medidores.xlsx";
            var filePath = Path.Combine(Path.GetTempPath(), fileName);

            var fabricantesModelos = await _fabricante.getFabricantesModelos();

            var serviciosBD = await _servicio.getServicios();

            //var fabricantes = new List<string> { };
            var modelos = new List<string> { };

            var servicios = new List<string> { };

            var modos = new List<string> { "Pospago", "Prepago" };

            var estados = new List<string> { "Activo", "En Bodega", "Bloqueado", "Dado de baja por perdida total", "Dado de baja por robo" };

            var anosBase = new List<string> { "1993", "2014", "2035" };

            var sgc = new List<string> { "600268" };

            var tidRo = new List<string> { "Autorizado Automatico", "Autorizado manual (Sectorización)", "No se puede actualizar" };


            foreach (var servicio in serviciosBD)
            {
                servicios.Add(servicio.descripcion);
            }



            foreach (var fabricante in fabricantesModelos)
            {
                //fabricantes.Add(fabricante.nombreFabricante);

                foreach (var modelo in fabricante.modelos)
                {
                    modelos.Add(modelo.codModelo);
                }
            }
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Medidores");
                // Crear encabezados de columna
                worksheet.Cells[1, 1].Value = "serial";
                //worksheet.Cells[1, 2].Value = "fabricante";
                worksheet.Cells[1, 2].Value = "modelo";
                worksheet.Cells[1, 3].Value = "tipoServicio";
                worksheet.Cells[1, 4].Value = "modo";
                worksheet.Cells[1, 5].Value = "estado";
                worksheet.Cells[1, 6].Value = "anoBase";
                worksheet.Cells[1, 7].Value = "sgc";
                worksheet.Cells[1, 8].Value = "tidRo";

                // Crear hoja para almacenar Fabricantes y Modelos
                var listaSheet = package.Workbook.Worksheets.Add("FabricantesYModelos");

                // Colocar Fabricantes en la hoja "FabricantesYModelos"

                //for (int i = 0; i < fabricantes.Count; i++)
                //{
                //    listaSheet.Cells[i + 1, 1].Value = fabricantes[i];
                //}

                // Colocar Modelos en la hoja "FabricantesYModelos"
                for (int i = 0; i < modelos.Count; i++)
                {
                    listaSheet.Cells[i + 1, 2].Value = modelos[i];
                }

                // Crear la validación de datos para Fabricante apuntando a la segunda hoja

                //var fabricanteRange = worksheet.Cells["B2:B1048576"];
                //var fabricanteValidation = worksheet.DataValidations.AddListValidation(fabricanteRange.Address);
                //fabricanteValidation.Formula.ExcelFormula = "'FabricantesYModelos'!$A$1:$A$" + fabricantes.Count;

                // Crear la validación de datos para Modelo apuntando a la segunda hoja
                var modeloRange = worksheet.Cells["B2:B1048576"];
                var modeloValidation = worksheet.DataValidations.AddListValidation(modeloRange.Address);
                modeloValidation.Formula.ExcelFormula = "'FabricantesYModelos'!$B$1:$B$" + modelos.Count;
                modeloValidation.ShowErrorMessage = true;
                modeloValidation.ErrorTitle = "Entrada inválida";
                modeloValidation.Error = "Seleccione un modelo de la lista.";

                // Crear la validación de datos para tipo de servicio
                var servicioRange = worksheet.Cells["C2:C1048576"];
                var servicioValidation = worksheet.DataValidations.AddListValidation(servicioRange.Address);
                servicioValidation.Formula.Values.AddRange(servicios);
                servicioValidation.ShowErrorMessage = true;
                servicioValidation.ErrorTitle = "Entrada inválida";
                servicioValidation.Error = "Seleccione un tipo de servicio de la lista.";

                // Crear la validación de datos para modo
                var modosRange = worksheet.Cells["D2:D1048576"];
                var modoValidation = worksheet.DataValidations.AddListValidation(modosRange.Address);
                modoValidation.Formula.Values.AddRange(modos);
                modoValidation.ShowErrorMessage = true;
                modoValidation.ErrorTitle = "Entrada inválida";
                modoValidation.Error = "Seleccione un modo de la lista.";

                // Crear la validación de datos para estado
                var estadosRange = worksheet.Cells["E2:E1048576"];
                var estadoValidation = worksheet.DataValidations.AddListValidation(estadosRange.Address);
                estadoValidation.Formula.Values.AddRange(estados);
                estadoValidation.ShowErrorMessage = true;
                estadoValidation.ErrorTitle = "Entrada inválida";
                estadoValidation.Error = "Seleccione un estado de la lista.";

                // Crear la validación de datos para año base
                var anosRange = worksheet.Cells["F2:F1048576"];
                var anoValidation = worksheet.DataValidations.AddListValidation(anosRange.Address);
                anoValidation.Formula.Values.AddRange(anosBase);
                anoValidation.ShowErrorMessage = true;
                anoValidation.ErrorTitle = "Entrada inválida";
                anoValidation.Error = "Seleccione un año de la lista.";

                // Crear la validación de datos para SGC
                var sgcRange = worksheet.Cells["G2:G1048576"];
                var sgcValidation = worksheet.DataValidations.AddListValidation(sgcRange.Address);
                sgcValidation.Formula.Values.AddRange(sgc);
                sgcValidation.ShowErrorMessage = true;
                sgcValidation.ErrorTitle = "Entrada inválida";
                sgcValidation.Error = "Seleccione un valor SGC de la lista.";

                // Crear la validación de datos para TID Ro
                var tidRoRange = worksheet.Cells["H2:H1048576"];
                var tidRoValidation = worksheet.DataValidations.AddListValidation(tidRoRange.Address);
                tidRoValidation.Formula.Values.AddRange(tidRo);
                tidRoValidation.ShowErrorMessage = true;
                tidRoValidation.ErrorTitle = "Entrada inválida";
                tidRoValidation.Error = "Seleccione un valor de TID Ro de la lista.";


                var excelData = package.GetAsByteArray();
                await System.IO.File.WriteAllBytesAsync(filePath, excelData);
            }

            return filePath;
        }


        public async Task<IActionResult> DescargarArchivoImportacion(string filePath)
        {
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            var fileName = Path.GetFileName(filePath);
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }

        public async Task<IActionResult> IniciarGeneracionFormatoImportacion()
        {
            var filePath = await CrearArchivoImportacion();
            // Puedes almacenar el filePath en la sesión o base de datos para que el usuario pueda acceder a él más tarde
            return RedirectToAction("DescargarArchivoImportacion", new { filePath = filePath });
        }

        [HttpPost]
        public async Task<IActionResult> cargarArchivoMedidores(string? archivo, bool etapa)
        {
            var fabricantesModelos = await _fabricante.getFabricantesModelos();

            var serviciosBD = await _servicio.getServicios();

            var fabricantes = new List<FabricantesRespDTO> { };
            var modelos = new List<string> { };

            var fabsYCods = new List<string> { };

            var servicios = new List<string> { };

            var modos = new List<string> { "Pospago", "Prepago" };

            var estados = new List<string> { "Activo", "En Bodega", "Bloqueado", "Dado de baja por perdida total", "Dado de baja por robo" };

            var anosBase = new List<string> { "1993", "2014", "2035" };

            var sgc = new List<string> { "600268" };

            var tidRo = new List<string> { "Autorizado Automatico", "Autorizado manual (Sectorización)", "No se puede actualizar" };


            foreach (var servicio in serviciosBD)
            {
                servicios.Add(servicio.descripcion);
            }

            string error = "";
            int fabEstado = 0;
            int modEstado = 0;
            var codMedidor = "";


            foreach (var fabricante in fabricantesModelos)
            {
                fabricantes.Add(fabricante);

                fabsYCods.Add(fabricante.codFabricante + ". " + fabricante.nombreFabricante);
                foreach (var modelo in fabricante.modelos)
                {
                    modelos.Add(modelo.codModelo);
                }
            }
            if (ModelState.IsValid)
            {

                if (!etapa)
                {
                    try
                    {
                        if (archivo != null)
                        {

                            var archivoModelo = JsonConvert.DeserializeObject<List<MedidorImportadoDTO>>(archivo);


                            if (archivoModelo.Count > 1)
                            {
                                int index = 1;
                                foreach (var medidor in archivoModelo)
                                {


                                    if (string.IsNullOrEmpty(medidor.serial))
                                    {
                                        error += $"El serial en la fila {index + 1} es " +
                                            $"nulo o vacio.\n\n";
                                        fabEstado = 1;

                                    }
                                    else
                                    {
                                        if (!long.TryParse(medidor.serial, out long result))
                                        {

                                            error += $"El serial en la fila {index + 1} debe " +
                                                 $"ser unicamente numérico.\n\n";
                                            fabEstado = 1;
                                        }

                                        if (medidor.serial.Length != 11 && medidor.serial.Length != 13)
                                        {
                                            error += $"El serial en la fila {index + 1} debe " +
                                            $"tener 11 o 13 digitos.\n\n";
                                            fabEstado = 1;

                                        }

                                        if (!Utilities.ValidarLuhn(medidor.serial))
                                        {
                                            error += $"El serial en la fila {index + 1} es inválido.\n\n";
                                            fabEstado = 1;
                                        }

                                        codMedidor = medidor.serial.Substring(0, 2);

                                        if (fabricantes.Find(f => f.codFabricante == codMedidor) == null)
                                        {
                                            error += $"El código de fabricante del medidor en la fila {index + 1} no existe,  " +
                                                 $"debe ser una de las opciones, {JsonConvert.SerializeObject(fabsYCods)}.\n " +
                                                 $"recuerda que los " +
                                                 $"nombres son simbolicos, lo importante es el código. " +
                                                 $"El código de cada serial son sus 2 primeros dígitos " +
                                                 $"\n\n";
                                            fabEstado = 1;
                                        }
                                        else
                                        {

                                            medidor.fabricante = codMedidor;
                                        }


                                    }



                                    if (string.IsNullOrEmpty(medidor.modelo))
                                    {
                                        error += $"El modelo en la fila {index + 1} es " +
                                           $"nulo o vacio.\n\n";

                                        modEstado = 1;

                                    }
                                    else
                                    {
                                        if (!modelos.Contains(medidor.modelo))
                                        {
                                            error += $"El modelo en la fila {index + 1} debe " +
                                                $"de ser una de las opciones {JsonConvert.SerializeObject(modelos)}.\n\n";
                                            modEstado = 1;
                                        }

                                        if (fabEstado == 0 && modEstado == 0)
                                        {
                                            var fabricanteFila = fabricantesModelos.Find(f => f.codFabricante == codMedidor);
                                            if (fabricanteFila.modelos.Find(m => m.codModelo == medidor.modelo) == null)
                                            {
                                                error += $"El modelo en la fila {index + 1} debe " +
                                                    $"corresponder al fabricante {medidor.fabricante}.\n\n";
                                            }
                                        }
                                    }





                                    if (string.IsNullOrEmpty(medidor.tipoServicio))
                                    {

                                        error += $"El servicio en la fila {index + 1} es " +
                                            $"nulo o vacio.\n\n";
                                    }
                                    else
                                    {
                                        if (long.TryParse(medidor.tipoServicio, out long result2))
                                        {
                                            error += $"El servicio en la fila {index + 1} debe " +
                                                $"ser unicamente de tipo texto.\n\n";
                                        }

                                        if (!servicios.Contains(medidor.tipoServicio))
                                        {
                                            error += $"El servicio en la fila {index + 1} debe " +
                                                $"de ser una de las opciones {JsonConvert.SerializeObject(servicios)}.\n\n";
                                        }
                                    }





                                    if (string.IsNullOrEmpty(medidor.modo))
                                    {

                                        error += $"El modo en la fila {index + 1} es " +
                                           $"nulo o vacio.\n\n";
                                    }
                                    else
                                    {
                                        if (long.TryParse(medidor.modo, out long result3))
                                        {
                                            error += $"El modo en la fila {index + 1} debe " +
                                                $"ser unicamente de tipo texto.\n\n";
                                        }

                                        if (!modos.Contains(medidor.modo))
                                        {
                                            error += $"El modo en la fila {index + 1} debe " +
                                               $"de ser una de las opciones {JsonConvert.SerializeObject(modos)}.\n\n";
                                        }
                                    }





                                    if (string.IsNullOrEmpty(medidor.estado))
                                    {

                                        error += $"El estado en la fila {index + 1} es " +
                                                                                   $"nulo o vacio.\n\n";
                                    }
                                    else
                                    {
                                        if (long.TryParse(medidor.estado, out long result4))
                                        {
                                            error += $"El estado en la fila {index + 1} debe " +
                                                $"ser unicamente de tipo texto.\n\n";
                                        }

                                        if (!estados.Contains(medidor.estado))
                                        {
                                            error += $"El estado en la fila {index + 1} debe " +
                                                 $"de ser una de las opciones {JsonConvert.SerializeObject(estados)}.\n\n";
                                        }
                                    }







                                    if (string.IsNullOrEmpty(medidor.anoBase))
                                    {

                                        error += $"El año base en la fila {index + 1} es " +
                                           $"nulo o vacio.\n\n";
                                    }
                                    else
                                    {
                                        if (!long.TryParse(medidor.anoBase, out long result5))
                                        {
                                            error += $"El año base en la fila {index + 1} debe " +
                                                $"ser unicamente de tipo numérico.\n\n";
                                        }

                                        if (!anosBase.Contains(medidor.anoBase))
                                        {
                                            error += $"El año base en la fila {index + 1} debe " +
                                                 $"de ser una de las opciones {JsonConvert.SerializeObject(anosBase)}.\n\n";
                                        }
                                    }





                                    if (string.IsNullOrEmpty(medidor.sgc))
                                    {

                                        error += $"El sgc en la fila {index + 1} es " +
                                          $"nulo o vacio.\n\n";
                                    }
                                    else
                                    {
                                        if (!long.TryParse(medidor.sgc, out long result6))
                                        {
                                            error += $"El sgc en la fila {index + 1} debe " +
                                                $"ser unicamente de tipo numérico.\n\n";
                                        }
                                        if (!sgc.Contains(medidor.sgc))
                                        {
                                            error += $"El sgc en la fila {index + 1} debe " +
                                                 $"de ser una de las opciones {JsonConvert.SerializeObject(sgc)}.\n\n";
                                        }
                                    }




                                    if (string.IsNullOrEmpty(medidor.tidRo))
                                    {

                                        error += $"El tid rollover en la fila {index + 1} es " +
                                          $"nulo o vacio.\n\n";
                                    }
                                    else
                                    {
                                        if (long.TryParse(medidor.tidRo, out long result7))
                                        {
                                            error += $"El tid rollover en la fila {index + 1} debe " +
                                                $"ser unicamente de tipo texto.\n\n";
                                        }
                                        if (!tidRo.Contains(medidor.tidRo))
                                        {
                                            error += $"El tid rollover en la fila {index + 1} debe " +
                                                $"de ser una de las opciones {JsonConvert.SerializeObject(tidRo)}.\n\n";
                                        }
                                    }





                                    index++;
                                }
                                var archivoLista = JsonConvert.DeserializeObject<List<MedidorImportadoDTO>>(archivo);

                                if (error == "")
                                {
                                    return Json(new { success = true, text = "Archivo cargado con éxito", data = archivoModelo });
                                }
                                else
                                {

                                    return Json(new
                                    {
                                        success = false,
                                        text = "Se encontraron uno o más errores en el archivo, puedes revisarlos " +
                                        "en el documento que se descargará a continuación.",
                                        data = error
                                    });
                                }


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
                    catch (Exception ex)
                    {
                        return Json(new { success = false, text = "Formato de archivo inválido." });
                    }

                }
                else
                {
                    var medidores = JsonConvert.DeserializeObject<List<MedidorImportadoDTO>>(archivo);
                    ResultadoOperacion<string> resultado = await _medidor.importMedidores(medidores);

                    if (resultado.esExitosa)
                    {
                        return Json(new { success = true, text = resultado.mensajeError });

                    }
                    else
                    {
                        return Json(new { success = false, codigo = resultado.codigoEstado, data = resultado.mensajeError,
                            text = "Se encontraron uno o más errores en el archivo, puedes revisarlos " +
                                        "en el documento que se descargará a continuación.",
                        });

                    }


                }


            }
            else
            {
                return Json(new { success = false, text = "Debes de cargar un archivo válido" });
            }

        }



        [HttpPost]
        public async Task<IActionResult> crearMedidor(Medidor medidor)
        {

            try
            {

                Type tipo = medidor.GetType();

                // Recorrer las propiedades del objeto
                foreach (PropertyInfo property in tipo.GetProperties())
                {
                    // Obtener el valor de la propiedad
                    object valor = property.GetValue(medidor);


                    Type tipoCampo = property.PropertyType;

                    // Verificar si el valor es nulo
                    if (valor == null)
                    {
                        if (tipoCampo == typeof(string))
                        {
                            property.SetValue(medidor, "");

                        }
                        else
                        {
                            property.SetValue(medidor, 0);

                        }
                    }
                }

                if (!Utilities.ValidarLuhn(medidor.serial))
                {
                    return Json(new { success = false, text = "El serial del medidor no es válido" });
                }

                var fabricantesModelos = TempData["fabricantesModelos"] as List<FabricantesRespDTO>;

                medidor.version = 1;
                medidor.idTransaccion = "T-" + Guid.NewGuid().ToString("N").Substring(0, 8);



                if (medidor.fechaFabricacion == "")
                {
                    medidor.fechaFabricacion = DateTime.Now.ToString("yyyyMMdd");
                }
                else
                {

                    DateTime fecha = DateTime.ParseExact(medidor.fechaFabricacion, "yyyy-MM-dd",
                                       System.Globalization.CultureInfo.InvariantCulture);

                    medidor.fechaFabricacion = fecha.ToString("yyyyMMdd");
                }


                if (ModelState.IsValid)
                {

                    if (medidor != null)
                    {
                        var medidorRegistrado = await _medidor.Create(medidor);

                        if (medidorRegistrado != null)
                        {
                            return Json(new { success = true, text = "Medidor creado con éxito" });

                        }
                        else
                        {
                            return Json(new { success = false, text = "No se pudo crear el medidor" });
                        }

                    }
                    else
                    {
                        return Json(new { success = false, text = "Medidor a crear nulo" });
                    }
                }
                else
                {
                    return Json(new { success = false, text = "Medidor inválido, todos los campos obligatorios deben ser válidos" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, text = "Ocurrió un error inesperado" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> consultarMedidores(int page, int pageSize, string? sort)
        {
            try
            {
                var medidores = await _medidor.getMedidores(page, pageSize, sort);

                if (medidores != null)
                {

                    return Json(new { data = medidores });

                }
                else
                {
                    ViewData["MensajeError"] = "Error al consultar los medidores";
                    return null;
                }


            }
            catch
            {
                ViewData["MensajeError"] = "Error inesperado";
                return null;

            }
        }

        [HttpGet]
        public async Task<IActionResult> consultarMedidoresCompletos(int page, int pageSize, string? sort)
        {
            try
            {
                var medidores = await _medidor.getMedidores(page, pageSize, sort);

                if (medidores != null)
                {

                    return Json(new { data = medidores });

                }
                else
                {
                    ViewData["MensajeError"] = "Error al consultar los medidores";
                    return null;
                }


            }
            catch
            {
                ViewData["MensajeError"] = "Error inesperado";
                return null;

            }
        }

        [HttpGet]
        public async Task<InformeMedidoresDTO> consultarTotalMedidores()
        {
            try
            {
                var medidores = await _medidor.getInformeMedidores();

                TempData["medidores"] = medidores;
                return medidores;
                //return Json(new { total = medidores });
            }
            catch
            {
                ViewData["MensajeError"] = "Error al consultar los medidores";
                return null;
            }
        }

        public async Task<List<FabricantesRespDTO>> consultarFabricantes()
        {
            try
            {
                var fabricantes = await _fabricante.getFabricantesModelos();

                if (fabricantes != null)
                {

                    TempData["fabricantesModelos"] = fabricantes;
                    return fabricantes;

                }
                else
                {
                    ViewData["MensajeError"] = "Error al consultar los fabricantes";
                    return null;
                }


            }
            catch
            {
                ViewData["MensajeError"] = "Error inesperado";
                return null;

            }
        }

        public async Task<List<ServiciosRespDTO>> consultarServicios()
        {
            try
            {
                var servicios = await _servicio.getServicios();

                if (servicios != null)
                {

                    TempData["servicios"] = servicios;
                    return servicios;

                }
                else
                {
                    ViewData["MensajeError"] = "Error al consultar los servicios";
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
