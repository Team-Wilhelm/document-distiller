import DocumentResult from './document-result';

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  lastModifiedAt: string;
  documents: DocumentResult[];
}

export interface UpdateProjectDto {
  id: string;
  name: string | null;
  description: string | null;
  documents: DocumentResult[] | null;
}

export interface CreateProjectDto {
  name: string;
  description: string;
}
