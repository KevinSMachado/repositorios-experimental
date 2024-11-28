using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TK_ENERGY_GP_PORTAL.Models.Utils
{
    public class RolPermisos
    {

        [Required]
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; }

        public string? Descripcion { get; set; }

        public string? Empresa { get; set; }

        [Required]
        public DateTime fCreacion { get; set; }

        [Required]
        public DateTime fModificacion { get; set; }

        [Required]
        public int IdFuncionarioCrea { get; set; }

        [Required]
        public int IdFuncionarioModifica { get; set; }

        [Required]
        public bool Estado { get; set; }

        [Required]
        public List<Permiso>? Permisos { get; set; }


    }
}
