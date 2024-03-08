using Core;
using Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace VirtualFriend.Controller;

public class DocumentController(DocumentService documentService) : ControllerBase
{
    [HttpPost("summarise")]
    public async Task<IActionResult> SummariseDocument(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("File is null or empty");
        }

        Console.WriteLine($"Received file: {file.FileName}");
        return Ok();
    }
    
    [HttpPost("translate")]
    public async Task<IActionResult> TranslateDocument([FromBody] string message)
    {
        //return documentService.ExtractKeyPoints(message);
        throw new NotImplementedException();
    }
}