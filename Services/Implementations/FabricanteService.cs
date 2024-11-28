using Newtonsoft.Json;
using System.Net;
using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;
using TK_ENERGY_GP_PORTAL.Services.ApiClient;
using TK_ENERGY_GP_PORTAL.Services.Contracts;

namespace TK_ENERGY_GP_PORTAL.Services.Implementations
{
    public class FabricanteService : IFabricanteService
    {

        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IApiClient _api;
        private readonly ILogger<FabricanteService> _logger;
        private readonly IFuncionarioService _funcionario;

        public FabricanteService(IHttpContextAccessor httpContextAccessor, IApiClient api, ILogger<FabricanteService> logger, IFuncionarioService funcionario)
        {
            _api = api;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _funcionario = funcionario;

        }

        public async Task<List<FabricantesRespDTO>> getFabricantesModelos()
        {
            try
            {
                var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);

                var response = await _api.GetApiTKResponseAsync("/fabricantes/modelos", funcionario.token);

                if (response.IsSuccessful)
                {

                    List<FabricantesRespDTO> fabricantesModelos = JsonConvert.DeserializeObject<List<FabricantesRespDTO>>(response.Content);


                    //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                    return fabricantesModelos;
                }
                else
                {

                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode == HttpStatusCode.Unauthorized)
                    {
                        var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                        await getFabricantesModelos();
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

        public Task<Fabricante> Create(Fabricante entity)
        {
            throw new NotImplementedException();
        }

        public Task<Fabricante> Delete(Fabricante entity)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Fabricante>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<Fabricante> GetById(int id)
        {
            throw new NotImplementedException();
        }



        public Task<Fabricante> Update(Fabricante entity)
        {
            throw new NotImplementedException();
        }
    }
}
