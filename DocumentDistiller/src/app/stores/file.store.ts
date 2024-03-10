import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import DocumentResult from "../models/document-result";

@Injectable({
  providedIn: 'root'
})
export class FileStore {
  fileToUpload: BehaviorSubject<File | null> = new BehaviorSubject<File | null>(null);
  result: BehaviorSubject<DocumentResult | null> = new BehaviorSubject<DocumentResult | null>(null);
  isWaitingForResponse: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  setFileToUpload(file: File) {
    this.fileToUpload.next(file);
  }

  getFileToUploadObservable() {
    return this.fileToUpload.asObservable();
  }

  getFileToUploadValue() {
    return this.fileToUpload.value;
  }

  setResult(result: DocumentResult) {
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
}
