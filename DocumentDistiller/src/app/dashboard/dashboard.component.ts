import {Component} from '@angular/core';
import {ActionType} from "./constants/FrontendConstants";
import {FileService} from "../services/file.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  fileUploadDialogHidden = true;
  fileUploadDialogActionType: ActionType | undefined;

  constructor(private fileService: FileService) {}

  handleFileUploadDialogOpen(actionType: ActionType) {
    this.fileUploadDialogActionType = actionType;
    this.fileUploadDialogHidden = false;
  }
}
