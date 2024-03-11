using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Shared.Dtos;
using Shared.Models;

namespace Infrastructure;

public class AppDbContext : IdentityDbContext<AppUser, AppRole, Guid>
{
    public DbSet<DocumentSummary> DocumentSummaries { get; set; }
    public DbSet<DocumentKeySentences> DocumentKeySentences { get; set; }
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .Entity<DocumentResult>()
            .HasDiscriminator(dr => dr.Discriminator);
        
        modelBuilder.Entity<DocumentSummary>()
            .HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(e => e.OwnerId);
        
        modelBuilder.Entity<DocumentKeySentences>()
            .HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(e => e.OwnerId);
        
        base.OnModelCreating(modelBuilder);
    }

    public async Task SeedData()
    {
        var defaultUser = new RegisterDto
        {
            Email = "user@app.com",
            Password = "P@ssw0rd.+"
        };
    }
}