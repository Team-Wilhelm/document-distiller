import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionType, FrontendConstants} from "./constants/FrontendConstants";
import DocumentResult from "../models/document-result";
import {DocumentResultService} from "../services/document-result.service";
import {Subscription} from "rxjs";
import {DocumentResultStore} from "../stores/document-result.store";
import {ProjectService} from "../services/project.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  fileUploadDialogHidden = true;
  fileUploadDialogActionType: ActionType | undefined;

  latestNotes: DocumentResult[] = [];
  latestNotesSubscription: Subscription | undefined;

  constructor(public documentResultStore: DocumentResultStore, private documentResultService: DocumentResultService) {
    documentResultService.getRecentDocuments();
  }

  ngOnInit(): void {
    this.latestNotesSubscription = this.documentResultStore
      .getLatestNotesObservable()
      .subscribe((notes: DocumentResult[]) => {
        this.latestNotes = notes;
    });
  }

  ngOnDestroy(): void {
    this.latestNotesSubscription?.unsubscribe();
  }

  handleFileUploadDialogOpen(actionType: ActionType) {
    this.fileUploadDialogActionType = actionType;
    this.fileUploadDialogHidden = false;
  }

  handleFileUploadDialogClosed(message: string) {
    if (message === FrontendConstants.FileSaved) {
      this.documentResultService.getRecentDocuments();
    }
    this.fileUploadDialogHidden = true;
  }
}
