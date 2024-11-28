namespace TK_ENERGY_GP_PORTAL.Models.DTO
{
    public class ServiciosRespDTO
    {
        public int idServicio { get; set; }
        public string codServicio { get; set; }
        public string descripcion { get; set; }
        public int estado { get; set; }
        public int idFuncionarioCreacion { get; set; }
        public DateTime fCreacion { get; set; }
        public int idFuncionarioModificacion { get; set; }
        public DateTime fModificacion { get; set; }
    }
}
