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

  async uploadFileToServer(file: File) {
    let response;
    switch (this.fileUploadDialogActionType) {
      case ActionType.Summarise:
        response = await this.fileService.summariseDocument(file);
        break;
      case ActionType.KeySentences:
        response = await this.fileService.getKeySentences(file);
        break;
      case ActionType.KeyPoints:
        response = await this.fileService.getKeyPoints(file);
        break;
      case ActionType.Translate:
        response = await this.fileService.translateDocument(file);
        break;
      default:
        console.error('unknown action type');
    }
  }
}
