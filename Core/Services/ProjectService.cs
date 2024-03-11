using Core.Context;
using Infrastructure;
using Shared.Dtos;
using Shared.Models;

namespace Core.Services;

public class ProjectService(ProjectRepository projectRepository, CurrentContext currentContext)
{
    public async Task<Project> CreateProject(CreateProjectDto project)
    {
        var newProject = new Project
        {
            Id = Guid.NewGuid(),
            Name = project.Name,
            Description = project.Description,
            OwnerId = currentContext.UserId!.Value
        };
        
        return await projectRepository.CreateProject(newProject);
    }
}