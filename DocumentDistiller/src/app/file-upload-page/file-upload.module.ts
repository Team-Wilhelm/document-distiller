import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {FileUploadDialogComponent} from "./file-upload-dialog/file-upload-dialog";
import {FileRowComponent} from "./file-row/file-row.component";
import {DialogModule} from "../dialog/dialog.module";
import {Select2Module} from "ng-select2-component";

@NgModule({
  declarations: [
    FileUploadDialogComponent,
    FileRowComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    Select2Module
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadDialogComponent,
      multi: true
    }
  ],
  exports: [
    FileUploadDialogComponent,
    FileRowComponent
  ]
})
export class FileUploadModule {
}
