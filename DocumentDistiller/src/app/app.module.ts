import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TopBarComponent} from "./top-bar/top-bar.component";
import {ServiceModule} from "./services/service.module";
import {AuthModule} from "./auth-page/auth.module";
import {DialogModule} from "./dialog/dialog.module";
import {FileUploadModule} from "./file-upload-page/file-upload.module";
import {DashboardModule} from "./dashboard/dashboard-module";
import {ProjectPageModule} from "./project-page/ProjectPageModule";

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceModule,
    AuthModule,
    DialogModule,
    FileUploadModule,
    DashboardModule,
    ProjectPageModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
