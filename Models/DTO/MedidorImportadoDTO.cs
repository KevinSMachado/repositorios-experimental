using System.ComponentModel.DataAnnotations;

namespace TK_ENERGY_GP_PORTAL.Models.DTO
{
    public class MedidorImportadoDTO
    {
        public string? serial { get; set; }

        public string? estado { get; set; }

        public string? modo { get; set; }

        public string? tipoServicio { get; set; }

      
        public string? fabricante { get; set; }

      
        public string? modelo { get; set; }

    
        public string? anoBase { get; set; }

        public string? tidRo { get; set; }

      
        public string? sgc { get; set; }

        public MedidorImportadoDTO()
        {

        }
    }
}
