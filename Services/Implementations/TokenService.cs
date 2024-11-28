using Azure;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;
using TK_ENERGY_GP_PORTAL.Services.ApiClient;
using TK_ENERGY_GP_PORTAL.Services.Contracts;

namespace TK_ENERGY_GP_PORTAL.Services.Implementations
{
    public class TokenService : ITokenService
    {

        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IApiClient _api;
        private readonly ILogger<TokenService> _logger;
        private readonly IFuncionarioService _funcionario;

        public TokenService(IHttpContextAccessor httpContextAccessor, IApiClient api, ILogger<TokenService> logger, IFuncionarioService funcionario)
        {
            _api = api;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _funcionario = funcionario;

        }

        public async Task<TokenPersonalizadoRespDto> generarTokensAdminTec(string serial, string? descripcion, string tipoToken)
        {
            _logger.LogInformation($"Empezando la generación del token tipo --> {tipoToken}");

            try
            {

                if (!string.IsNullOrEmpty(serial) && !string.IsNullOrEmpty(tipoToken))
                {

                    TokenPersonalizadoDTO peticionToken = new TokenPersonalizadoDTO();

                    var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                    var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);


                    //Aquí debemos de válidar el tiempo de expiración del token de autorización

                    peticionToken.serial = serial;
                    peticionToken.idTransaccion = "T-" + Guid.NewGuid().ToString("N").Substring(0, 8);
                    peticionToken.parametro = "0";

                    if (!string.IsNullOrEmpty(descripcion))
                    {
                        peticionToken.descripcion = descripcion;
                    }

                    peticionToken.operacionToken = tipoToken;
                    peticionToken.version = 1;

                    //_logger.LogInformation($"Modelo a enviar para la petición al api --> {peticionToken}");


                    var response = await _api.PostApiTKResponseAsync(peticionToken, "/tokens-personalizados", funcionario.token);



                    if (response.IsSuccessful)
                    {

                        TokenPersonalizadoRespDto tokensGenerados = JsonConvert.DeserializeObject<TokenPersonalizadoRespDto>(response.Content);


                        _logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return tokensGenerados;
                    }
                    else
                    {

                        HttpStatusCode statusCode = response.StatusCode;

                        if (statusCode == HttpStatusCode.Unauthorized)
                        {
                            var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                            await generarTokensAdminTec(serial, descripcion, tipoToken);
                        }

                        _logger.LogError($"Respuesta del api --> {response.Content}");

                        return null;


                    }


                }
                else
                {
                    _logger.LogError($"Error, alguno de los campos obligatorios está nulo, Serial --> {serial}, TipoToken --> {tipoToken}");

                    return null;
                }

            }
            catch (Exception ex)
            {
                _logger.LogCritical($"Error: {ex.Message}");
                return null;

            }

        }

        public async Task<TokenPersonalizadoRespDto> generarTokensRecargasTec(string serial, string? descripcion, string tipoToken, string kWh)
        {

            _logger.LogInformation($"Empezando la generación del token tipo --> {tipoToken}");

            try
            {

                if (!string.IsNullOrEmpty(serial) && !string.IsNullOrEmpty(tipoToken))
                {

                    TokenPersonalizadoDTO peticionToken = new TokenPersonalizadoDTO();
                    var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                    var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);

                    //Aquí debemos de válidar el tiempo de expiración del token de autorización

                    peticionToken.serial = serial;
                    peticionToken.idTransaccion = "T-" + Guid.NewGuid().ToString("N").Substring(0, 8);
                    peticionToken.parametro = kWh;
                    if (!string.IsNullOrEmpty(descripcion))
                    {
                        peticionToken.descripcion = descripcion;
                    }
                    peticionToken.operacionToken = tipoToken;
                    peticionToken.version = 1;

                    //_logger.LogInformation($"Modelo a enviar para la petición al api --> {peticionToken}");


                    var response = await _api.PostApiTKResponseAsync(peticionToken, "/tokens-personalizados", funcionario.token);


                    if (response.IsSuccessful)
                    {

                        TokenPersonalizadoRespDto tokensGenerados = JsonConvert.DeserializeObject<TokenPersonalizadoRespDto>(response.Content);
                        _logger.LogInformation($"Tokens generados con éxito --> {response.Content}");


                        return tokensGenerados;
                    }
                    else
                    {

                        HttpStatusCode statusCode = response.StatusCode;

                        if (statusCode == HttpStatusCode.Unauthorized)
                        {
                            var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                            await generarTokensRecargasTec(serial, descripcion, tipoToken, kWh);
                        }
                        _logger.LogError($"Respuesta del api --> {response.Content}");


                        return null;

                    }



                }
                else
                {
                    _logger.LogError($"Error, alguno de los campos obligatorios está nulo, Serial --> {serial}, TipoToken --> {tipoToken}, Kwh --> {kWh}");

                    return null;
                }

            }
            catch (Exception ex)
            {
                _logger.LogCritical($"Error: {ex.Message}");
                return null;
            }
        }


        public async Task<ResultadoOperacion<string>> solicitudTokensMasivos(generacionMasivaDTO medidores)
        {

            _logger.LogInformation($"Solicitud de generación de tokens masivos para --> {medidores}");
            ResultadoOperacion<string> resultado = new ResultadoOperacion<string>();
            try
            {

                if (medidores != null)
                {

                    var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                    var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);



                    var response = await _api.PostApiTKResponseAsync(medidores, "/generacionMasivaTokens", funcionario.token);

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
                            await solicitudTokensMasivos(medidores);
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

        public async Task<List<TransaccionMasivaRespuestaDTO>> getResultadoTransaccionesMasivasPorFuncionarioSolicitud(int page, int pageSize, int solicitud)
        {
            try
            {
                var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);



                var response = await _api.GetApiTKResponseAsync($"/generacionMasivaTokens/getResultadoTransaccionesMasivasPorFuncionarioSolicitud?page={page}&pageSize={pageSize}&solicitud={solicitud}&codigo={funcionario.Funcionario.Codigo}", funcionario.token);

                if (response.IsSuccessful)
                {
                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode != HttpStatusCode.NoContent)
                    {
                        List<TransaccionMasivaRespuestaDTO> transaccionesRespuestas = JsonConvert.DeserializeObject<List<TransaccionMasivaRespuestaDTO>>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return transaccionesRespuestas;
                    }
                    else
                    {
                        List<TransaccionMasivaRespuestaDTO> transaccionesRespuestas = new List<TransaccionMasivaRespuestaDTO> { };
                        return transaccionesRespuestas;
                    }


                }
                else
                {

                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode == HttpStatusCode.Unauthorized)
                    {
                        var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                        await getResultadoTransaccionesMasivasPorFuncionarioSolicitud(page, pageSize, solicitud);
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

        public async Task<List<TransaccionMasivaRespuestaDTO>> getResultadoTransaccionesMasivasPorFuncionario(int page, int pageSize)
        {
            try
            {
                var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);



                var response = await _api.GetApiTKResponseAsync($"/generacionMasivaTokens/getResultadoTransaccionesMasivasPorFuncionario?page={page}&pageSize={pageSize}&codigo={funcionario.Funcionario.Codigo}", funcionario.token);

                if (response.IsSuccessful)
                {
                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode != HttpStatusCode.NoContent)
                    {
                        List<TransaccionMasivaRespuestaDTO> transaccionesRespuestas = JsonConvert.DeserializeObject<List<TransaccionMasivaRespuestaDTO>>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return transaccionesRespuestas;
                    }
                    else
                    {
                        List<TransaccionMasivaRespuestaDTO> transaccionesRespuestas = new List<TransaccionMasivaRespuestaDTO> { };
                        return transaccionesRespuestas;
                    }


                }
                else
                {

                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode == HttpStatusCode.Unauthorized)
                    {
                        var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                        await getResultadoTransaccionesMasivasPorFuncionario(page, pageSize);
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

        public async Task<List<TransaccionMasivaRespuestaDTO>> getAllResultadoTransaccionesMasivasPorFuncionario()
        {
            try
            {
                var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);



                var response = await _api.GetApiTKResponseAsync($"/generacionMasivaTokens/getAllResultadoTransaccionesMasivasPorFuncionario?codigo={funcionario.Funcionario.Codigo}", funcionario.token);

                if (response.IsSuccessful)
                {
                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode != HttpStatusCode.NoContent)
                    {
                        List<TransaccionMasivaRespuestaDTO> transaccionesRespuestas = JsonConvert.DeserializeObject<List<TransaccionMasivaRespuestaDTO>>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return transaccionesRespuestas;
                    }
                    else
                    {
                        List<TransaccionMasivaRespuestaDTO> transaccionesRespuestas = new List<TransaccionMasivaRespuestaDTO> { };
                        return transaccionesRespuestas;
                    }


                }
                else
                {

                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode == HttpStatusCode.Unauthorized)
                    {
                        var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                        await getAllResultadoTransaccionesMasivasPorFuncionario();
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

        public async Task<List<SolicitudFuncionarioDto>> getSolicitudesPorFuncionario()
        {
            try
            {
                var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);



                var response = await _api.GetApiTKResponseAsync($"/generacionMasivaTokens/getSolicitudesPorFuncionario?codigo={funcionario.Funcionario.Codigo}", funcionario.token);

                if (response.IsSuccessful)
                {
                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode != HttpStatusCode.NoContent)
                    {
                        List<SolicitudFuncionarioDto> solicitudes = JsonConvert.DeserializeObject<List<SolicitudFuncionarioDto>>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return solicitudes;
                    }
                    else
                    {
                        List<SolicitudFuncionarioDto> solicitudes = new List<SolicitudFuncionarioDto> { };
                        return solicitudes;
                    }


                }
                else
                {

                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode == HttpStatusCode.Unauthorized)
                    {
                        var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                        await getSolicitudesPorFuncionario();
                    }

                    _logger.LogError($"Respuesta del api --> {response.Content}");

                    List<SolicitudFuncionarioDto> solicitudes = new List<SolicitudFuncionarioDto> { };
                    return solicitudes;


                }

            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
