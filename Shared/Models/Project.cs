using System.Reflection.Metadata;

namespace Shared.Models;

public class Project
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public Guid OwnerId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastModifiedAt { get; set; }
    
    public List<DocumentResult> Documents { get; set; }
}