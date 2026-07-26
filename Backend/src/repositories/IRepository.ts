export interface ContentIdentifier {
  level: string;   // e.g., 'a1', 'a2', or 'data' for global files
  section: string; // e.g., 'grammar', 'vocabulary'
}

export interface IContentRepository {
  readContent(id: ContentIdentifier): Promise<any>;
  writeContent(id: ContentIdentifier, data: any): Promise<boolean>;
  backupContent(id: ContentIdentifier): Promise<boolean>;
}
