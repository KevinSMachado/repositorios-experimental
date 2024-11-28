using Azure;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net;
using TK_ENERGY_GP_PORTAL.Context;
using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;
using TK_ENERGY_GP_PORTAL.Services.ApiClient;
using TK_ENERGY_GP_PORTAL.Services.Contracts;

namespace TK_ENERGY_GP_PORTAL.Services.Implementations
{
    public class FuncionarioService : IFuncionarioService
    {

        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IApiClient _api;
        private readonly ILogger<FuncionarioService> _logger;


        public FuncionarioService(AppDbContext context, IHttpContextAccessor httpContextAccessor, IApiClient api, ILogger<FuncionarioService> logger)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _api = api;
            _logger = logger;

        }

        public async Task<List<UserCredentialsDto>> GetFuncionarios(int page, int pageSize, string? sort)
        {
            try
            {
                var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);

                if (string.IsNullOrEmpty(sort))
                {
                    sort = "0";
                }

                var response = await _api.GetApiTKResponseAsync($"/funcionarios/Page?page={page}&pageSize={pageSize}&sort={sort}", funcionario.token);

                if (response.IsSuccessful)
                {
                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode != HttpStatusCode.NoContent)
                    {
                        List<UserCredentialsDto> funcionarios = JsonConvert.DeserializeObject<List<UserCredentialsDto>>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return funcionarios;
                    }
                    else
                    {
                        List<UserCredentialsDto> funcionarios = new List<UserCredentialsDto> { };
                        return funcionarios;

                    }

                }
                else
                {

                    HttpStatusCode statusCode = response.StatusCode;

                    if (statusCode == HttpStatusCode.Unauthorized)
                    {
                        var nuevosDatosFuncionario = await GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                        await GetFuncionarios(page, pageSize, sort);
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

        public async Task<Funcionario> Create(Funcionario funcionarioCreate)
        {
            try
            {

                if (funcionarioCreate != null)
                {
                    var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                    var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);



                    var response = await _api.PostApiTKResponseAsync(funcionarioCreate, "/funcionarios", funcionario.token);

                    if (response.IsSuccessful)
                    {

                        Funcionario funcionarioRegistrado = JsonConvert.DeserializeObject<Funcionario>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return funcionarioRegistrado;
                    }
                    else
                    {

                        HttpStatusCode statusCode = response.StatusCode;

                        if (statusCode == HttpStatusCode.Unauthorized)
                        {
                            var nuevosDatosFuncionario = await GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                            await Create(funcionarioCreate);
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



        public async Task<IEnumerable<Funcionario>> GetAll()
        {
            try
            {
                return await _context.Funcionarios.ToListAsync();

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<Funcionario> GetById(int id)
        {
            try
            {
                if (id != null)
                {
                    var funcionario = await _context.Funcionarios.FindAsync(id);
                    return funcionario;

                }
                else
                {
                    throw new NotImplementedException();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<Funcionario> Delete(Funcionario funcionarioDelete)
        {
            try
            {

                if (funcionarioDelete != null)
                {
                    var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                    var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);



                    var response = await _api.PostApiTKResponseAsync(funcionarioDelete, "/funcionarios", funcionario.token);

                    if (response.IsSuccessful)
                    {

                        Funcionario funcionarioEliminado = JsonConvert.DeserializeObject<Funcionario>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return funcionarioEliminado;
                    }
                    else
                    {

                        HttpStatusCode statusCode = response.StatusCode;

                        if (statusCode == HttpStatusCode.Unauthorized)
                        {
                            var nuevosDatosFuncionario = await GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                            await Update(funcionarioDelete);
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

        public async Task<Funcionario> Update(Funcionario funcionarioUpdate)
        {
            try
            {

                if (funcionarioUpdate != null)
                {
                    var funcionarioLoggedIn = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
                    var funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioLoggedIn);



                    var response = await _api.PostApiTKResponseAsync(funcionarioUpdate, "/funcionarios", funcionario.token);

                    if (response.IsSuccessful)
                    {

                        Funcionario funcionarioActualizado = JsonConvert.DeserializeObject<Funcionario>(response.Content);


                        //_logger.LogInformation($"Tokens generados con éxito --> {response.Content}");

                        return funcionarioActualizado;
                    }
                    else
                    {

                        HttpStatusCode statusCode = response.StatusCode;

                        if (statusCode == HttpStatusCode.Unauthorized)
                        {
                            var nuevosDatosFuncionario = await GetFuncionario(funcionario.Funcionario.Codigo, funcionario.Funcionario.Clave);
                            await Update(funcionarioUpdate);
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

        public async Task<UserCredentialsDto> GetFuncionario(string Codigo, string Clave)
        {
            try
            {
                _logger.LogInformation($"Intento de logueo con Codigo {Codigo} y con la clave {Clave}");

                if (Codigo != null && Clave != null)
                {

                    UserCredentialsDTOSent user = new UserCredentialsDTOSent();
                    user.version = 1;
                    user.nit = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["nit_empresa"];
                    user.proyecto = "90";
                    user.usuario = Codigo;
                    user.clave = Clave;

                    //_logger.LogInformation($"Se construyó el usuario para la petición de logueo ---> {JsonConvert.SerializeObject(user)}");


                    var response = await _api.PostApiTK_TokenResponseAsync(user, "/user-credentials");

                    _logger.LogInformation($"Respuesta del api ---> {response.Content}");


                    if (response.IsSuccessful)
                    {

                        UserCredentialsDto funcionario = JsonConvert.DeserializeObject<UserCredentialsDto>(response.Content);

                        if (funcionario != null)
                        {
                            funcionario.Funcionario.Clave = Clave;
                            _httpContextAccessor.HttpContext.Session.SetString("funcionario", JsonConvert.SerializeObject(funcionario));

                        }
                        return funcionario;
                    }
                    else
                    {

                        _logger.LogError($"Respuesta del api ---> {response.IsSuccessful}");

                        return null;

                    }

                }
                else
                {
                    _logger.LogError($"Error, alguno de los campos obligatorios está nulo, Codigo --> {Codigo}, Clave --> {Clave}");



                    return null;
                }
            }
            catch (Exception ex)
            {

                _logger.LogCritical($"Error: {ex.Message}");

                return null;
            }
        }


        public async Task<UserCredentialsDto> GetFuncionarioLoggedIn()
        {
            var funcionarioValue = _httpContextAccessor.HttpContext.Session.GetString("funcionario");
            return JsonConvert.DeserializeObject<UserCredentialsDto>(funcionarioValue);

        }
    }
}
