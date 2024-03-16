import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {DocumentResult} from "../models/document-result";

@Injectable({
  providedIn: 'root'
})
export class FileStore {
  fileToUpload: BehaviorSubject<File | null> = new BehaviorSubject<File | null>(null);
  noteTitle: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  projectId: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  result: BehaviorSubject<DocumentResult | null> = new BehaviorSubject<DocumentResult | null>(null);
  isWaitingForResponse: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  setFileToUpload(file: File | null) {
    this.fileToUpload.next(file);
  }

  getFileToUploadObservable() {
    return this.fileToUpload.asObservable();
  }

  getFileToUploadValue() {
    return this.fileToUpload.value;
  }

  setResult(result: DocumentResult | null) {
    this.result.next(result);
  }

  getResultObservable() {
    return this.result.asObservable();
  }

  getResultValue() {
    return this.result.value;
  }

  setIsWaitingForResponse(isWaiting: boolean) {
    this.isWaitingForResponse.next(isWaiting);
  }

  getIsWaitingForResponseObservable() {
    return this.isWaitingForResponse.asObservable();
  }

  getIsWaitingForResponseValue() {
    return this.isWaitingForResponse.value;
  }

  resetFileStore() {
    this.setFileToUpload(null);
    this.setResult(null);
    this.setIsWaitingForResponse(false);
    this.setProjectId(null);
  }

  setProjectId(projectId: string | null) {
    this.projectId.next(projectId);
  }

  getProjectIdObservable() {
    return this.projectId.asObservable();
  }

  getProjectId() {
    return this.projectId.value;
  }

  setNoteTitle(noteTitle: string | null) {
    this.noteTitle.next(noteTitle);
  }

  getNoteTitle() {
    return this.noteTitle.value;
  }
}
