using System.Reflection.Metadata;
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
            OwnerId = currentContext.UserId!.Value,
            CreatedAt = DateTime.Now.ToUniversalTime(),
            LastModifiedAt = DateTime.Now.ToUniversalTime()
        };
        
        return await projectRepository.CreateProject(newProject);
    }
    
    public async Task<Project> UpdateProject(Guid projectId, UpdateProjectDto updateProjectDto)
    {
        var existingProject = await projectRepository.GetProject(projectId);
        existingProject.Name = updateProjectDto.Name ?? existingProject.Name;
        existingProject.Description = updateProjectDto.Description ?? existingProject.Description;
        existingProject.LastModifiedAt = DateTime.Now.ToUniversalTime();
       
        if (updateProjectDto.Documents != null)
            existingProject.Documents = updateProjectDto.Documents
                .Where(d => existingProject.Documents.All(ed => ed.Id != d.Id))
                .ToList();
        return await projectRepository.UpdateProject(existingProject);
    }
    
    public async Task<Project> GetProject(Guid id)
    {
        return await projectRepository.GetProject(id);
    }
    
    public async Task DeleteProject(Guid id)
    {
        await projectRepository.DeleteProject(id);
    }
    
    public async Task<List<Project>> GetProjects()
    {
        return await projectRepository.GetProjects(currentContext.UserId!.Value);
    }
}