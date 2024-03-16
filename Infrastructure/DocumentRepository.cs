using Microsoft.EntityFrameworkCore;
using Shared.Exceptions;
using Shared.Models;

namespace Infrastructure;

public class DocumentRepository(AppDbContext dbContext)
{
    public async Task<DocumentResult> SaveDocumentResult(DocumentResult documentResult)
    {
        dbContext.DocumentResult.Add(documentResult);
        await dbContext.SaveChangesAsync();
        return documentResult;
    }

    public async Task<List<DocumentResult>> GetRecentDocuments(Guid userId)
    {
        var userProjects = await dbContext.Project.Where(x => x.OwnerId == userId).ToListAsync();
        var recentDocuments = 
            await dbContext.DocumentResult.Where(x => 
                    userProjects.Select(project => project.Id)
                        .Contains(x.ProjectId))
                .OrderByDescending(x => x.CreatedAt).Take(10).ToListAsync();
        return recentDocuments;
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
        dbContext.DocumentResult.Update(documentResult);
        await dbContext.SaveChangesAsync();
        return documentResult;
    }
    
    public async Task<DocumentResult?> GetById(Guid id)
    {
        return await dbContext.DocumentResult.FirstOrDefaultAsync(doc => doc.Id == id);
    }
}