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
}