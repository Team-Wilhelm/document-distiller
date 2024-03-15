import {Component, Input} from '@angular/core';
import {DocumentResult} from "../../models/document-result";
import {DocumentResultStore} from "../../stores/document-result.store";
import {DialogStore} from "../../stores/dialog.store";
import {CRUD} from "../constants/FrontendConstants";

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
})
export class NoteCardComponent {
  @Input() document!: DocumentResult;

  constructor(private documentResultStore: DocumentResultStore,
              private dialogStore: DialogStore) {
  }

  noteClicked() {
    this.documentResultStore.setSelectedDocumentResult(this.document);
    this.dialogStore.openNoteDialog(CRUD.Read);
  }
}
