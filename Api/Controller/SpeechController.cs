using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VirtualFriend.Controller;

[ApiController]
[Route("[controller]")]
[Authorize]

//TODO delete this class when it is proven obsolete
public class SpeechController (SpeechService speechService) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task AddSpeech(string text)
    {
        await speechService.GetSpeechAsStream(text);
    }
    
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSpeech(string text)
    {
        var audioStream = await speechService.GetSpeechAsStream(text);
        if (audioStream.Length == 0)
        {
            return NotFound();
        }
        return File(audioStream, "audio/wav");
    }
}