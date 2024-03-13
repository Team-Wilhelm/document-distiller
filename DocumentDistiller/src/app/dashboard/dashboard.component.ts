import {Component, Input} from '@angular/core';
import {ActionType} from "./constants/FrontendConstants";
import {FileService} from "../services/file.service";
import DocumentResult from "../models/document-result";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  fileUploadDialogHidden = true;
  fileUploadDialogActionType: ActionType | undefined;

  constructor(public fileService: FileService) {}

  handleFileUploadDialogOpen(actionType: ActionType) {
    this.fileUploadDialogActionType = actionType;
    this.fileUploadDialogHidden = false;
  }

  getRecentDocuments() {
    this.fileService.getRecentDocuments().then(documents => {
      console.log(documents);
    }).catch(error => console.error(error));
  }
}
