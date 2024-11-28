using Azure;
using Newtonsoft.Json;
using NuGet.Common;
using RestSharp;
using TK_ENERGY_GP_PORTAL.Services.ApiClient;
using TK_ENERGY_GP_PORTAL.Services.Implementations;

public class apiClient : IApiClient
{

    // Cremos una variable de tipo static la cual tendrá la url del ApiTKGP
    public static readonly string _url_apiTKGP = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["Url_ApiTokGP"];

    private readonly ILogger<apiClient> _logger;
    public apiClient(ILogger<apiClient> logger)
    {
        _logger = logger;
    }

    public async Task<RestResponse> PostApiTKResponseAsync(object sendSts, string method, string token)
    {
        try
        {
            RestClientOptions options = new RestClientOptions(_url_apiTKGP);
            var client = new RestClient(options);
            var request = new RestRequest(method, Method.Post);


            //Log.Information("Solicitud Api cliente (TokenAuth) --> " + JsonConvert.SerializeObject(sendSts));

            // Se añade el header con el token de acceso
            request.AddHeader("Authorization", "Bearer " + token);

            // Se añade el body con el modelo a pasar
            string jsonBody = JsonConvert.SerializeObject(sendSts);

            _logger.LogInformation($"Solicitud al api con el token --> {token} y el body --> {jsonBody}");


            request.AddBody(jsonBody, ContentType.Json);

            // Se ejecuta la petición en el api
            var response = await client.ExecutePostAsync(request);

            _logger.LogInformation($"Respuesta del api --> {JsonConvert.SerializeObject(response)} ");


            return response!;
        }
        catch (Exception ex)
        {

            _logger.LogError($"Error en la solicitud del api --> {ex}");
            throw new Exception("Error en la solicitud HTTP", ex);

        }
    }

    // Método generico para realizar peticiones de tipo post hacia un API TKGP
    // Este método recibe el modelo a agregar y la url para acceder al método de API 
    public async Task<RestResponse> PostApiTK_TokenResponseAsync(object sendSts, string method)
    {
        try
        {
            RestClientOptions options = new RestClientOptions(_url_apiTKGP);
            var client = new RestClient(options);
            var request = new RestRequest(method, Method.Post);

            //Log.Information("Solicitud Api cliente (TokenAuth) --> " + JsonConvert.SerializeObject(sendSts));

            // Se añade el body con el modelo a pasar
            string jsonBody = JsonConvert.SerializeObject(sendSts);
            request.AddBody(jsonBody, ContentType.Json);

            _logger.LogInformation($"Solicitud al api para la generación del token con el body --> {jsonBody}");



            // Se ejecuta la petición en el api
            var response = await client.ExecutePostAsync(request);

            return response!;
        }
        catch (Exception ex)
        {

            _logger.LogCritical($"Error en la solicitud del api --> {ex.Message}");

            throw new Exception("Error en la solicitud HTTP", ex);

        }
    }

    // Método generico para realizar peticiones de tipo get hacia un API
    // Este método recibe la url para acceder al método de API
    public async Task<RestResponse> GetApiTKResponseAsync(string url, string token)
    {
        try
        {
            RestClientOptions options = new RestClientOptions(_url_apiTKGP);
            var client = new RestClient(options);
            var request = new RestRequest(url, Method.Get);

            request.AddHeader("Authorization", "Bearer " + token);

            var response = await client.ExecuteGetAsync(request);

            return response!;
        }
        catch (Exception ex)
        {
            throw new Exception("Error en la solicitud HTTP", ex);

            throw;
        }
    }




}
