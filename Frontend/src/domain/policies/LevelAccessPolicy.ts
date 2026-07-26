import { CEFRLevel } from '../valueObjects/CEFRLevel';
import { VALID_CEFR_LEVELS, getLevelsAscending } from '../../levels/cefr';

export class LevelAccessPolicy {
  static canAccess(targetLevel: CEFRLevel, completedLevels: CEFRLevel[]): boolean {
    if (targetLevel.getValue() === 'A1') return true;
    const highestCompleted = completedLevels.reduce(
      (max, l) => l.getOrder() > max.getOrder() ? l : max,
      CEFRLevel.fromString('A1'),
    );
    return targetLevel.getOrder() <= highestCompleted.getOrder() + 1;
  }

  static getPrerequisite(level: CEFRLevel): CEFRLevel | null {
    const order = level.getOrder();
    if (order <= 1) return null;
    const levels = getLevelsAscending();
    return CEFRLevel.fromString(levels[order - 2]);
  }

  static getNextLevel(level: CEFRLevel): CEFRLevel | null {
    const order = level.getOrder();
    const levels = getLevelsAscending();
    if (order >= levels.length) return null;
    return CEFRLevel.fromString(levels[order]);
  }
}
