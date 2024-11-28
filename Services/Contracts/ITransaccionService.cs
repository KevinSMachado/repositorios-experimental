using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;

namespace TK_ENERGY_GP_PORTAL.Services.Contracts
{
    public interface ITransaccionService
    {

        Task<List<Transaccion>> getTransacciones(int page, int pageSize, string? sort, string? dateStart, string? dateEnd);

        Task<InformeTransaccionesDTO> getInformeTransacciones(string? dateStart, string? dateEnd);
    }
}
