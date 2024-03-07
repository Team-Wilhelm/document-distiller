import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileUploadPageComponent } from './file-upload-page/file-upload-page.component';
import {FileUploadDialogComponent} from "./file-upload-page/file-upload-dialog/file-upload-dialog";

@NgModule({
  declarations: [
    AppComponent,
    FileUploadPageComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FileUploadDialogComponent
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
