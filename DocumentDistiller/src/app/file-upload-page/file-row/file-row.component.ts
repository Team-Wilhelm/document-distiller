import { Component } from '@angular/core';

@Component({
  selector: 'app-file-row',
  standalone: true,
  imports: [],
  templateUrl: './file-row.component.html',
})
export class FileRowComponent {

  constructor() {
  }

  deleteFile(event: Event) {
    console.log('delete file');
  }
}
