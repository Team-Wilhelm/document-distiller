import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import DocumentResult from "../models/document-result";

@Injectable({
  providedIn: 'root'
})
export class DocumentResultStore {
  latestNotes: BehaviorSubject<DocumentResult[]> = new BehaviorSubject<DocumentResult[]>([]);

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
}
