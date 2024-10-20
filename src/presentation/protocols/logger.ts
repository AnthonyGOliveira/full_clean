export interface Logger {
  info(message: string, meta: any): void;
  error(error: Error, meta?: any): void;
  warning(message: string, meta: any): void;
  debug(message: string, meta: any): void;
}
