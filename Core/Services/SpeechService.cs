using Microsoft.AspNetCore.Mvc;
using Microsoft.CognitiveServices.Speech;
using Shared.Models;

namespace Core.Services;

public class SpeechService (SpeechSynthesizer speechSynthesizer)
{
    public async Task<MemoryStream> GetSpeechAsStream(string text)
    {
        if (string.IsNullOrEmpty(text))
        {
            return new MemoryStream();
        }
        var audio = await speechSynthesizer.SpeakTextAsync(text);
        var audioStream = new MemoryStream(audio.AudioData);
        audioStream.Position = 0;
        return audioStream;
    }
}

