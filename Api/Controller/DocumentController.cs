using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Models;
using VirtualFriend.Controller.Util;

namespace VirtualFriend.Controller;

[ApiController]
[Route("[controller]")]
[Authorize]
public class DocumentController(DocumentService documentService, Converter converter) : ControllerBase
{
    [HttpPost("summarise")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DocumentSummary))]
    public async Task<IActionResult> SummariseDocument(IFormFile file)
    {
        var text = converter.ConvertPdfToString(file);
        var summarisedText = await documentService.SummariseContent(text);
        
        return Ok(summarisedText);
    }
    
    [HttpPost("keysentences")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DocumentKeySentences))]
    public async Task<IActionResult> ExtractKeySentences(IFormFile file)
    {
        var text = converter.ConvertPdfToString(file);
        var keySentences = await documentService.ExtractKeySentences(text);
        
        return Ok(keySentences);
    }
    
    [HttpPost("keypoints")]
    public async Task<IActionResult> ExtractKeyPoints(IFormFile file)
    {
        var text = converter.ConvertPdfToString(file);
        var keyPoints = await documentService.ExtractKeyPoints(text);
        
        return Ok(keyPoints);
    }
    
    [HttpPost("translate")]
    public async Task<IActionResult> TranslateDocument(IFormFile file)
    {
        var text = converter.ConvertPdfToString(file);
        var translatedText = await documentService.TranslateContent(text);
        
        return Ok(translatedText);
    }
}