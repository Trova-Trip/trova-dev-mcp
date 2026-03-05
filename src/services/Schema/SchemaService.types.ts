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
