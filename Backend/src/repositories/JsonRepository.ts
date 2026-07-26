import fs from 'fs/promises';
import path from 'path';
import { IContentRepository, ContentIdentifier } from './IRepository';

export class JsonRepository implements IContentRepository {
  private readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  private getFilePath(id: ContentIdentifier): string {
    // If it's a global file like custom-content.json, the level is 'data'
    if (id.level === 'data') {
      return path.join(this.basePath, 'data', `${id.section}.json`);
    }
    return path.join(this.basePath, 'levels', id.level, id.section, 'data.json');
  }

  async readContent(id: ContentIdentifier): Promise<any> {
    try {
      const filePath = this.getFilePath(id);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  async backupContent(id: ContentIdentifier): Promise<boolean> {
    try {
      const filePath = this.getFilePath(id);
      const existing = await fs.readFile(filePath, 'utf8');
      await fs.writeFile(`${filePath}.bak`, existing, 'utf8');
      return true;
    } catch (e) {
      return false; // Backup fails if file doesn't exist, which is fine for new files
    }
  }

  async writeContent(id: ContentIdentifier, data: any): Promise<boolean> {
    try {
      const filePath = this.getFilePath(id);
      await this.backupContent(id); // Create a backup automatically before overwrite
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (e) {
      console.error("JsonRepository write failed:", e);
      return false;
    }
  }
}
