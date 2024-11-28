namespace TK_ENERGY_GP_PORTAL.Models.DTO
{
    public class InformeMedidoresDTO
    {
        public int? totalMedidores { get; set; }

        public EstadosDTO? medidoresPorEstado { get; set; }

        public EstadosDTO? medidoresPrepago { get; set; }

        public EstadosDTO? medidoresPospago { get; set; }

        public EstadosDTO? medidoresPorAnoBase { get; set; }

        public List<EstadosDTO>? medidoresPorFabricante { get; set; }

    }
}
