import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CreateProjectDto, Project, UpdateProjectDto} from "../models/project";
import {firstValueFrom} from "rxjs";
import {ProjectActions} from "../dashboard/constants/ServerUrls";
import {ProjectStore} from "../stores/project.store";

@Injectable()
export class ProjectService {
  constructor(private httpClient: HttpClient, private projectStore: ProjectStore) {
    this.getAllProjects().then();
  }

  async getAllProjects() {
    try {
      const projects = await firstValueFrom(this.httpClient.get<Project[]>(ProjectActions.BASE)) ?? [];
      this.projectStore.setProjects(projects);
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
        await this.getAllProjects();
      }
      return createdProject ?? ({} as Project);
    } catch (e) {
      console.error(e);
      return {} as Project;
    }
  }

  async updateProject(projectId:string, updateProjectDto: UpdateProjectDto) {
    try {
      const updatedProject = await firstValueFrom(this.httpClient.put<Project>(ProjectActions.UPDATE + projectId, updateProjectDto));
      await this.getAllProjects();
      return updatedProject ?? ({} as Project);
    } catch (e) {
      console.error(e);
      return {} as Project;
    }
  }

  async deleteProject(id: string) {
    try {
      await firstValueFrom(this.httpClient.delete<Project>(`${ProjectActions.BASE}/${id}`));
      await this.getAllProjects();
    } catch (e) {
      console.error(e);
    }
  }
}
