using System.ComponentModel.DataAnnotations;

namespace TK_ENERGY_GP_PORTAL.Models.Utils
{
    public class Permiso
    {
        [Required]
        public string Nombre { get; set; }

        [Required]
        public Boolean Estado { get; set; }
    }
}
