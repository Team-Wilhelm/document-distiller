using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;
using Shared.Models;

namespace VirtualFriend.Controller;

[ApiController]
[Route("[controller]")]
[Authorize]
public class DocumentController(DocumentService documentService) : ControllerBase
{
    [HttpPost("summarise")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DocumentSummary))]
    public async Task<IActionResult> SummariseDocument(IFormFile file, [FromQuery] string noteTitle)
    {
        if (file.ContentType != "application/pdf")
        {
            return BadRequest("Invalid file type");
        }
        var summarisedText = await documentService.SummariseContent(file, noteTitle);
        return Ok(summarisedText);
    }
    
    [HttpPost("keysentences")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DocumentKeySentences))]
    public async Task<IActionResult> ExtractKeySentences(IFormFile file, [FromQuery] string noteTitle)
    {
        if (file.ContentType != "application/pdf")
        {
            return BadRequest("Invalid file type");
        }
        var keySentences = await documentService.ExtractKeySentences(file, noteTitle);
        return Ok(keySentences);
    }
    
    /** Not used in the application 
    [HttpPost("keypoints")]
    public async Task<IActionResult> ExtractKeyPoints(IFormFile file)
    {
        var keyPoints = await documentService.ExtractKeyPoints(file);
        
        return Ok(keyPoints);
    }
    */
    
    [HttpPost("translate")]
    public async Task<IActionResult> TranslateDocument(IFormFile file, [FromQuery] string noteTitle, [FromQuery] string targetLanguage)
    {
        if (file.ContentType != "application/pdf")
        {
            return BadRequest("Invalid file type");
        }
        var translatedText = await documentService.TranslateContent(file, noteTitle, targetLanguage);
        return Ok(translatedText);
    }
    
    [HttpPost("save-result")]
    public async Task<IActionResult> SaveResult(DocumentResult result)
    {
        var savedResult = await documentService.SaveResult(null, result);
        return Ok(savedResult);
    }
    
    [HttpPost("image-to-text")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DocumentResult))]
    public async Task<IActionResult> ImageToText(IFormFile file, [FromQuery] string noteTitle)
    {
        if (file.ContentType != "image/jpeg" && file.ContentType != "image/png")
        {
            return BadRequest("Invalid file type");
        }
        
        var results = await documentService.ImageToText(file, noteTitle);
        return Ok(results);
    }
    
    [HttpGet("recent")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<DocumentResult>))]
    public async Task<IActionResult> GetRecentDocuments()
    {
        var recentResults = await documentService.GetRecentDocuments();
        return Ok(recentResults);
    }
    
    [HttpDelete("delete/{id:guid}")]
    public async Task<IActionResult> DeleteDocument([FromRoute]Guid id)
    {
        await documentService.DeleteDocument(id);
        return Ok();
    }
    
    [HttpPut("update/{documentId:guid}")]
    public async Task<IActionResult> UpdateDocument([FromRoute] Guid documentId,[FromBody]UpdateDocumentResultDto updateDocumentResultDto)
    {
        var updatedDocument = await documentService.UpdateDocument(documentId, updateDocumentResultDto);
        return Ok(updatedDocument);
    }
}