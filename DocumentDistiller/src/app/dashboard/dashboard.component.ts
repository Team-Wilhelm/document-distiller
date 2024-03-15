import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionType, DialogType, FrontendConstants} from "./constants/FrontendConstants";
import {DocumentResultService} from "../services/document-result.service";
import {Subscription} from "rxjs";
import {DialogStore} from "../stores/dialog.store";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  protected dialogType: DialogType | null = DialogType.Document; // TODO: revert to null

  private dialogTypeSubscription: Subscription | undefined;

  constructor(private documentResultService: DocumentResultService,
              protected dialogStore: DialogStore) {

  }

  ngOnInit(): void {
    this.dialogTypeSubscription = this.dialogStore.getDialogTypeOpenAsObservable()
      .subscribe((dialogType: DialogType | null) => {
        this.dialogType = dialogType; // the switch statement in the HTML template will handle the rest
      });
  }

  ngOnDestroy() {
    this.dialogTypeSubscription?.unsubscribe();
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

  protected readonly DialogType = DialogType;
}
