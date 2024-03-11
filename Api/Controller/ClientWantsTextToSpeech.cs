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
        try
        {
            var audioStream = await speechService.GetSpeechAsStream(dto.Text);
            
            byte[] bytes = new byte[audioStream.Length];
            await audioStream.ReadAsync(bytes, 0, bytes.Length);
            
            await socket.Send(bytes);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}