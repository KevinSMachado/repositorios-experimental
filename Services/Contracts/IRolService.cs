using TK_ENERGY_GP_PORTAL.Models.Utils;

namespace TK_ENERGY_GP_PORTAL.Services.Contracts
{
    public interface IRolService
    {

        Task<List<RolPermisos>> getRoles(int? page, int? pageSize, string? sort);

    }
}
