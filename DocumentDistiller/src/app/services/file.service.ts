import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DocumentActions} from "../dashboard/constants/ServerUrls";
import {firstValueFrom} from "rxjs";

@Injectable()
export class FileService {

  constructor(private httpClient: HttpClient) {

  }

  async summariseDocument(file: File): Promise<string> {
    return await this.sendRequestWithFormData(file, DocumentActions.SUMMARISE);
  }

  async getKeySentences(file: File): Promise<string> {
    return await this.sendRequestWithFormData(file, DocumentActions.KEY_SENTENCES);
  }

  async getKeyPoints(file: File): Promise<string> {
    return await this.sendRequestWithFormData(file, DocumentActions.KEY_POINTS);
  }

  async translateDocument(file: File): Promise<string> {
    return await this.sendRequestWithFormData(file, DocumentActions.TRANSLATE);
  }

  private async sendRequestWithFormData(file: File, url: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const respone = await firstValueFrom(this.httpClient.post(url, formData));
    return respone as string;
  }
}
