import {NgModule} from "@angular/core";
import {CommonModule, NgStyle} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {DialogComponent} from "./dialog.component";

@NgModule({
  declarations: [
    DialogComponent
  ],
  exports: [
    DialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgStyle
  ]
})
export class DialogModule { }
