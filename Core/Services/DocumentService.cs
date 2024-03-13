using System.Text;
using Azure;
using Azure.AI.TextAnalytics;
using Core.Context;
using Infrastructure;
using Microsoft.AspNetCore.Http;
using Shared.Models;

namespace Core.Services;

public class DocumentService(TextAnalyticsClient client, DocumentRepository documentRepository, CurrentContext currentContext, AppDbContext dbContext)
{
    Guid projectId = dbContext.Project.First().Id; //TODO: Get the project id dynamically
    
    public async Task<DocumentSummary> SummariseContent(string text, IFormFile file)
    {
        var summaryResult = new StringBuilder();
        var batchInput = new List<string>
        {
            text
        };
        
        var actions = new TextAnalyticsActions
        {
            AbstractiveSummarizeActions = new List<AbstractiveSummarizeAction> { new() }
        };
        
        var operation = await client.StartAnalyzeActionsAsync(batchInput, actions);
        await operation.WaitForCompletionAsync();
        
        await foreach (var documentsInPage in operation.Value)
        {
            IReadOnlyCollection<AbstractiveSummarizeActionResult> summaryResults = documentsInPage.AbstractiveSummarizeResults;
        
            foreach (var summaryActionResults in summaryResults)
            {
                if (summaryActionResults.HasError)
                {
                    HandleTextAnalyticsError(summaryActionResults.Error, "Action");
                    continue;
                }
        
                foreach (var documentResults in summaryActionResults.DocumentsResults)
                {
                    if (documentResults.HasError)
                    {
                        HandleTextAnalyticsError(summaryActionResults.Error, "Document");
                        continue;
                    }
        
                    foreach (var summary in documentResults.Summaries)
                    {
                        summaryResult.AppendLine(summary.Text);
                    }
                }
            }
        }

        var document = new DocumentSummary()
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            Title = "Summary",
            CreatedAt = DateTime.Now.ToUniversalTime(),
            LastModifiedAt = DateTime.Now.ToUniversalTime(),
            FileName = file.FileName,
            Result = summaryResult.ToString()
        };

        return document;
    }
    
    public async Task<DocumentKeySentences> ExtractKeySentences(string text, IFormFile file)
    {
        var summaryResult = new StringBuilder();
        var batchInput = new List<string>
        {
            text
        };
        
        var actions = new TextAnalyticsActions
        {
            ExtractiveSummarizeActions = new List<ExtractiveSummarizeAction> { new() },
        };
        
        var operation = await client.StartAnalyzeActionsAsync(batchInput, actions);
        await operation.WaitForCompletionAsync();
        
        await foreach (var documentsInPage in operation.Value)
        {
            IReadOnlyCollection<ExtractiveSummarizeActionResult> summaryResults = documentsInPage.ExtractiveSummarizeResults;
            foreach (var summaryActionResults in summaryResults)
            {
                if (summaryActionResults.HasError)
                {
                    HandleTextAnalyticsError(summaryActionResults.Error, "Action");
                    continue;
                }
        
                foreach (var documentResults in summaryActionResults.DocumentsResults)
                {
                    if (documentResults.HasError)
                    {
                        HandleTextAnalyticsError(summaryActionResults.Error, "Document");
                        continue;
                    }
        
                    foreach (var sentence in documentResults.Sentences)
                    {
                        summaryResult.AppendLine(sentence.Text);
                    }
                }
            }
        }
        
        var document = new DocumentKeySentences()
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            Title = "Key sentences",
            CreatedAt = DateTime.Now.ToUniversalTime(),
            LastModifiedAt = DateTime.Now.ToUniversalTime(),
            FileName = file.FileName,
            Result = summaryResult.ToString()
        };
        return document;
    }

    public async Task<string> ExtractKeyPoints(string text)
    {
        var keyPhrasesString = "";
        try
        {
            var response = await client.ExtractKeyPhrasesAsync(text);
            var keyPhrases = response.Value;
            keyPhrasesString = string.Join(", ", keyPhrases);
        }
        catch (RequestFailedException exception)
        {
            Console.WriteLine($"Error Code: {exception.ErrorCode}");
            Console.WriteLine($"Message: {exception.Message}");
        }
        return keyPhrasesString;
    }

    public async Task<string?> TranslateContent(string text)
    {
        throw new NotImplementedException();
    }
    
    public async Task<DocumentResult> SaveResult(IFormFile file, DocumentResult result)
    {
        // TODO: Save the file somewhere
        switch (result.Discriminator)
        {
            case nameof(DocumentSummary):
                var summary = new DocumentSummary(result);
                return await documentRepository.SaveDocumentSummary(summary);
            case nameof(DocumentKeySentences):
                var keySentences = new DocumentKeySentences(result);
                return await documentRepository.SaveDocumentKeySentences(keySentences);
        }
        throw new InvalidOperationException("Invalid result type");
    }
    
    public async Task<List<DocumentResult>> GetRecentDocuments()
    {
        return await documentRepository.GetRecentDocuments(currentContext.UserId!.Value);
    }
    
    // Utility methods
    private void HandleTextAnalyticsError(TextAnalyticsError error, string type)
    {
        Console.WriteLine("  Error!");
        Console.WriteLine($"  {type} error code: {error.ErrorCode}.");
        Console.WriteLine($"  Message: {error.Message}");
    }
}