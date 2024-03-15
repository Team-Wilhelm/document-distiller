using System.Text;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Models;

namespace VirtualFriend.Controller;

[ApiController]
[Route("[controller]")]
[Authorize]
public class DocumentController(DocumentService documentService) : ControllerBase
{
    
    [HttpPost("summarise")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DocumentSummary))]
    public async Task<IActionResult> SummariseDocument(IFormFile file)
    {
        var text = ConvertPdfToString(file);
        var summarisedText = await documentService.SummariseContent(text, file);
        
        return Ok(summarisedText);
    }
    
    [HttpPost("keysentences")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DocumentKeySentences))]
    public async Task<IActionResult> ExtractKeySentences(IFormFile file)
    {
        var text = ConvertPdfToString(file);
        var keySentences = await documentService.ExtractKeySentences(text, file);
        
        return Ok(keySentences);
    }
    
    [HttpPost("keypoints")]
    public async Task<IActionResult> ExtractKeyPoints(IFormFile file)
    {
        var text = ConvertPdfToString(file);
        var keyPoints = await documentService.ExtractKeyPoints(text);
        
        return Ok(keyPoints);
    }
    
    [HttpPost("translate")]
    public async Task<IActionResult> TranslateDocument(IFormFile file)
    {
        var text = ConvertPdfToString(file);
        var translatedText = await documentService.TranslateContent(text);
        
        return Ok(translatedText);
    }
    
    [HttpPost("save-result")]
    public async Task<IActionResult> SaveResult(DocumentResult result)
    {
        var savedResult = await documentService.SaveResult(null, result);
        return Ok(savedResult);
    }
    
    //TODO why no worky, how to use discriminator
    [HttpGet("recent")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<DocumentResult>))]
    public async Task<IActionResult> GetRecentDocuments()
    {
        var recentResults = await documentService.GetRecentDocuments();
        Console.WriteLine("HEEEEEEEEEEEEEYYYYYY"+recentResults.Count);
        return Ok(recentResults);
    }
    
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteDocument([FromRoute]Guid id)
    {
        await documentService.DeleteDocument(id);
        return Ok();
    }
    
    [HttpPut("update")]
    public async Task<IActionResult> UpdateDocument(DocumentResult document)
    {
        var updatedDocument = await documentService.UpdateDocument(document);
        return Ok(updatedDocument);
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
}