import {Component, OnDestroy, OnInit} from '@angular/core';
import {DocumentResultStore} from "../../stores/document-result.store";
import {DocumentResultService} from "../../services/document-result.service";
import DocumentResult from "../../models/document-result";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-my-notes',
  templateUrl: './my-notes.component.html',
})
export class MyNotesComponent implements OnInit, OnDestroy {
  latestNotes: DocumentResult[] = [];
  latestNotesSubscription: Subscription | undefined;

  constructor(public documentResultStore: DocumentResultStore,
              private documentResultService: DocumentResultService) {
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

}
