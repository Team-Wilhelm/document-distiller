import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DocumentActions} from "../dashboard/constants/ServerUrls";
import {firstValueFrom} from "rxjs";
import {FileStore} from "../stores/file.store";
import {DocumentResult} from "../models/document-result";

@Injectable()
export class FileService {
  constructor(private httpClient: HttpClient, private fileStore: FileStore) {
  }

  async summariseDocument(): Promise<DocumentResult> {
    return await this.sendRequestWithFormData(DocumentActions.SUMMARISE);
  }

  async getKeySentences(): Promise<DocumentResult> {
    return await this.sendRequestWithFormData(DocumentActions.KEY_SENTENCES);
  }

  async translateDocument(targetLanguage: string): Promise<DocumentResult> {
    const queryParamsString = `targetLanguage=${targetLanguage}`;
    return await this.sendRequestWithFormData(DocumentActions.TRANSLATE, queryParamsString);
  }

  async imageToText(): Promise<DocumentResult> {
    return await this.sendRequestWithFormData(DocumentActions.IMAGE_TO_TEXT);
  }

  async saveResult(): Promise<DocumentResult> {
    // TODO: look into saving the file too
    const file = (await firstValueFrom(this.fileStore.getFileToUploadObservable()))!;

    const projectId = this.fileStore.getProjectId()!;
    const result = this.fileStore.getResultValue()!;
    result.projectId = projectId;
    return await firstValueFrom(this.httpClient.post<DocumentResult>(DocumentActions.SAVE_RESULT, result));
  }

  private async sendRequestWithFormData(url: string,  queryParamsString?: string ): Promise<DocumentResult> {
    try {
      this.fileStore.setIsWaitingForResponse(true);

      // FIle
      const file =  this.fileStore.getFileToUploadValue()!;
      const formData = new FormData();
      formData.append('file', file);

      // Query Params
      const noteTitle = this.fileStore.getNoteTitle();
      let params = `?noteTitle=${noteTitle}`;
      if (queryParamsString) {
        params += `&${queryParamsString}`;
      }

      const response = await firstValueFrom(this.httpClient.post<DocumentResult>(url + params, formData));
      this.fileStore.setIsWaitingForResponse(false);
      this.fileStore.setResult(response);
      return response;
    } catch (e) {
      this.fileStore.setIsWaitingForResponse(false);
      console.error(e);
      throw e;
    }
  }
}


