import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionType, DialogType, FrontendConstants} from "./constants/FrontendConstants";
import DocumentResult from "../models/document-result";
import {DocumentResultService} from "../services/document-result.service";
import {Subscription} from "rxjs";
import {DocumentResultStore} from "../stores/document-result.store";
import {ProjectService} from "../services/project.service";
import {DialogStore} from "../stores/dialog.store";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  protected readonly DialogType = DialogType; // for HTML template

  constructor(private documentResultService: DocumentResultService,
              protected dialogStore:DialogStore) {

  }

  // File upload
  handleFileUploadDialogOpen(actionType: ActionType) {
    this.dialogStore.openFileUploadDialog(actionType);
  }

  handleFileUploadDialogClosed(message: string) {
    if (message === FrontendConstants.FileSaved) {
      this.documentResultService.getRecentDocuments();
    }
    this.dialogStore.closeFileUploadDialog();
  }

  // Notes


  // Projects
}
