namespace Shared.Models;

public class DocumentImageToText : DocumentResult
{
    public new string Discriminator { get; set; }
    
    public DocumentImageToText()
    {
        Discriminator = GetType().Name;
    }
    
    public DocumentImageToText(DocumentResult documentResult)
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