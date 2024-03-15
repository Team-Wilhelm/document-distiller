import {Component} from '@angular/core';
import {DocumentResultStore} from "../../stores/document-result.store";
import DocumentResult from "../../models/document-result";
import {DialogStore} from "../../stores/dialog.store";
import DummyData from "../../dummy-data/dummy-data";
import {CRUD} from "../constants/FrontendConstants";
import {DocumentResultService} from "../../services/document-result.service";

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
})
export class NoteDialogComponent {
  documentResult: DocumentResult | null = null;
  crudType: CRUD | null = null;

  constructor(protected documentResultStore: DocumentResultStore,
              protected dialogStore: DialogStore,
              private documentResultService: DocumentResultService) {
    this.documentResult = documentResultStore.getSelectedDocumentResult();
    this.documentResult = DummyData.getDocumentResult(); //TODO: remove
    this.crudType = CRUD.Read
  }

  closeDialog(message: string = '') {
    this.documentResultStore.setSelectedDocumentResult(null);
    this.dialogStore.closeNoteDialog();
  }

  saveNote() {

  }

  protected readonly DummyData = DummyData;

  editClicked() {
    this.crudType = CRUD.Update;
  }

  async deleteClicked() {
    if (!document) return;

    this.crudType = CRUD.Delete;
    await this.documentResultService.deleteDocument(this.documentResult!.id);
    this.dialogStore.closeNoteDialog();
    this.documentResultStore.setSelectedDocumentResult(null);
  }
}
