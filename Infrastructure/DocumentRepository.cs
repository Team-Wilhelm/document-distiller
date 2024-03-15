using Microsoft.EntityFrameworkCore;
using Shared.Exceptions;
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

    public async Task DeleteDocument(Guid documentId)
    {
        var document = await dbContext.DocumentResult.FirstOrDefaultAsync(doc => doc.Id == documentId);
        if (document is null)
        {
            throw new NotFoundException($"Document with ID {documentId} does not exit");
        }
        dbContext.DocumentResult.Remove(document);
        await dbContext.SaveChangesAsync();
    }

    public async Task<DocumentResult> UpdateDocument(DocumentResult documentResult)
    {
        if (await dbContext.DocumentResult.FirstOrDefaultAsync(doc => doc.Id == documentResult.Id) is null)
        {
            throw new NotFoundException($"Document with ID {documentResult.Id} does not exit");
        }
        
        dbContext.DocumentResult.Update(documentResult);
        await dbContext.SaveChangesAsync();
        return documentResult;
    }
}