import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileStore {
  fileToUpload: BehaviorSubject<File | null> = new BehaviorSubject<File | null>(null);
  result: BehaviorSubject<string> = new BehaviorSubject<string>('');
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

  setResult(result: string) {
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
