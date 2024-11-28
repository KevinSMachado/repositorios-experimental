using TK_ENERGY_GP_PORTAL.Models.DTO;
using TK_ENERGY_GP_PORTAL.Models.Utils;

namespace TK_ENERGY_GP_PORTAL.Services.Contracts
{
    public interface IFuncionarioService : IGlobalService<Funcionario>
    {

        Task<UserCredentialsDto> GetFuncionario(string Codigo, string Clave);


        Task<UserCredentialsDto> GetFuncionarioLoggedIn();

        Task<List<UserCredentialsDto>> GetFuncionarios(int page, int pageSize, string? sort);

        //Task<Funcionario> Update(Funcionario funcionario);

    }
}
