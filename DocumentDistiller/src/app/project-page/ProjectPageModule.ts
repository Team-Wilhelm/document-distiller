import {NgModule} from "@angular/core";
import {ProjectPageComponent} from "./project-page.component";
import {DatePipe} from "@angular/common";

@NgModule({
  declarations: [ProjectPageComponent],
  imports: [
    DatePipe
  ],
  exports: [ProjectPageComponent]
})
export class ProjectPageModule {
}
