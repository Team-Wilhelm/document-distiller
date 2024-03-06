import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthPageComponent} from "./auth-page/auth-page.component";
import {FileUploadPageComponent} from "./file-upload-page/file-upload-page.component";

const routes: Routes = [
  {
    path: "auth",
    component: AuthPageComponent
  },
  {
    path: "file-upload",
    component: FileUploadPageComponent
  },
  {
    path: "",
    redirectTo: "/auth",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
