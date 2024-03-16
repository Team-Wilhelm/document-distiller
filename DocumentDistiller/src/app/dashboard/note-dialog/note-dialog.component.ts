import {Component} from '@angular/core';
import {DocumentResultStore} from "../../stores/document-result.store";
import {DocumentResult, UpdateDocumentResultDto} from "../../models/document-result";
import {DialogStore} from "../../stores/dialog.store";
import DummyData from "../../dummy-data/dummy-data";
import {CRUD} from "../constants/FrontendConstants";
import {DocumentResultService} from "../../services/document-result.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
})
export class NoteDialogComponent {
  protected readonly CRUD = CRUD; // used in the HTML template

  documentResult: DocumentResult | null = null;
  crudType: CRUD | null = null;

  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    content: new FormControl('', [Validators.required])
  });

  constructor(protected documentResultStore: DocumentResultStore,
              protected dialogStore: DialogStore,
              private documentResultService: DocumentResultService) {
    this.documentResult = documentResultStore.getSelectedDocumentResult();
    this.crudType = CRUD.Read

    this.formGroup.setValue({
      title: this.documentResult!.title as string,
      content: this.documentResult!.result as string
    });
  }

  closeDialog(message: string = '') {
    this.documentResultStore.setSelectedDocumentResult(null);
    this.dialogStore.closeNoteDialog();
  }

  async saveNote() {
    if (!this.documentResult || this.formGroup.invalid) return;

    const updateDocumentResultDto = this.formGroup.value as UpdateDocumentResultDto;

    await this.documentResultService.editDocument(this.documentResult.id, updateDocumentResultDto);
    this.dialogStore.closeNoteDialog();
    this.documentResultStore.setSelectedDocumentResult(null);
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

  getSentencesToDisplay() {
    return this.documentResult?.result?.split('\n');
  }
}
