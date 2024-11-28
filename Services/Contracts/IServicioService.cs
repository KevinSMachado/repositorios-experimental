using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;

namespace TK_ENERGY_GP_PORTAL.Services.Contracts
{
    public interface IServicioService : IGlobalService<Servicio>
    {

        Task<List<ServiciosRespDTO>> getServicios();
    }
}
