namespace TK_ENERGY_GP_PORTAL.Models.Utils
{
    public class Transaccion
    {

        public int idTransaccion { get; set; }
        public string empresa { get; set; }
        public string proyecto { get; set; }
        public string medidor { get; set; }
        public string funcionario { get; set; }
        public string tipoToken { get; set; }
        public string valor { get; set; }
        public string descripcion { get; set; }
        public DateTime fechaRespuesta { get; set; }
        public string respuesta { get; set; }
        public string pin { get; set; }
    }
}
