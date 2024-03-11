export default interface DocumentResult {
  id: string; // guid
  ownerId: string; // guid
  title?: string;
  createdAt?: Date;
  lastModifiedAt?: Date;
  fileName?: string;
  result?: string;
  discriminator: string;
}
