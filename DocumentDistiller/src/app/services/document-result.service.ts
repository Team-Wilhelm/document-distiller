import { Injectable } from '@angular/core';
import {DocumentResultStore} from "../stores/document-result.store";
import {firstValueFrom} from "rxjs";
import {DocumentResult, UpdateDocumentResultDto} from "../models/document-result";
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

  async editDocument(documentId: string, updateDocumentResultDto: UpdateDocumentResultDto) {
    const updatedDocument = await firstValueFrom(this.httpClient.put<DocumentResult>(DocumentActions.EDIT + documentId, updateDocumentResultDto));
    await this.getRecentDocuments();
    return updatedDocument;
  }

  async deleteDocument(documentGuid: string) {
    await firstValueFrom(this.httpClient.delete(DocumentActions.DELETE + documentGuid));
    await this.getRecentDocuments();
  }
}
