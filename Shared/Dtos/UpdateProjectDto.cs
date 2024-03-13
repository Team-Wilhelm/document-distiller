using Shared.Models;

namespace Shared.Dtos;

public class UpdateProjectDto
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public List<DocumentResult>? Documents { get; set; }
}