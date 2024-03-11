namespace Shared.Models;

public class DocumentKeySentences : DocumentResult
{
    // public string[] KeySentences { get; set; }
    public string Discriminator { get; set; } = nameof(DocumentKeySentences);
}