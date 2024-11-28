using Microsoft.AspNetCore.Mvc;
using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;

namespace TK_ENERGY_GP_PORTAL.Services.Contracts
{
    public interface ITokenService
    {

        Task<TokenPersonalizadoRespDto> generarTokensAdminTec(string serial, string descripcion, string tipoToken);

        Task<TokenPersonalizadoRespDto> generarTokensRecargasTec(string serial, string descripcion, string tipoToken, string kWh);

        Task<ResultadoOperacion<string>> solicitudTokensMasivos(generacionMasivaDTO medidores);

        Task<List<SolicitudFuncionarioDto>> getSolicitudesPorFuncionario();

        Task<List<TransaccionMasivaRespuestaDTO>> getResultadoTransaccionesMasivasPorFuncionario(int page, int pageSize);

        Task<List<TransaccionMasivaRespuestaDTO>> getAllResultadoTransaccionesMasivasPorFuncionario();

        Task<List<TransaccionMasivaRespuestaDTO>> getResultadoTransaccionesMasivasPorFuncionarioSolicitud(int page, int pageSize, int solicitud);



    }
}
