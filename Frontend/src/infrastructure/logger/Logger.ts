/**
 * @file Logger.ts
 * Singleton logger with severity levels.
 * In production only WARN and ERROR are emitted.
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LEVEL_ORDER: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class LoggerService {
  private static instance: LoggerService | null = null;
  private minLevel: LogLevel;

  private constructor() {
    this.minLevel = process.env.NODE_ENV === 'production' ? 'WARN' : 'DEBUG';
  }

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_ORDER[level] >= LEVEL_ORDER[this.minLevel];
  }

  private format(level: LogLevel, context: string, message: string): string {
    const ts = new Date().toISOString();
    return `[${ts}] [${level}] [${context}] ${message}`;
  }

  debug(context: string, message: string, data?: unknown): void {
    if (!this.shouldLog('DEBUG')) return;
    console.debug(this.format('DEBUG', context, message), data ?? '');
  }

  info(context: string, message: string, data?: unknown): void {
    if (!this.shouldLog('INFO')) return;
    console.info(this.format('INFO', context, message), data ?? '');
  }

  warn(context: string, message: string, data?: unknown): void {
    if (!this.shouldLog('WARN')) return;
    console.warn(this.format('WARN', context, message), data ?? '');
  }

  error(context: string, message: string, error?: unknown): void {
    if (!this.shouldLog('ERROR')) return;
    console.error(this.format('ERROR', context, message), error ?? '');
  }

  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
}

export const Logger = LoggerService.getInstance();
