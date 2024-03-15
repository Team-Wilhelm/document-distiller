import {Component} from '@angular/core';
import {CRUD} from "../constants/FrontendConstants";
import {DialogStore} from "../../stores/dialog.store";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CreateProjectDto, Project, UpdateProjectDto} from "../../models/project";
import {ProjectStore} from "../../stores/project.store";
import {ProjectService} from "../../services/project.service";
import DummyData from "../../dummy-data/dummy-data";

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
})
export class ProjectDialogComponent {
  protected readonly CRUD = CRUD;

  crudType: CRUD;
  project: Project | null;
  formGroup = new FormGroup({
    name: new FormControl('',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
    ),
    description: new FormControl('', Validators.maxLength(200)),
  });

  constructor(protected dialogStore: DialogStore,
              private projectStore: ProjectStore,
              private projectService: ProjectService) {
    this.crudType = dialogStore.getCRUDType()!;
    this.project = projectStore.getSelectedProject();
  }

  closeDialog() {
    this.dialogStore.closeProjectDialog();
  }

  async saveProject() {
    if (this.formGroup.invalid) {
      return;
    }

    if (this.crudType === CRUD.Create) {
      await this.projectService.createProject(this.formGroup.value as CreateProjectDto);
    } else {
      const updateProjectDto = {
        id: this.project?.id,
        ...this.formGroup.value,
        documents: this.project?.documents,
      } as UpdateProjectDto;
      await this.projectService.updateProject(this.project!.id, updateProjectDto);
    }
    this.dialogStore.closeProjectDialog();
    this.projectStore.setSelectedProject(null);
  }

  editClicked() {
    this.crudType = CRUD.Update;
    this.formGroup.setValue({
      name: this.project!.name,
      description: this.project!.description,
    });
  }

  async deleteClicked() {
    await this.projectService.deleteProject(this.project!.id);
    this.dialogStore.closeProjectDialog();
    this.projectStore.setSelectedProject(null);
  }
}
