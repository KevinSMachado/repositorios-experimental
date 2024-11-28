using Newtonsoft.Json;
using System.Net;
using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;
using TK_ENERGY_GP_PORTAL.Services.ApiClient;
using TK_ENERGY_GP_PORTAL.Services.Contracts;

namespace TK_ENERGY_GP_PORTAL.Services.Implementations
{
    public class TransaccionService : ITransaccionService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IApiClient _api;
        private readonly ILogger<TransaccionService> _logger;
        private readonly IFuncionarioService _funcionario;


        public TransaccionService(IHttpContextAccessor httpContextAccessor, IApiClient api, ILogger<TransaccionService> logger, IFuncionarioService funcionario)
        {
            _api = api;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _funcionario = funcionario;

        }


        public async Task<List<Transaccion>> getTransacciones(int page, int pageSize, string? sort, string? dateStart, string? dateEnd)
        {
            try
            {
                var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);

                if (string.IsNullOrEmpty(sort))
                {
                    sort = "0";
                }

                if (string.IsNullOrEmpty(dateStart))
                {
                    dateStart = "0";
                }

                if (string.IsNullOrEmpty(dateEnd))
                {
                    dateEnd = "0";
                }



                var response = await _api.GetApiTKResponseAsync($"/Transacciones/Page?page={page}&pageSize={pageSize}&sort={sort}&dateStart={dateStart}&dateEnd={dateEnd}", funcionario.token);

                if (response.IsSuccessful)
                {
                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode != HttpStatusCode.NoContent)
                    {
                        List<Transaccion> transacciones = JsonConvert.DeserializeObject<List<Transaccion>>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return transacciones;
                    }
                    else
                    {
                        List<Transaccion> transacciones = new List<Transaccion> { };
                        return transacciones;
                    }


                }
                else
                {

                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode == HttpStatusCode.Unauthorized)
                    {
                        var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                        await getTransacciones(page, pageSize, sort, dateStart, dateEnd);
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


        public async Task<InformeTransaccionesDTO> getInformeTransacciones(string? dateStart, string? dateEnd)
        {
            try
            {
                var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);


                if (string.IsNullOrEmpty(dateStart))
                {
                    dateStart = "0";
                }

                if (string.IsNullOrEmpty(dateEnd))
                {
                    dateEnd = "0";
                }



                var response = await _api.GetApiTKResponseAsync($"/transacciones/Informe?dateStart={dateStart}&dateEnd={dateEnd}", funcionario.token);

                if (response.IsSuccessful)
                {
                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode != HttpStatusCode.NoContent)
                    {
                        InformeTransaccionesDTO transacciones = JsonConvert.DeserializeObject<InformeTransaccionesDTO>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return transacciones;
                    }
                    else
                    {
                        InformeTransaccionesDTO transacciones = new InformeTransaccionesDTO { };
                        return transacciones;
                    }


                }
                else
                {

                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode == HttpStatusCode.Unauthorized)
                    {
                        var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                        await getInformeTransacciones(dateStart, dateEnd);
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
    }
}
