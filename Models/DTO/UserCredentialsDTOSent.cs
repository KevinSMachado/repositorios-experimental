using System.ComponentModel.DataAnnotations;

namespace TK_ENERGY_GP_PORTAL.Models.DTO
{
    public class UserCredentialsDTOSent
    {

        [Range(1, 99)]
        public int version { get; set; }
        [Required]
        [StringLength(14)]
        public string nit { get; set; }
        [Required]
        [StringLength(2)]
        public string proyecto { get; set; }
        [Required]
        [StringLength(50)]
        public string usuario { get; set; }
        [Required]
        [StringLength(300)]
        public string clave { get; set; }
    }
}
