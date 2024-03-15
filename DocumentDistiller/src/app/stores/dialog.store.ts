import {Injectable} from "@angular/core";
import {ActionType, DialogType} from "../dashboard/constants/FrontendConstants";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class DialogStore {
  dialogTypeOpen: BehaviorSubject<DialogType | null> = new BehaviorSubject<DialogType | null>(null);
  fileUploadDialogActionType: BehaviorSubject<ActionType | null> = new BehaviorSubject<ActionType | null>(null);

  /**
   * Opens the file upload dialog and sets the action type for the file upload dialog
   * @param actionType
   */
  openFileUploadDialog(actionType: ActionType) {
    this.fileUploadDialogActionType.next(actionType);
    this.dialogTypeOpen.next(DialogType.FileUpload);
  }

  closeFileUploadDialog() {
    this.dialogTypeOpen.next(null);
    this.fileUploadDialogActionType.next(null);
  }

  getDialogTypeOpenAsObservable() {
    return this.dialogTypeOpen.asObservable();
  }

  getFileUploadDialogActionTypeAsObservable() {
    return this.fileUploadDialogActionType.asObservable();
  }

  getDialogTypeOpen() {
    return this.dialogTypeOpen.getValue();
  }

  getFileUploadDialogActionType() {
    return this.fileUploadDialogActionType.getValue();
  }
}
