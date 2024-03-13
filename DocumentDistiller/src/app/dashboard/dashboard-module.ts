import {DashboardComponent} from "./dashboard.component";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {AddMoreNotesComponent} from "./add-more-notes/add-more-notes.component";
import {MyProjectsComponent} from "./my-projects/my-projects.component";
import {ProjectCardComponent} from "./project-card/project-card.component";
import {NoteCardComponent} from "./note-card/note-card.component";
import {FileUploadModule} from "../file-upload-page/file-upload.module";
import {MenuItemComponent} from "./menu-item/menu-item.component";
import {TruncatePipe} from "./project-card/truncate-pipe";
import {RouterLink} from "@angular/router";

@NgModule({
  declarations: [
    DashboardComponent,
    AddMoreNotesComponent,
    MyProjectsComponent,
    ProjectCardComponent,
    NoteCardComponent,
    MenuItemComponent,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    RouterLink
  ],
  exports: [
    DashboardComponent,
    MenuItemComponent,
    TruncatePipe
  ]
})
export class DashboardModule { }
