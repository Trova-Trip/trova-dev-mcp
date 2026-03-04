import { singleton } from "tsyringe";
import type { DatabaseConfig } from "../types";

@singleton()
export class ConfigService {
  getDatabaseConfig(): DatabaseConfig {
    const dbUri = process.env.DATABASE_URI;
    const dbUsername = process.env.DATABASE_USERNAME;
    const dbPassword = process.env.DATABASE_PASSWORD;

    if (!dbUri || !dbUsername || !dbPassword) {
      throw new Error(
        "Missing required environment variables: DATABASE_URI, DATABASE_USERNAME, DATABASE_PASSWORD",
      );
    }

    return { dbUri, dbUsername, dbPassword };
  }
}
