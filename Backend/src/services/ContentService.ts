import { IContentRepository, ContentIdentifier } from '../repositories/IRepository';

export class ContentService {
  // Dependency Injection: The service doesn't care if it's JSON or a Database
  private repository: IContentRepository;

  constructor(repository: IContentRepository) {
    this.repository = repository;
  }

  async getContent(level: string, section: string) {
    // Business Logic: Input validation
    const validLevels = ['a1', 'a2', 'b1', 'b2', 'data'];
    if (!validLevels.includes(level)) {
      throw new Error(`Invalid level provided: ${level}`);
    }

    return await this.repository.readContent({ level, section });
  }

  async updateContent(level: string, section: string, data: any) {
    // Business Logic: We could add strict schema validation here before saving
    // e.g. using Zod: ContentSchema.parse(data);

    const success = await this.repository.writeContent({ level, section }, data);
    if (!success) {
      throw new Error('Failed to save content to repository.');
    }
    return { success: true };
  }
}
