import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileStore {
  fileToUpload: BehaviorSubject<File | null> = new BehaviorSubject<File | null>(null);

  constructor() {}

  setFileToUpload(file: File) {
    this.fileToUpload.next(file);
  }

  getFileToUpload() {
    return this.fileToUpload.asObservable();
  }
}
