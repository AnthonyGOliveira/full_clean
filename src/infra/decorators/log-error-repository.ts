import { MongoDatabaseHelper } from "../db/mongodb/helpers/mongodb-helper";

interface ILogError {
  error: Error;
  meta: any;
}

interface Logger {
  info(message: string, meta: any): void;
  error(error: Error, meta?: any): void;
  warning(message: string, meta: any): void;
  debug(message: string, meta: any): void;
}

export class LogErrorRepositoryDecorator implements Logger {
  private readonly logger;
  private readonly collection = "log-error";
  constructor(logger: Logger) {
    this.logger = logger;
  }
  info(message: string, meta: any): void {
    this.logger.info(message, meta);
  }
  async error(error: Error, meta?: any): Promise<void> {
    const collection = await MongoDatabaseHelper.getCollection(this.collection);
    this.logger.error(error, meta);
    const logError: ILogError = {
      error: error,
      meta: meta,
    };
    await collection.insertOne(logError);
  }
  warning(message: string, meta: any): void {
    this.logger.warning(message, meta);
  }
  debug(message: string, meta: any): void {
    this.logger.debug(message, meta);
  }
}
