using Newtonsoft.Json;
using System.Drawing.Printing;
using System.Net;
using TK_ENERGY_GP_PORTAL.Context;
using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;
using TK_ENERGY_GP_PORTAL.Services.ApiClient;
using TK_ENERGY_GP_PORTAL.Services.Contracts;

namespace TK_ENERGY_GP_PORTAL.Services.Implementations
{
    public class MedidorService : IMedidorService
    {


        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IApiClient _api;
        private readonly ILogger<MedidorService> _logger;
        private readonly IFuncionarioService _funcionario;

        public MedidorService(IHttpContextAccessor httpContextAccessor, IApiClient api, ILogger<MedidorService> logger, IFuncionarioService funcionario)
        {
            _api = api;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _funcionario = funcionario;

        }

        public async Task<List<MedidorRespDTO>> getMedidores(int page, int pageSize, string? sort)
        {
            try
            {
                var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);

                if (string.IsNullOrEmpty(sort))
                {
                    sort = "0";
                }

                var response = await _api.GetApiTKResponseAsync($"/medidores/Page?page={page}&pageSize={pageSize}&sort={sort}", funcionario.token);

                if (response.IsSuccessful)
                {
                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode != HttpStatusCode.NoContent)
                    {
                        List<MedidorRespDTO> medidores = JsonConvert.DeserializeObject<List<MedidorRespDTO>>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return medidores;
                    }
                    else
                    {
                        List<MedidorRespDTO> medidores = new List<MedidorRespDTO> { };
                        return medidores;

                    }

                }
                else
                {

                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode == HttpStatusCode.Unauthorized)
                    {
                        var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                        await getMedidores(page, pageSize, sort);
                    }

                    _logger.LogError($"Respuesta del api --> {response.Content}");

                    return null;


                }

            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<InformeMedidoresDTO> getInformeMedidores()
        {
            try
            {
                var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);


                var response = await _api.GetApiTKResponseAsync($"/medidores/Informe", funcionario.token);

                if (response.IsSuccessful)
                {
                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode != HttpStatusCode.NoContent)
                    {
                        InformeMedidoresDTO medidores = JsonConvert.DeserializeObject<InformeMedidoresDTO>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return medidores;
                    }
                    else
                    {
                        InformeMedidoresDTO medidores = new InformeMedidoresDTO();
                        return medidores;

                    }

                }
                else
                {

                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode == HttpStatusCode.Unauthorized)
                    {
                        var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                        await getInformeMedidores();
                    }

                    _logger.LogError($"Respuesta del api --> {response.Content}");

                    return null;


                }

            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<Medidor> Create(Medidor medidor)
        {
            try
            {

                if (medidor != null)
                {
                    var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                    var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);



                    var response = await _api.PostApiTKResponseAsync(medidor, "/medidores", funcionario.token);

                    if (response.IsSuccessful)
                    {

                        Medidor medidorRegistrado = JsonConvert.DeserializeObject<Medidor>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return medidorRegistrado;
                    }
                    else
                    {

                        HttpStatusCode statusCode = response.StatusCode;

                        if (statusCode == HttpStatusCode.Unauthorized)
                        {
                            var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                            await Create(medidor);
                        }

                        _logger.LogError($"Respuesta del api --> {response.Content}");

                        return null;


                    }
                }
                else
                {
                    return null;
                }


            }
            catch (Exception ex)
            {
                return null;
            }


        }

        public async Task<ResultadoOperacion<string>> importMedidores(List<MedidorImportadoDTO> medidores)
        {
            _logger.LogInformation($"Importación masiva de medidores para --> {medidores}");
            ResultadoOperacion<string> resultado = new ResultadoOperacion<string>();
            try
            {

                if (medidores != null)
                {

                    var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                    var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);



                    var response = await _api.PostApiTKResponseAsync(medidores, "medidores/Importar", funcionario.token);

                    if (response.IsSuccessful)
                    {
                        respuestaApiDTO respuesta = JsonConvert.DeserializeObject<respuestaApiDTO>(response.Content);

                        resultado.esExitosa = true;
                        resultado.codigoEstado = response.StatusCode;
                        resultado.datos = response.Content;
                        resultado.mensajeError = respuesta.mensaje;
                        return resultado;
                    }
                    else
                    {

                        HttpStatusCode statusCode = response.StatusCode;

                        if (statusCode == HttpStatusCode.Unauthorized)
                        {
                            var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                            await importMedidores(medidores);
                        }

                        _logger.LogError($"Respuesta del api --> {response.Content}");

                        respuestaApiDTO respuesta = JsonConvert.DeserializeObject<respuestaApiDTO>(response.Content);
                        resultado.esExitosa = false;
                        resultado.codigoEstado = response.StatusCode;
                        resultado.mensajeError = respuesta.mensaje;
                        resultado.datos = response.Content;
                        return resultado;



                    }
                }
                else
                {
                    resultado.esExitosa = false;
                    resultado.mensajeError = "Parámetro nulo";
                    return resultado;

                }


            }
            catch (Exception ex)
            {
                resultado.esExitosa = false;
                resultado.mensajeError = "Error " + ex;
                return resultado;

            }
        }

        public Task<Medidor> Delete(Medidor entity)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Medidor>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<Medidor> GetById(int id)
        {
            throw new NotImplementedException();
        }


        public Task<Medidor> Update(Medidor entity)
        {
            throw new NotImplementedException();
        }
    }
}
