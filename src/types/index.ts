export interface DatabaseConfig {
  dbUri: string;
  dbUsername: string;
  dbPassword: string;
}

export type SchemaValue =
  | string
  | boolean
  | number
  | null
  | SerializableSchema
  | SchemaValue[];

export interface SerializableSchema {
  [key: string]: SchemaValue;
}
