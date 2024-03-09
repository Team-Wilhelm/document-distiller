using System.Text;
using Azure;
using Azure.AI.TextAnalytics;

namespace Core.Services;

public class DocumentService(TextAnalyticsClient client)
{
    public async Task<string?> ExtractKeySentences(string text)
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
                    Console.WriteLine("  Error!");
                    Console.WriteLine($"  Action error code: {summaryActionResults.Error.ErrorCode}.");
                    Console.WriteLine($"  Message: {summaryActionResults.Error.Message}");
                    continue;
                }
        
                foreach (var documentResults in summaryActionResults.DocumentsResults)
                {
                    if (documentResults.HasError)
                    {
                        Console.WriteLine("  Error!");
                        Console.WriteLine($"  Document error code: {documentResults.Error.ErrorCode}.");
                        Console.WriteLine($"  Message: {documentResults.Error.Message}");
                        continue;
                    }
        
                    foreach (var sentence in documentResults.Sentences)
                    {
                        summaryResult.AppendLine(sentence.Text);
                    }
                }
            }
        }
        return summaryResult.ToString();
    }
    
    public async Task<string?> SummariseContent(string text)
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
                    Console.WriteLine("  Error!");
                    Console.WriteLine($"  Action error code: {summaryActionResults.Error.ErrorCode}.");
                    Console.WriteLine($"  Message: {summaryActionResults.Error.Message}");
                    continue;
                }
        
                foreach (var documentResults in summaryActionResults.DocumentsResults)
                {
                    if (documentResults.HasError)
                    {
                        Console.WriteLine("  Error!");
                        Console.WriteLine($"  Document error code: {documentResults.Error.ErrorCode}.");
                        Console.WriteLine($"  Message: {documentResults.Error.Message}");
                        continue;
                    }
        
                    foreach (var summary in documentResults.Summaries)
                    {
                        summaryResult.AppendLine(summary.Text);
                    }
                }
            }
        }
        return summaryResult.ToString();
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
}