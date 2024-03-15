import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {DocumentResult} from "../models/document-result";

@Injectable({
  providedIn: 'root'
})
export class DocumentResultStore {
  latestNotes: BehaviorSubject<DocumentResult[]> = new BehaviorSubject<DocumentResult[]>([]);
  selectedDocumentResult: BehaviorSubject<DocumentResult | null> = new BehaviorSubject<DocumentResult | null>(null);

  constructor() {}

  setLatestNotes(notes: DocumentResult[]) {
    this.latestNotes.next(notes);
  }

  getLatestNotesObservable() {
    return this.latestNotes.asObservable();
  }

  getLatestNotesValue() {
    return this.latestNotes.value;
  }

  setSelectedDocumentResult(note: DocumentResult | null) {
    this.selectedDocumentResult.next(note);
  }

  getSelectedDocumentResultObservable() {
    return this.selectedDocumentResult.asObservable();
  }

  getSelectedDocumentResult() {
    return this.selectedDocumentResult.value;
  }
}
