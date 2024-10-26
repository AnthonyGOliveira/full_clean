import { LogErrorRepositoryDecorator } from "../../infra/decorators/log-error-repository";
import { LoggerAdapter } from "../../utils/logger-adapter";

export default () => {
  const logger = new LoggerAdapter();
  return new LogErrorRepositoryDecorator(logger);
};
