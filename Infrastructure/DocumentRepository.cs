using Shared.Models;

namespace Infrastructure;

public class DocumentRepository(AppDbContext dbContext)
{
    public async Task<DocumentSummary> SaveDocumentSummary(DocumentSummary summary)
    {
        dbContext.DocumentSummaries.Add(summary);
        await dbContext.SaveChangesAsync();
        return summary;
    }

    public async Task<DocumentKeySentences> SaveDocumentKeySentences(DocumentKeySentences keySentences)
    {
        dbContext.DocumentKeySentences.Add(keySentences);
        await dbContext.SaveChangesAsync();
        return keySentences;
    }
}