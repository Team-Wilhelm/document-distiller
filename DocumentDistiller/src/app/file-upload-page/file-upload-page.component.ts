import { Component } from '@angular/core';

@Component({
  selector: 'app-file-upload-page',
  templateUrl: './file-upload-page.component.html',
})
export class FileUploadPageComponent {
  fileToUpload: File | null = null;
  fileUploadDialogHidden = false;

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
}
