using TK_ENERGY_GP_PORTAL.Models.Utils;

namespace TK_ENERGY_GP_PORTAL.Models.DTO
{
    public class UserCredentialsDto
    {

        public int Version { get; set; }
        public string codResp { get; set; }
        public string token { get; set; }
        public string fechaUltimoIngreso { get; set; }
        public string urlUltimoIngreso { get; set; }
        public string fechaUltimoRechazo { get; set; }
        public string urlUltimoRechazo { get; set; }
        public Funcionario Funcionario { get; set; }

    }
}
