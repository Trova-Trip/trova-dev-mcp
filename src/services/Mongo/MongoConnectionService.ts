import mongoose, { Model } from "mongoose";
import { inject, singleton } from "tsyringe";
import {
  connectionClient,
  loadServiceModules,
} from "@trova-trip/trova-services";
import { ConfigService } from "../Config";
import type { DatabaseConfig } from "../Config/ConfigService.types";

@singleton()
export class MongoConnectionService {
  private mongooseConnection?: typeof mongoose;

  constructor(@inject(ConfigService) private configService: ConfigService) {
    loadServiceModules();
  }

  async connect(): Promise<void> {
    if (this.mongooseConnection?.connection.readyState === 1) {
      return;
    }

    const config = this.configService.getDatabaseConfig();
    const url = this.buildUrl(config);

    this.mongooseConnection = await connectionClient.mongoDB.connect({ url });
  }

  async disconnect(): Promise<void> {
    if (!this.mongooseConnection) {
      return;
    }
    await this.mongooseConnection.disconnect();
  }

  getModel(modelName: string): Model<any> {
    if (!this.mongooseConnection) {
      throw new Error(
        "MongoConnectionService not initialized. Call connect() first.",
      );
    }

    try {
      return this.mongooseConnection.model(modelName);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to retrieve model for collection "${modelName}": ${errorMessage}`,
      );
    }
  }

  listModelNames(): string[] {
    if (!this.mongooseConnection) {
      throw new Error(
        "MongoConnectionService not initialized. Call connect() first.",
      );
    }

    return this.mongooseConnection.modelNames();
  }

  private buildUrl(config: DatabaseConfig): string {
    const { dbPassword, dbUri, dbUsername } = config;
    const url = new URL(dbUri);

    url.username = encodeURIComponent(dbUsername);
    url.password = encodeURIComponent(dbPassword);

    return url.toString();
  }
}
