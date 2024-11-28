using Newtonsoft.Json;
using System.Net;
using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;
using TK_ENERGY_GP_PORTAL.Services.ApiClient;
using TK_ENERGY_GP_PORTAL.Services.Contracts;

namespace TK_ENERGY_GP_PORTAL.Services.Implementations
{
    public class RolService : IRolService
    {

        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IApiClient _api;
        private readonly ILogger<RolService> _logger;
        private readonly IFuncionarioService _funcionario;

        public RolService(IHttpContextAccessor httpContextAccessor, IApiClient api, ILogger<RolService> logger, IFuncionarioService funcionario)
        {
            _api = api;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _funcionario = funcionario;

        }

        public async Task<List<RolPermisos>> getRoles(int? page, int? pageSize, string? sort)
        {
            try
            {
                var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);

                if (string.IsNullOrEmpty(sort))
                {
                    sort = "0";
                }

                var response = await _api.GetApiTKResponseAsync($"/roles/Page?page={page}&pageSize={pageSize}&sort={sort}", funcionario.token);

                if (response.IsSuccessful)
                {
                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode != HttpStatusCode.NoContent)
                    {
                        List<RolPermisos> roles = JsonConvert.DeserializeObject<List<RolPermisos>>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return roles;
                    }
                    else
                    {
                        List<RolPermisos> roles = new List<RolPermisos> { };
                        return roles;

                    }

                }
                else
                {

                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode == HttpStatusCode.Unauthorized)
                    {
                        var nuevosDatosFuncionario = await _funcionario.GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                        await getRoles(page, pageSize, sort);
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
