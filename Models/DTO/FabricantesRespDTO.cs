namespace TK_ENERGY_GP_PORTAL.Models.DTO
{
    public class FabricantesRespDTO
    {

        public int? idFabricante { get; set; }
        public string? codFabricante { get; set; }

        public string? nombreFabricante { get; set; }

        public List<ModelosRespDTO>? modelos { get; set; }
    }
}
