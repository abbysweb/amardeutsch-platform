/**
 * Specification Pattern — reusable filtering rule for CEFR level matching.
 */

import type { BaseEntity } from '../entities/BaseEntity';
import type { CEFRLevel } from '../../levels/cefr';

export interface ISpecification<T> {
  isSatisfiedBy(item: T): boolean;
  and(other: ISpecification<T>): ISpecification<T>;
  or(other: ISpecification<T>): ISpecification<T>;
  not(): ISpecification<T>;
}

abstract class BaseSpecification<T> implements ISpecification<T> {
  abstract isSatisfiedBy(item: T): boolean;

  and(other: ISpecification<T>): ISpecification<T> {
    return new AndSpecification(this, other);
  }

  or(other: ISpecification<T>): ISpecification<T> {
    return new OrSpecification(this, other);
  }

  not(): ISpecification<T> {
    return new NotSpecification(this);
  }
}

class AndSpecification<T> extends BaseSpecification<T> {
  constructor(private left: ISpecification<T>, private right: ISpecification<T>) {
    super();
  }
  isSatisfiedBy(item: T): boolean {
    return this.left.isSatisfiedBy(item) && this.right.isSatisfiedBy(item);
  }
}

class OrSpecification<T> extends BaseSpecification<T> {
  constructor(private left: ISpecification<T>, private right: ISpecification<T>) {
    super();
  }
  isSatisfiedBy(item: T): boolean {
    return this.left.isSatisfiedBy(item) || this.right.isSatisfiedBy(item);
  }
}

class NotSpecification<T> extends BaseSpecification<T> {
  constructor(private wrapped: ISpecification<T>) {
    super();
  }
  isSatisfiedBy(item: T): boolean {
    return !this.wrapped.isSatisfiedBy(item);
  }
}

export class LevelSpecification<T extends BaseEntity> extends BaseSpecification<T> {
  constructor(private level: CEFRLevel) {
    super();
  }

  isSatisfiedBy(item: T): boolean {
    return item.getLevel() === this.level;
  }
}

export class CategorySpecification<T extends BaseEntity> extends BaseSpecification<T> {
  constructor(private category: string) {
    super();
  }

  isSatisfiedBy(item: T): boolean {
    return item.getCategory().toLowerCase() === this.category.toLowerCase();
  }
}

export class SearchTextSpecification<T extends BaseEntity> extends BaseSpecification<T> {
  constructor(private query: string) {
    super();
  }

  isSatisfiedBy(item: T): boolean {
    const q = this.query.toLowerCase();
    const searchable = item as unknown as { getSearchTokens?: () => string[] };
    const tokens = searchable.getSearchTokens?.() ?? [];
    return tokens.some((t: string) => t.includes(q));
  }
}
