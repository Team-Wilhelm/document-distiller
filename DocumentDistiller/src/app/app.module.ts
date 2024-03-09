import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FileUploadPageComponent} from './file-upload-page/file-upload-page.component';
import {FileUploadDialogComponent} from "./file-upload-page/file-upload-dialog/file-upload-dialog";
import {TopBarComponent} from "./top-bar/top-bar.component";
import {ServiceModule} from "./services/service.module";
import {AuthModule} from "./auth-page/auth.module";
import {DialogComponent} from "./dialog/dialog.component";
import {DialogModule} from "./dialog/dialog.module";
import {FileUploadModule} from "./file-upload-page/file-upload.module";
import {DashboardModule} from "./dashboard/dashboard-module";

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceModule,
    AuthModule,
    DialogModule,
    FileUploadModule,
    DashboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
