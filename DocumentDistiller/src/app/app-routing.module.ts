import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthPageComponent} from "./auth-page/auth-page.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {signInGuard} from "./guards/sign-in-guard";
import {authGuard} from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "auth",
    component: AuthPageComponent,
    canActivate: [signInGuard]
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
