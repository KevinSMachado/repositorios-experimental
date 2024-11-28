using System.Net;

namespace TK_ENERGY_GP_PORTAL.Models.Utils
{
    public class ResultadoOperacion<T>
    {
        public bool esExitosa { get; set; }
        public T datos { get; set; }
        public string mensajeError { get; set; }
        public HttpStatusCode codigoEstado { get; set; }

    }
}
