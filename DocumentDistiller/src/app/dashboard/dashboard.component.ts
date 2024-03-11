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

  async uploadFileToServer() {
    let response;
    switch (this.fileUploadDialogActionType) {
      case ActionType.Summarise:
        response = await this.fileService.summariseDocument();
        console.log(response);
        break;
      case ActionType.KeySentences:
        response = await this.fileService.getKeySentences();
        break;
      case ActionType.KeyPoints:
        response = await this.fileService.getKeyPoints();
        break;
      case ActionType.Translate:
        response = await this.fileService.translateDocument();
        break;
      default:
        console.error('unknown action type');
    }
  }
}
