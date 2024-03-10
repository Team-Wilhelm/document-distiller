import {DashboardComponent} from "./dashboard.component";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {AddMoreNotesComponent} from "./add-more-notes/add-more-notes.component";
import {MyProjectsComponent} from "./my-projects/my-projects.component";
import {ProjectCardComponent} from "./project-card/project-card.component";
import {NoteCardComponent} from "./note-card/note-card.component";
import {FileUploadModule} from "../file-upload-page/file-upload.module";

@NgModule({
  declarations: [
    DashboardComponent,
    AddMoreNotesComponent,
    MyProjectsComponent,
    ProjectCardComponent,
    NoteCardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }