import {Component} from '@angular/core';
import {DocumentResultStore} from "../../stores/document-result.store";
import DocumentResult from "../../models/document-result";
import {DialogStore} from "../../stores/dialog.store";
import DummyData from "../../dummy-data/dummy-data";

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
})
export class NoteDialogComponent {
  documentResult: DocumentResult | null = null;

  constructor(protected documentResultStore: DocumentResultStore,
              protected dialogStore: DialogStore) {
    this.documentResult = documentResultStore.getSelectedDocumentResult();
    this.documentResult = DummyData.getDocumentResult(); //TODO: remove
  }

  closeDialog(message: string = '') {
    this.documentResultStore.setSelectedDocumentResult(null);
    this.dialogStore.closeNoteDialog();
  }

  saveNote() {

  }

  protected readonly DummyData = DummyData;
}
