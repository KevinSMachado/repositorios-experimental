using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;

namespace TK_ENERGY_GP_PORTAL.Services.Contracts
{
    public interface IMedidorService : IGlobalService<Medidor>
    {

        Task<List<MedidorRespDTO>> getMedidores(int page, int pageSize, string? sort);

        Task<InformeMedidoresDTO> getInformeMedidores();

        Task<ResultadoOperacion<string>> importMedidores(List<MedidorImportadoDTO> medidores);
    }
}
