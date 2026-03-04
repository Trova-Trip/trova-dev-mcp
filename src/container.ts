import "reflect-metadata";
import { container } from "tsyringe";
import { ConfigService, MongoConnectionService, SchemaService } from "./services";

// Register services - tsyringe handles singletons automatically via @singleton decorator
// This file ensures all services are imported and their decorators are processed

export const initializeContainer = (): void => {
  // Force resolution to ensure services are instantiated in correct order
  container.resolve(ConfigService);
  container.resolve(MongoConnectionService);
  container.resolve(SchemaService);
};

export { container };
