import {Component} from '@angular/core';
import {ActionType} from "./constants/FrontendConstants";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  fileUploadDialogHidden = true;
  fileUploadDialogActionType: ActionType | undefined;

  constructor() {}

  handleFileUploadDialogOpen(actionType: ActionType) {
    this.fileUploadDialogActionType = actionType;
    this.fileUploadDialogHidden = false;
  }
}
