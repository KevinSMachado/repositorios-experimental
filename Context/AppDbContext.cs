using Microsoft.EntityFrameworkCore;
using System;
using TK_ENERGY_GP_PORTAL.Models.Utils;

namespace TK_ENERGY_GP_PORTAL.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {


        }

        public DbSet<Funcionario> Funcionarios { get; set; }
        public DbSet<Rol> Roles { get; set; }

        public DbSet<Permiso> Permisos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Permiso>().HasNoKey();
        }



    }
}
