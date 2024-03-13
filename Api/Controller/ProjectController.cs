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
    
    [HttpPost("update")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Project))]
    public async Task<IActionResult> UpdateProject(UpdateProjectDto project)
    {
        var updatedProject = await projectService.UpdateProject(project);
        return Ok(updatedProject);
    }
    
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Project))]
    public async Task<IActionResult> GetProject(Guid id)
    {
        var project = await projectService.GetProject(id);
        return Ok(project);
    }
    
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        await projectService.DeleteProject(id);
        return Ok();
    }
    
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Project>))]
    public async Task<IActionResult> GetProjects()
    {
        var projects = await projectService.GetProjects();
        return Ok(projects);
    }
}