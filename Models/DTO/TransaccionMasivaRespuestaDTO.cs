using System.ComponentModel.DataAnnotations.Schema;

namespace TK_ENERGY_GP_PORTAL.Models.DTO
{
    public class TransaccionMasivaRespuestaDTO
    {

        public int IdTransaccionMasivaRespuesta { get; set; }
        public int IdTransaccionMasivaSolicitud { get; set; }
        public int IdMedidor { get; set; }

        [NotMapped]
        public string Serial { get; set; }

        [NotMapped]
        public string TokenPersonalizado { get; set; }
        public int IdFuncionario { get; set; }

        [NotMapped]
        public int IdSolicitud { get; set; }

        public string codigoFuncionario { get; set; }
        public string Estado { get; set; }
        public string CodError { get; set; }
        public string MenError { get; set; }
        public string Class { get; set; }
        public string SubClass { get; set; }
        public string Valor { get; set; }
        public string Token1 { get; set; }
        public string Token2 { get; set; }
        public string Token3 { get; set; }
        public string Token4 { get; set; }
        public DateTime FechaRespuesta { get; set; }

    }
}
