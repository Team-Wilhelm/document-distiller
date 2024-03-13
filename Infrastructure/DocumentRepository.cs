using Microsoft.EntityFrameworkCore;
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

    public async Task<List<DocumentResult>> GetRecentDocuments(Guid userId)
    {
        var documents = new List<DocumentResult>();
        var userProject = await dbContext.Project.Where(x => x.OwnerId == userId).ToListAsync();
        // get the most recent 10 documents
        var sentences = 
            await dbContext.DocumentKeySentences.Where(x => userProject.Select(y => y.Id)
                .Contains(x.ProjectId)).OrderByDescending(x => x.CreatedAt).Take(10).ToListAsync();
        var summaries = 
            await dbContext.DocumentSummaries.Where(x => userProject.Select(y => y.Id)
                .Contains(x.ProjectId)).OrderByDescending(x => x.CreatedAt).Take(10).ToListAsync();
        documents.AddRange(summaries);
        documents.AddRange(sentences);
        return documents;
    }
}