using System.Text;
using Core;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace VirtualFriend.Controller;

public class DocumentController(DocumentService documentService) : ControllerBase
{
    [HttpPost("summarise")]
    public async Task<IActionResult> SummariseDocument(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("File is null or empty");
        }
        
        //TODO: find a way to convert file to string properly, does this even work? Also move this to the service probably
        var fileString = ConvertFileToString(file);
        var summarisedDocument = await documentService.SummariseContent(fileString);
        
        //TODO: decide on the return type
        return Ok(summarisedDocument);
        
        //Console.WriteLine($"Received file: {file.FileName}");
    }

    [HttpPost("keypoints")]
    public async Task<IActionResult> ExtractKeyPoints(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("File is null or empty");
        }
        var fileString = ConvertFileToString(file);
        var keyPoints = await documentService.ExtractKeyPoints(fileString);
        
        return Ok(keyPoints);
    }

    [HttpPost("translate")]
    public async Task<IActionResult> TranslateDocument([FromBody] string message)
    {
        //return documentService.ExtractKeyPoints(message);
        throw new NotImplementedException();
    }
    
    //TODO: move this to utils if it will be used fr fr
    public string ConvertFileToString(IFormFile file)
    {
        var fileString = new StringBuilder();
        using (var reader = new StreamReader(file.OpenReadStream()))
        {
            while (reader.Peek() >= 0)
                fileString.AppendLine(reader.ReadLine()); 
        }
        return fileString.ToString();
    }
}