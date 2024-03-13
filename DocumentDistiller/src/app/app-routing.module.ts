import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthPageComponent} from "./auth-page/auth-page.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ProjectPageComponent} from "./project-page/project-page.component";

const routes: Routes = [
  {
    path: "auth",
    component: AuthPageComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "project-page/:id",
    component: ProjectPageComponent
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
