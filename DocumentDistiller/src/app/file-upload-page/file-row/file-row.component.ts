import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-file-row',
  templateUrl: './file-row.component.html',
})
export class FileRowComponent {
  @Input() file: File | null = null;
  @Output() deleteFileEmitter = new EventEmitter<void>();

  constructor() {
  }

  deleteFile() {
    this.deleteFileEmitter.emit();
  }
}
