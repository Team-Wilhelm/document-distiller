using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;
using Shared.Models;

namespace VirtualFriend.Controller;

[ApiController]
[Route("[controller]")]
[Authorize]
public class ProjectController(ProjectService projectService) : ControllerBase
{
    [HttpPost("create")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Project))]
    public async Task<IActionResult> CreateProject(CreateProjectDto project)
    {
        var createdProject = await projectService.CreateProject(project);
        return Ok(createdProject);
    }
}