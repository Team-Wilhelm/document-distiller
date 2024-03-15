import {Injectable} from "@angular/core";
import {ActionType, CRUD, DialogType} from "../dashboard/constants/FrontendConstants";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class DialogStore {
  dialogTypeOpen: BehaviorSubject<DialogType | null> = new BehaviorSubject<DialogType | null>(null);
  fileUploadDialogActionType: BehaviorSubject<ActionType | null> = new BehaviorSubject<ActionType | null>(null);
  crudType: BehaviorSubject<CRUD | null> = new BehaviorSubject<CRUD | null>(null);

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

  openNoteDialog(CRUDType: CRUD) {
    this.crudType.next(CRUDType);
    this.dialogTypeOpen.next(DialogType.Document);
  }

  closeNoteDialog() {
    this.dialogTypeOpen.next(null);
    this.crudType.next(null);
  }

  getCRUDTypeAsObservable() {
    return this.crudType.asObservable();
  }

  getCRUDType() {
    return this.crudType.getValue();
  }
}
