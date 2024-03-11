namespace Shared.Models;

public class DocumentResult
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public string? Title { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? LastModifiedAt { get; set; }
    public string? FileName { get; set; }
    public string? Result { get; set; }
    public string Discriminator { get; set; }
    
    public DocumentResult()
    {
        Discriminator = GetType().Name;
    }
}