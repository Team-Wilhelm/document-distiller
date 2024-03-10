import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {FileUploadDialogComponent} from "./file-upload-dialog/file-upload-dialog";
import {FileUploadPageComponent} from "./file-upload-page.component";
import {FileRowComponent} from "./file-row/file-row.component";
import {DialogModule} from "../dialog/dialog.module";

@NgModule({
  declarations: [
    FileUploadDialogComponent,
    FileUploadPageComponent,
    FileRowComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadDialogComponent,
      multi: true
    }
  ],
})
export class FileUploadModule { }
