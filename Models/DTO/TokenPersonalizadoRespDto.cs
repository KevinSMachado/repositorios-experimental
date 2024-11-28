namespace TK_ENERGY_GP_PORTAL.Models.DTO
{
    public class TokenPersonalizadoRespDto
    {
        public int version { get; set; }
        public string idTransaccion { get; set; }
        public string serial { get; set; }
        public string operacionToken { get; set; }
        public decimal parametro { get; set; }
        public int numTokensSts { get; set; }
        public List<TokensSts> tokensSts { get; set; }
        public string codResp { get; set; }
        public string mensaje { get; set; }
    }
}
