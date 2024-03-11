namespace Shared.Models;

public class DocumentSummary : DocumentResult
{
    // public string? Summary { get; set; }
    public string Discriminator { get; set; } = nameof(DocumentSummary);
    
    public DocumentSummary()
    {
        Discriminator = GetType().Name;
    }

    public DocumentSummary(DocumentResult documentResult)
    {
        Id = documentResult.Id;
        OwnerId = documentResult.OwnerId;
        Title = documentResult.Title;
        CreatedAt = documentResult.CreatedAt;
        LastModifiedAt = documentResult.LastModifiedAt;
        FileName = documentResult.FileName;
        Result = documentResult.Result;
        Discriminator = GetType().Name;
    }
}