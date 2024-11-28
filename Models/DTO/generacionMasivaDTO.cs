namespace TK_ENERGY_GP_PORTAL.Models.DTO
{
    public class generacionMasivaDTO
    {

        public List<MedidorValorDTO>? medidores { get; set; }

        public List<TipoTokenDTO>? tipos { get; set; }

        public string? descripcionSolicitud { get; set; }

        public DB_InfoToken? funcionario { get; set; }
    }
}
