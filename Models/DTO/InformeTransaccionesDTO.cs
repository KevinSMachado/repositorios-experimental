namespace TK_ENERGY_GP_PORTAL.Models.DTO
{
    public class InformeTransaccionesDTO
    {

        public int? totalTransacciones { get; set; }

        public int? totalCantExitosas { get; set; }
        public int? totalCantFallidas { get; set; }

        public List<tipoTransaccionDTO>? tiposTransacciones { get; set; }

    }
}
