using Newtonsoft.Json;
using System.Net;
using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;
using TK_ENERGY_GP_PORTAL.Services.ApiClient;
using TK_ENERGY_GP_PORTAL.Services.Contracts;

namespace TK_ENERGY_GP_PORTAL.Services.Implementations
{
    public class ServicioService : IServicioService
    {


        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IApiClient _api;
        private readonly ILogger<ServicioService> _logger;
        private readonly IFuncionarioService _funcionario;

        public ServicioService(IHttpContextAccessor httpContextAccessor, IApiClient api, ILogger<ServicioService> logger, IFuncionarioService funcionario)
        {
            _api = api;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _funcionario = funcionario;

        }

        public async Task<List<ServiciosRespDTO>> getServicios()
        {
            try
            {
                var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);

                var response = await _api.GetApiTKResponseAsync("/servicios", funcionario.token);

                if (response.IsSuccessful)
                {

                    List<ServiciosRespDTO> servicios = JsonConvert.DeserializeObject<List<ServiciosRespDTO>>(response.Content);


                    //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                    return servicios;
                }
                else
                {

                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode == HttpStatusCode.Unauthorized)
                    {
                        var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                        await getServicios();
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
        public Task<Servicio> Create(Servicio entity)
        {
            throw new NotImplementedException();
        }

        public Task<Servicio> Delete(Servicio entity)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Servicio>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<Servicio> GetById(int id)
        {
            throw new NotImplementedException();
        }



        public Task<Servicio> Update(Servicio entity)
        {
            throw new NotImplementedException();
        }
    }
}
