using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Models;
using VirtualFriend.Controller.Util;

namespace VirtualFriend.Controller;

[ApiController]
[Route("[controller]")]
[Authorize]
public class SpeechController (SpeechService speechService) : ControllerBase
{
    [HttpGet("speech")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSpeech(string text)
    {
        var audioStream = await speechService.GetSpeechAsStream(text);
        if (audioStream == null)
        {
            return NotFound();
        }
        return File(audioStream, "audio/wav");
    }
    //seperate uploading the file and getting the audio stream in order to add the text to the body
    
    /*
     * In your Angular application,
     * to receive and play or download the audio file sent from your server,
     * you would typically use the HttpClient service to make a GET request to the endpoint providing the audio stream.
     * Then, based on the response,
     * you could create a Blob object and use it to either play the audio using the Web Audio API
     * or create a link for downloading the file. For playback,
     * you might convert the Blob to an audio source.
     * For downloading, create an object URL from the Blob and set it as the href of an anchor (<a>) element,
     * then programmatically click it to trigger the download.
     */
}