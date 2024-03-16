using System.Text;
using Azure;
using Azure.AI.TextAnalytics;
using Azure.AI.Vision.ImageAnalysis;
using Core.Configuration;
using Core.Context;
using Infrastructure;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Shared.Dtos;
using Shared.Exceptions;
using Shared.Models;

namespace Core.Services;

public class DocumentService(
    TextAnalyticsClient client,
    DocumentRepository documentRepository,
    CurrentContext currentContext,
    IOptions<AzureAiSettings> aiSettings)
{
    public async Task<DocumentSummary> SummariseContent(IFormFile file, string noteTitle)
    {
        var batchInput = PrepareBatchInput(file);
        var actions = new TextAnalyticsActions
            { AbstractiveSummarizeActions = new List<AbstractiveSummarizeAction> { new() } };
        var operation = await StartAnalysisOperation(batchInput, actions);
        var summaryResult = new StringBuilder();
        await operation.WaitForCompletionAsync();

        await foreach (var documentsInPage in operation.Value)
        {
            IReadOnlyCollection<AbstractiveSummarizeActionResult> summaryResults =
                documentsInPage.AbstractiveSummarizeResults;

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
            Title = noteTitle,
            CreatedAt = DateTime.Now.ToUniversalTime(),
            LastModifiedAt = DateTime.Now.ToUniversalTime(),
            FileName = file.FileName,
            Result = summaryResult.ToString()
        };
        return document;
    }

    public async Task<DocumentKeySentences> ExtractKeySentences(IFormFile file, string noteTitle)
    {
        var batchInput = PrepareBatchInput(file);
        var actions = new TextAnalyticsActions
            { ExtractiveSummarizeActions = new List<ExtractiveSummarizeAction> { new() } };
        var operation = await StartAnalysisOperation(batchInput, actions);
        var summaryResult = new StringBuilder();
        await operation.WaitForCompletionAsync();

        await foreach (var documentsInPage in operation.Value)
        {
            IReadOnlyCollection<ExtractiveSummarizeActionResult> summaryResults =
                documentsInPage.ExtractiveSummarizeResults;
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
            Title = noteTitle,
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

    public async Task<DocumentResult> TranslateContent(IFormFile file, string noteTitle, string targetLanguage)
    {
        var text = ConvertPdfToString(file);
        object[] body = [new { Text = text }];
        var requestBody = JsonConvert.SerializeObject(body);

        using var client = new HttpClient();
        using var request = new HttpRequestMessage();
        var queryParams = $"&to={targetLanguage}";

        // Build the request.
        request.Method = HttpMethod.Post;
        request.RequestUri = new Uri(aiSettings.Value.TRANSLATOR_TEXT_ENDPOINT + queryParams);
        request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
        request.Headers.Add("Ocp-Apim-Subscription-Key", aiSettings.Value.TRANSLATOR_KEY);
        request.Headers.Add("Ocp-Apim-Subscription-Region", aiSettings.Value.TRANSLATOR_LOCATION);

        // Send the request and get response.
        HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false);

        // Read response as a string.
        var result = await response.Content.ReadAsStringAsync();
        var translatedText = JsonConvert.DeserializeObject<List<TranslatorResponse>>(result);

        var document = new DocumentResult()
        {
            Id = Guid.NewGuid(),
            ProjectId = Guid.Empty,
            Title = noteTitle,
            CreatedAt = DateTime.Now.ToUniversalTime(),
            LastModifiedAt = DateTime.Now.ToUniversalTime(),
            FileName = file.FileName,
            Result = translatedText[0].Translations[0].Text
        };
        return document;
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

    public async Task<DocumentResult> ImageToText(IFormFile file, string noteTitle)
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
            Title = noteTitle,
            CreatedAt = DateTime.Now.ToUniversalTime(),
            LastModifiedAt = DateTime.Now.ToUniversalTime(),
            FileName = file.FileName,
            Result = string.Join("\n", resultList)
        };
        return document;
    }

    /**
     * Get available languages for translation in the Azure Cognitive Services Translator Text API
     * with a code and a name for each language.
     */
    public async Task<List<TranslationSelection>> GetAvailableLanguages()
    {
        const string endpoint =
            "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation";
        var client = new HttpClient();
        var response = await client.GetAsync(endpoint);

        /* Response format:
         * {
              "translation": {
                ...
                "fr": {
                  "name": "French",
                  "nativeName": "Français",
                  "dir": "ltr"
                },
                ...
              }
            }
         */
        var jsonString = await response.Content.ReadAsStringAsync();
        JObject jObject = JObject.Parse(jsonString);
        JObject translationObject = (JObject)jObject["translation"]!;

        // Map the response to a list of TranslationSelection objects, to be used in the UI
        List<TranslationSelection> languages = translationObject.Properties().Select(p => new TranslationSelection
        {
            Code = p.Name,
            Name = p.Value["name"]!.ToString()
        }).ToList();
        return languages;
    }

    // Utility methods
    private void HandleTextAnalyticsError(TextAnalyticsError error, string type)
    {
        Console.WriteLine("  Error!");
        Console.WriteLine($"  {type} error code: {error.ErrorCode}.");
        Console.WriteLine($"  Message: {error.Message}");
    }

    private void HandleDocumentAction(IFormFile file, string type, string fileName)
    {
        var text = ConvertPdfToString(file);
    }

    private string ConvertPdfToString(IFormFile file)
    {
        var reader = new PdfReader(file.OpenReadStream());
        var pdfDocument = new PdfDocument(reader);
        var stringBuilder = new StringBuilder();
        for (int page = 1; page <= pdfDocument.GetNumberOfPages(); page++)
        {
            var text = PdfTextExtractor.GetTextFromPage(pdfDocument.GetPage(page));
            stringBuilder.Append(text);
        }

        reader.Close();
        pdfDocument.Close();
        return stringBuilder.ToString();
    }

    private async Task<AnalyzeActionsOperation> StartAnalysisOperation(List<string> batchInput,
        TextAnalyticsActions actions)
    {
        var operation = await client.StartAnalyzeActionsAsync(batchInput, actions);
        await operation.WaitForCompletionAsync();
        return operation;
    }

    private List<string> PrepareBatchInput(IFormFile file)
    {
        var text = ConvertPdfToString(file);
        var batchInput = new List<string> { text };
        return batchInput;
    }
}