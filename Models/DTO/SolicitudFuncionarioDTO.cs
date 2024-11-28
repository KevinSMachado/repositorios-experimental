namespace TK_ENERGY_GP_PORTAL.Models.DTO
{
    public class SolicitudFuncionarioDto
    {
        public int IdSolicitud { get; set; }

        public string CodSolicitud { get; set; }

        public int CantidadGenerada { get; set; }


        public int CantidadAGenerar { get; set; }


        public int CantidadFaltante { get; set; }

        public double TiempoPromedioEnSegundos { get; set; }

        public double TiempoEstimadoRestanteEnSegundos { get; set; }
        public bool Estado { get; set; }
    }
}
