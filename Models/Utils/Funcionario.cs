using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TK_ENERGY_GP_PORTAL.Models.Utils
{
    public class Funcionario
    {
        [Required]
        [Key]
        public int IdFuncionario { get; set; }

        [Required]
        public int IdEmpresa { get; set; }

        [Required]
        public int IdProyecto { get; set; }

        [Required]
        public string Codigo { get; set; }

       
        public string? Clave { get; set; }

        [Required]
        public string Nombre { get; set; }

        public string? Movil { get; set; } = "";

        public string? Correo { get; set; } = "";

        public int? IdPerfil { get; set; } = 1;

        public int? Estado { get; set; }

        public string? IpAutorizada { get; set; } = "";

        public string? TerminalAutorizada { get; set; } = "";

        [Required]
        public int IdFuncionarioCrea { get; set; }

        [Required]
        public DateTime FCreacion { get; set; }

        [Required]
        public int IdFuncionarioModifica { get; set; }

        [Required]
        public DateTime FModificacion { get; set; }

        public int? Rol { get; set; }

        [NotMapped]
        public List<Permiso>? Permisos { get; set; }
        [NotMapped]
        public Rol? rolFuncionario { get; set; }

    }
}
