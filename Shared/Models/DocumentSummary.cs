namespace Shared.Models;

public class DocumentSummary : DocumentResult
{
    // public string? Summary { get; set; }
    public string Discriminator { get; set; } = nameof(DocumentSummary);
}