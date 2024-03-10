import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DocumentActions} from "../dashboard/constants/ServerUrls";
import {firstValueFrom} from "rxjs";
import {FileStore} from "../stores/file.store";

@Injectable()
export class FileService {

  constructor(private httpClient: HttpClient, private fileStore: FileStore) {}

  async summariseDocument(): Promise<string> {
    return await this.sendRequestWithFormData(DocumentActions.SUMMARISE);
  }

  async getKeySentences(): Promise<string> {
    return await this.sendRequestWithFormData(DocumentActions.KEY_SENTENCES);
  }

  async getKeyPoints(): Promise<string> {
    return await this.sendRequestWithFormData(DocumentActions.KEY_POINTS);
  }

  async translateDocument(): Promise<string> {
    return await this.sendRequestWithFormData(DocumentActions.TRANSLATE);
  }

  private async sendRequestWithFormData(url: string): Promise<string> {
    const file = (await firstValueFrom(this.fileStore.getFileToUpload()))!;
    const formData = new FormData();
    formData.append('file', file);
    const response = await firstValueFrom(this.httpClient.post(url, formData));
    return response as string;
  }
}
