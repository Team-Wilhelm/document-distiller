using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Shared.Models;

namespace Infrastructure;

public class AppDbContext : IdentityDbContext<AppUser, AppRole, Guid>
{
    public DbSet<DocumentSummary> DocumentSummaries { get; set; }
    public DbSet<DocumentKeySentences> DocumentKeySentences { get; set; }
    public DbSet<DocumentImageToText> DocumentImageToText { get; set; }
    public DbSet<DocumentTranslation> DocumentTranslations { get; set; }
    public DbSet<DocumentResult> DocumentResult { get; set; }
    public DbSet<Project> Project { get; set; }
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .Entity<DocumentResult>()
            .HasDiscriminator(dr => dr.Discriminator);
        
        modelBuilder.Entity<Project>()
            .HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(e => e.OwnerId);

        modelBuilder.Entity<Project>()
            .HasMany<DocumentResult>()
            .WithOne()
            .HasForeignKey(e => e.ProjectId);
        
        base.OnModelCreating(modelBuilder);
    }
    
    public async Task SeedData(Guid userId)
    {
        if (Project.Any())
        {
            return;
        }
        
        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = "Default Project",
            Description = "A default project for testing purposes",
            CreatedAt = DateTime.Now.ToUniversalTime(),
            LastModifiedAt = DateTime.Now.ToUniversalTime(),
            OwnerId = userId
        };
        
        Project.Add(project);
        await SaveChangesAsync();
    }
}