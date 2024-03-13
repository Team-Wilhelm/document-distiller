import {Component, Input} from '@angular/core';
import DocumentResult from "../../models/document-result";

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
})
export class NoteCardComponent {
  @Input() document!: DocumentResult

}
