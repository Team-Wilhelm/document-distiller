import { Injectable } from '@angular/core';
import {DocumentResultStore} from "../stores/document-result.store";
import {firstValueFrom} from "rxjs";
import DocumentResult from "../models/document-result";
import {DocumentActions} from "../dashboard/constants/ServerUrls";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DocumentResultService {

  constructor(private httpClient: HttpClient, private documentResultStore: DocumentResultStore) { }

  async getRecentDocuments() {
    const documents = await firstValueFrom(this.httpClient.get<DocumentResult[]>(DocumentActions.RECENT)) ?? [];
    this.documentResultStore.setLatestNotes(documents);
  }
}
