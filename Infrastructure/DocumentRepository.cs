using Shared.Models;

namespace Infrastructure;

public class DocumentRepository(AppDbContext dbContext)
{
    public async Task<DocumentSummary> SaveDocumentSummary(Guid ownerId, string summary)
    {
        var document = new DocumentSummary
        {
            OwnerId = ownerId,
            Title = "Summary",
            CreatedAt = DateTime.Now.ToUniversalTime(),
            LastModifiedAt = DateTime.Now.ToUniversalTime(),
            FileName = "summary.txt",
            Result = summary
        };
        
        dbContext.DocumentSummaries.Add(document);
        await dbContext.SaveChangesAsync();
        return document;
    }

    public async Task<DocumentKeySentences> SaveDocumentKeySentences(Guid ownerId, string keySentences)
    {
        var document = new DocumentKeySentences
        {
            OwnerId = ownerId,
            Title = "Key Sentences",
            CreatedAt = DateTime.Now.ToUniversalTime(),
            LastModifiedAt = DateTime.Now.ToUniversalTime(),
            FileName = "key-sentences.txt",
            Result = keySentences
        };
        
        dbContext.DocumentKeySentences.Add(document);
        await dbContext.SaveChangesAsync();
        return document;
    }
}