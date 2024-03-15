import {Component, EventEmitter, Input, Output} from '@angular/core';
import DocumentResult from "../../models/document-result";

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
})
export class NoteCardComponent {
  @Input() document!: DocumentResult;
  @Output() noteClickedEmitter: EventEmitter<DocumentResult> = new EventEmitter<DocumentResult>();

  constructor() {
  }

  noteClicked() {
    console.log('note clicked: ', this.document);
    this.noteClickedEmitter.emit(this.document);
  }
}
