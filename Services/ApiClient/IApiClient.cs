using RestSharp;

namespace TK_ENERGY_GP_PORTAL.Services.ApiClient
{
    public interface IApiClient
    {
        Task<RestResponse> PostApiTKResponseAsync(object sendSts, string method, string token);
        Task<RestResponse> PostApiTK_TokenResponseAsync(object sendSts, string method);
        Task<RestResponse> GetApiTKResponseAsync(string url, string token);
    }
}