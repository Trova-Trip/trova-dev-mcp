import mongoose from "mongoose";
import { inject, singleton } from "tsyringe";
import { MongoConnectionService } from "../Mongo";
import type { SchemaValue, SerializableSchema } from "./SchemaService.types";

@singleton()
export class SchemaService {
  constructor(
    @inject(MongoConnectionService)
    private mongoConnection: MongoConnectionService,
  ) {}

  getSchema(collectionName: string): SerializableSchema {
    const model = this.mongoConnection.getModel(collectionName);
    return this.toSerializableObject(model.schema.obj);
  }

  listCollections(): string[] {
    return this.mongoConnection.listModelNames();
  }

  private toSerializableObject(
    schemaObj: Record<string, unknown>,
  ): SerializableSchema {
    const result: SerializableSchema = {};

    for (const [key, value] of Object.entries(schemaObj)) {
      result[key] = this.serializeValue(value);
    }

    return result;
  }

  private serializeValue(value: unknown): SchemaValue {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "number") {
      return value;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return [];
      }
      return value.map((v) => this.serializeValue(v));
    }

    if (typeof value === "function") {
      return this.getTypeName(value);
    }

    if (typeof value === "object") {
      return this.serializeObject(value as Record<string, unknown>);
    }

    return String(value);
  }

  private serializeObject(obj: Record<string, unknown>): SchemaValue {
    if (obj instanceof mongoose.Schema) {
      return this.toSerializableObject(obj.obj);
    }

    if (obj.type === mongoose.Schema.Types.ObjectId && obj.ref) {
      return {
        type: "ObjectId",
        ref: String(obj.ref),
      };
    }

    if ("type" in obj) {
      const result: SerializableSchema = {};

      for (const [key, val] of Object.entries(obj)) {
        if (key === "type") {
          result.type = this.getTypeName(val);
        } else if (key === "enum" && Array.isArray(val)) {
          result.enum = val.map(String);
        } else if (typeof val === "function") {
          result[key] = this.getTypeName(val);
        } else if (
          typeof val === "boolean" ||
          typeof val === "string" ||
          typeof val === "number"
        ) {
          result[key] = val;
        } else if (val !== null && val !== undefined) {
          result[key] = this.serializeValue(val);
        }
      }

      return result;
    }

    const result: SerializableSchema = {};
    for (const [key, val] of Object.entries(obj)) {
      result[key] = this.serializeValue(val);
    }
    return result;
  }

  private getTypeName(type: unknown): string {
    if (type === null || type === undefined) {
      return "Unknown";
    }

    if (type === mongoose.Schema.Types.ObjectId) {
      return "ObjectId";
    }

    if (type === mongoose.Schema.Types.Mixed) {
      return "Mixed";
    }

    if (type === mongoose.Schema.Types.Decimal128) {
      return "Decimal128";
    }

    if (type === String) {
      return "String";
    }

    if (type === Number) {
      return "Number";
    }

    if (type === Boolean) {
      return "Boolean";
    }

    if (type === Date) {
      return "Date";
    }

    if (type === Buffer) {
      return "Buffer";
    }

    if (type === Map) {
      return "Map";
    }

    if (Array.isArray(type)) {
      if (type.length === 0) {
        return "Array";
      }
      const innerType = this.getTypeName(type[0]);
      return `Array<${innerType}>`;
    }

    if (typeof type === "function" && type.name) {
      return type.name;
    }

    return "Unknown";
  }
}
