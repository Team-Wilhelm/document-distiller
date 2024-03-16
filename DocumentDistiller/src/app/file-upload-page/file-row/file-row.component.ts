import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-file-row',
  templateUrl: './file-row.component.html',
})
export class FileRowComponent {
  @Input() file: File | null = null;
  @Input() isReadOnly: boolean = false;
  @Output() deleteFileEmitter = new EventEmitter<void>();

  constructor() {
  }

  deleteFile() {
    this.deleteFileEmitter.emit();
  }

  downloadFile() {
    // TODO: look if this is worth doing for demo purposes
    console.log('downloadFile');
   /* if (this.file) {
      const url = window.URL.createObjectURL(this.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }*/
  }
}
