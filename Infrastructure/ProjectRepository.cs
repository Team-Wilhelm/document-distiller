using Microsoft.EntityFrameworkCore;
using Shared.Models;

namespace Infrastructure;

public class ProjectRepository(AppDbContext dbContext)
{
    public async Task<Project> CreateProject(Project project)
    {
        dbContext.Project.Add(project);
        await dbContext.SaveChangesAsync();
        return project;
    }
    
    public async Task<Project> GetProject(Guid id)
    {
        var project = await dbContext.Project
            .Include(p => p.Documents)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (project == null)
        {
            throw new Exception("Project not found");
        }
        return project;
    }
    
    public async Task<Project> UpdateProject(Project project)
    {
        dbContext.Project.Update(project);
        await dbContext.SaveChangesAsync();
        return project;
    }
    
    public async Task DeleteProject(Guid id)
    {
        var project = await dbContext.Project.FirstOrDefaultAsync(p => p.Id == id);
        if (project == null)
        {
            throw new Exception("Project not found");
        }
        dbContext.Project.Remove(project);
        await dbContext.SaveChangesAsync();
    }
    
    public async Task<List<Project>> GetProjects(Guid ownerId)
    {
        var projects = await dbContext.Project
            .Include(p => p.Documents)
            .Where(p => p.OwnerId == ownerId)
            .ToListAsync();
        if (projects == null)
        {
            throw new Exception("No projects found");
        }
        return projects;
    }
}