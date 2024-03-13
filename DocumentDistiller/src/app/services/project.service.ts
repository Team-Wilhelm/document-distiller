import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CreateProjectDto, Project, UpdateProjectDto} from "../models/project";
import {firstValueFrom} from "rxjs";
import {ProjectActions} from "../dashboard/constants/ServerUrls";

@Injectable()
export class ProjectService {

  public projects: Project[] = [];

  constructor(private httpClient: HttpClient) {
    this.getAllProjects().then();
  }

  async getAllProjects() {
    try {
      this.projects = await firstValueFrom(
        this.httpClient.get<Project[]>(ProjectActions.BASE)
      ) ?? [];
    } catch (e) {
      console.error(e);
    }
  }

  async getProject(id: string) {
    try {
      return (await firstValueFrom(this.httpClient.get<Project>(ProjectActions.BASE + `/${id}`))) ?? ({} as Project);
    } catch (e) {
      console.error(e);
      return {} as Project;
    }
  }

  async createProject(project: CreateProjectDto) {
    try {
      const createdProject = await firstValueFrom(this.httpClient.post<Project>(ProjectActions.CREATE, project));
      if (createdProject) {
        this.projects = [...this.projects, createdProject];
      }
      return createdProject ?? ({} as Project);
    } catch (e) {
      console.error(e);
      return {} as Project;
    }
  }

  async updateProject(project: UpdateProjectDto) {
    try {
      const updatedProject = await firstValueFrom(this.httpClient.put<Project>(ProjectActions.UPDATE, project));
      if (updatedProject) {
        const index = this.projects.findIndex(p => p.id === updatedProject.id);
        if (index !== -1) {
          this.projects[index] = updatedProject;
        }
      }
      return updatedProject ?? ({} as Project);
    } catch (e) {
      console.error(e);
      return {} as Project;
    }
  }

  async deleteProject(id: string) {
    try {
      await firstValueFrom(this.httpClient.delete<Project>(`${ProjectActions.BASE}/${id}`));
      this.projects = this.projects.filter(project => project.id !== id);
    } catch (e) {
      console.error(e);
    }
  }
}
