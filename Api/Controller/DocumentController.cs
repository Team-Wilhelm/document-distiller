using System.Text;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VirtualFriend.Controller;

[ApiController]
[Route("[controller]")]
[Authorize]
public class DocumentController(DocumentService documentService) : ControllerBase
{
    [HttpPost("summarise")]
    public async Task<IActionResult> SummariseDocument(IFormFile file)
    {
        var text = ConvertPdfToString(file);
        var summarisedText = await documentService.SummariseContent(text);
        
        return Ok(summarisedText);
    }
    
    [HttpPost("keysentences")]
    public async Task<IActionResult> ExtractKeySentences(IFormFile file)
    {
        var text = ConvertPdfToString(file);
        var keySentences = await documentService.ExtractKeySentences(text);
        
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