namespace TK_ENERGY_GP_PORTAL.Models.DTO
{
    public class TokenPersonalizadoDTO
    {

        public int version { get; set; }
        public string idTransaccion { get; set; }
        public string serial { get; set; }
        public string operacionToken { get; set; }
        public string parametro { get; set; }
        public string email { get; set; } = "";
        public string movil { get; set; } = "";
        public string descripcion { get; set; } = "";

    }
}
