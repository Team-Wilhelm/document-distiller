using System.Text.Json;
using Core.Services;
using Fleck;
using lib;


namespace VirtualFriend.Controller;

public class ClientWantsTextToSpeechDto : BaseDto
{
    public string Text { get; set; }
}

public class ClientWantsTextToSpeechHandler(SpeechService speechService) : BaseEventHandler<ClientWantsTextToSpeechDto>
{
    public override async Task Handle(ClientWantsTextToSpeechDto dto, IWebSocketConnection socket)
    {
        var audioStream = await speechService.GetSpeechAsStream(dto.Text);
            
        var bytes = new byte[audioStream.Length];
        await audioStream.ReadAsync(bytes, 0, bytes.Length);

        socket.SendDto(new ServerWillSendSpeech
        {
            Length = bytes.Length
        });
        await socket.Send(bytes);
    }
}

public class ServerWillSendSpeech : BaseDto
{
    public string Format { get; set; } = "wav";
    public int Length { get; set; }
}

public static class SocketExtensionMethods
{
    public static void SendDto<T>(this IWebSocketConnection socket, T dto) where T : BaseDto
    {
        socket.Send(JsonSerializer.Serialize(dto, new JsonSerializerOptions
            { PropertyNameCaseInsensitive = true }));
    }
}