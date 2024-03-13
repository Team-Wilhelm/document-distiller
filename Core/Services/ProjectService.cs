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
            OwnerId = currentContext.UserId!.Value
        };
        
        return await projectRepository.CreateProject(newProject);
    }
    
    public async Task<Project> UpdateProject(UpdateProjectDto project)
    {
        var existingProject = await projectRepository.GetProject(project.Id);
        existingProject.Name = project.Name ?? existingProject.Name;
        existingProject.Description = project.Description ?? existingProject.Description;
        existingProject.LastModifiedAt = DateTime.Now;
        if (project.Documents != null)
            existingProject.Documents = project.Documents
                .Where(d => existingProject.Documents.All(ed => ed.Id != d.Id))
                .ToList();
        return await projectRepository.UpdateProject(existingProject);
    }
    
    public async Task<Project> GetProject(Guid id)
    {
        return await projectRepository.GetProject(id);
    }
    
    public async Task<Project> DeleteProject(Guid id)
    {
        return await projectRepository.DeleteProject(id);
    }
    
    public async Task<List<Project>> GetProjects()
    {
        return await projectRepository.GetProjects(currentContext.UserId!.Value);
    }
}