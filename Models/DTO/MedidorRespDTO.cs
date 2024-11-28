namespace TK_ENERGY_GP_PORTAL.Models.DTO
{
    public class MedidorRespDTO
    {

        public int? version { get; set; }
        public string? idTransaccion { get; set; }
        public string serial { get; set; }
        public int estado { get; set; }
        public int modo { get; set; }
        public int tipoServicio { get; set; }
        public string? fabricante { get; set; } = "";
        public string? modelo { get; set; } = "";
        public string? fechaFabricacion { get; set; } = "";
        public int ami { get; set; }
        public string? nis { get; set; } = "";
        public string? nic { get; set; } = "";
        public int? reportaEmail { get; set; } = 0;
        public string? email { get; set; } = "";
        public int? reportaMovil { get; set; } = 0;
        public string? movil { get; set; } = "";
        public int ti { get; set; }
        public string? anoBase { get; set; } = "";
        public int tidRo { get; set; }
        public string? sgc { get; set; }
        public int krn { get; set; }

        public string codResp { get; set; }

        public string mensaje { get; set; }
    }
}
