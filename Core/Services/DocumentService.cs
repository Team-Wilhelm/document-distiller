using System.Text;
using Azure;
using Azure.AI.TextAnalytics;
using Azure.AI.Vision.ImageAnalysis;
using Core.Configuration;
using Core.Context;
using Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Options;
using Shared.Dtos;
using Shared.Exceptions;
using Shared.Models;

namespace Core.Services;

public class DocumentService(TextAnalyticsClient client, DocumentRepository documentRepository, CurrentContext currentContext, IOptions<AzureAiSettings> aiSettings)
{
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
            ProjectId = Guid.Empty,
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
            ProjectId = Guid.Empty,
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
        return await documentRepository.SaveDocumentResult(result);
    }
    
    public async Task<List<DocumentResult>> GetRecentDocuments()
    {
        return await documentRepository.GetRecentDocuments(currentContext.UserId!.Value);
    }
    
    public async Task DeleteDocument(Guid id)
    {
        await documentRepository.DeleteDocument(id);
    }
    
    public async Task<DocumentResult> UpdateDocument(Guid documentId, UpdateDocumentResultDto updateDocumentResultDto)
    {
        var document = await documentRepository.GetById(documentId);
        if (document is null)
        {
            throw new NotFoundException($"Document with ID {documentId} does not exit");
        }
        
        document.Title = updateDocumentResultDto.Title;
        document.Result = updateDocumentResultDto.Content;
        document.LastModifiedAt = DateTime.Now.ToUniversalTime();
        return await documentRepository.UpdateDocument(document);
    }
    
    public async Task<DocumentResult> ImageToText(IFormFile file)
    {
        var endpoint = aiSettings.Value.VISION_ENDPOINT;
        var key = aiSettings.Value.VISION_KEY;

        var client = new ImageAnalysisClient(new Uri(endpoint), new AzureKeyCredential(key));
        
        // Read the file into a stream
        var stream = file.OpenReadStream();
        
        // Convert the stream to binary data, so it can be sent to the service
        var binaryData = await BinaryData.FromStreamAsync(stream);
        
        ImageAnalysisResult result = await client.AnalyzeAsync(
            binaryData,
            VisualFeatures.Caption | VisualFeatures.Read,
            new ImageAnalysisOptions { GenderNeutralCaption = true });
        
        var resultList = new List<string>();
        
        foreach (DetectedTextBlock block in result.Read.Blocks)
        foreach (DetectedTextLine line in block.Lines)
        {
            resultList.Add(line.Text);
        }
        
        var document = new DocumentResult()
        {
            Id = Guid.NewGuid(),
            ProjectId = Guid.Empty,
            Title = "Image to text",
            CreatedAt = DateTime.Now.ToUniversalTime(),
            LastModifiedAt = DateTime.Now.ToUniversalTime(),
            FileName = file.FileName,
            Result = string.Join("\n", resultList)
        };
        return document;
    }
    
    // Utility methods
    private void HandleTextAnalyticsError(TextAnalyticsError error, string type)
    {
        Console.WriteLine("  Error!");
        Console.WriteLine($"  {type} error code: {error.ErrorCode}.");
        Console.WriteLine($"  Message: {error.Message}");
    }
}