import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DocumentActions} from "../dashboard/constants/ServerUrls";
import {firstValueFrom} from "rxjs";
import {FileStore} from "../stores/file.store";
import DocumentResult from "../models/document-result";

@Injectable()
export class FileService {

  constructor(private httpClient: HttpClient, private fileStore: FileStore) {}

  async summariseDocument(): Promise<DocumentResult> {
    return await this.sendRequestWithFormData(DocumentActions.SUMMARISE);
  }

  async getKeySentences(): Promise<DocumentResult> {
    return await this.sendRequestWithFormData(DocumentActions.KEY_SENTENCES);
  }

  async getKeyPoints(): Promise<DocumentResult> {
    return await this.sendRequestWithFormData(DocumentActions.KEY_POINTS);
  }

  async translateDocument(): Promise<DocumentResult> {
    return await this.sendRequestWithFormData(DocumentActions.TRANSLATE);
  }

  private async sendRequestWithFormData(url: string): Promise<DocumentResult> {
    try {
      this.fileStore.setIsWaitingForResponse(true);
      const file = (await firstValueFrom(this.fileStore.getFileToUploadObservable()))!;
      const formData = new FormData();
      formData.append('file', file);
      const response = await firstValueFrom(this.httpClient.post<DocumentResult>(url, formData));
      this.fileStore.setIsWaitingForResponse(false);
      this.fileStore.setResult(response);
      return response as DocumentResult;
    } catch (e) {
      this.fileStore.setIsWaitingForResponse(false);
      console.error(e);
      throw e;
    }
  }
}
