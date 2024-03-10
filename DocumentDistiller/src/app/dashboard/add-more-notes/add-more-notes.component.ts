import {Component, EventEmitter, Output} from '@angular/core';
import {ActionType} from "../constants/FrontendConstants";

@Component({
  selector: 'app-add-more-notes',
  templateUrl: './add-more-notes.component.html',
})
export class AddMoreNotesComponent {
  @Output() fileUploadDialogOpenedEmitter = new EventEmitter<ActionType>();
  addMoreSize = 24;

  onClickSummarise() {
    this.openFileUploadDialog(ActionType.Summarise);
  }

  onClickKeyPoints() {
    this.openFileUploadDialog(ActionType.KeyPoints);
  }

  onClickTranslate() {
    this.openFileUploadDialog(ActionType.Translate);
  }

  openFileUploadDialog(actionType: ActionType) {
    this.fileUploadDialogOpenedEmitter.emit(actionType);
  }

  protected readonly ActionType = ActionType;
}
