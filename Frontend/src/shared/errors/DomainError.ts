/**
 * @file DomainError.ts
 * Base error class hierarchy for the domain layer.
 * All application errors extend from DomainError.
 */

export abstract class DomainError extends Error {
  abstract readonly code: string;
  readonly timestamp: Date;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    // Maintains proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';
  constructor(message: string, public readonly field?: string) {
    super(message);
  }
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';
  constructor(entity: string, id: number | string) {
    super(`${entity} with id "${id}" not found.`);
  }
}

export class InvalidLevelError extends DomainError {
  readonly code = 'INVALID_LEVEL';
  constructor(level: unknown) {
    super(`Invalid CEFR level: "${String(level)}". Must be one of: A1, A2, B1, B2, C1, C2.`);
  }
}

export class SecurityError extends DomainError {
  readonly code = 'SECURITY_ERROR';
  constructor(message: string) {
    super(message);
  }
}
