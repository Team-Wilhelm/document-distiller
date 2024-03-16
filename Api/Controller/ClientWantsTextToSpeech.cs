using System.Text.Json;
using Core.Services;
using Fleck;
using lib;


namespace VirtualFriend.Controller;

public class ClientWantsTextToSpeechDto : BaseDto
{
    public string Text { get; set; }
}

public class ClientWantsTextToSpeech(SpeechService speechService) : BaseEventHandler<ClientWantsTextToSpeechDto>
{
    public override async Task Handle(ClientWantsTextToSpeechDto dto, IWebSocketConnection socket)
    {
        var audioStream = await speechService.GetSpeechAsStream(dto.Text);
        audioStream.Position = 0;    
        var bytes = new byte[audioStream.Length];
        await audioStream.ReadAsync(bytes, 0, bytes.Length);

        var base64Data = Convert.ToBase64String(bytes);
        var serverWillSendSpeech = new ServerWillSendSpeech
        {
            Type = "audio/wav",
            Length = bytes.Length,
            Data = base64Data
        };
        socket.SendDto(serverWillSendSpeech);
    }
}

public class ServerWillSendSpeech : BaseDto
{
    public string Type { get; set; }
    public int Length { get; set; }
    public string Data { get; set; }
}

public static class SocketExtensionMethods
{
    public static void SendDto<T>(this IWebSocketConnection socket, T dto) where T : BaseDto
    {
        socket.Send(JsonSerializer.Serialize(dto, new JsonSerializerOptions
            { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}