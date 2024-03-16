namespace Shared.Models;

public class DocumentKeySentences : DocumentResult
{
    // public string[] KeySentences { get; set; }
    public string Discriminator { get; set; }
    
    public DocumentKeySentences()
    {
        Discriminator = GetType().Name;
    }
    
    public DocumentKeySentences(DocumentResult documentResult)
    {
        Id = documentResult.Id;
        ProjectId = documentResult.ProjectId;
        Title = documentResult.Title;
        CreatedAt = documentResult.CreatedAt;
        LastModifiedAt = documentResult.LastModifiedAt;
        FileName = documentResult.FileName;
        Result = documentResult.Result;
        Discriminator = GetType().Name;
    }
}