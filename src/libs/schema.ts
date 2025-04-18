// Utility to infer the type from a schema
export type InferSchema<T> = T extends { parse(value: unknown): infer U }
  ? U
  : never;

// String schema
class StringSchema {
  private requiredFlag = false;
  private minLengthValue?: number;
  private maxLengthValue?: number;

  required() {
    this.requiredFlag = true;
    return this;
  }
  min(length: number) {
    this.minLengthValue = length;
    return this;
  }
  max(length: number) {
    this.maxLengthValue = length;
    return this;
  }
  parse(value: unknown): string {
    if (value === undefined || value === null) {
      if (this.requiredFlag) throw new Error("Required string missing");
      return "";
    }
    if (typeof value !== "string") throw new Error("Not a string");
    if (this.minLengthValue !== undefined && value.length < this.minLengthValue)
      throw new Error(
        `String is shorter than min length ${this.minLengthValue}`
      );
    if (this.maxLengthValue !== undefined && value.length > this.maxLengthValue)
      throw new Error(
        `String is longer than max length ${this.maxLengthValue}`
      );
    return value;
  }
}

// Number schema
class NumberSchema {
  private requiredFlag = false;
  private minValue?: number;
  private maxValue?: number;

  required() {
    this.requiredFlag = true;
    return this;
  }
  min(value: number) {
    this.minValue = value;
    return this;
  }
  max(value: number) {
    this.maxValue = value;
    return this;
  }
  parse(value: unknown): number {
    if (value === undefined || value === null) {
      if (this.requiredFlag) throw new Error("Required number missing");
      return 0;
    }
    if (typeof value !== "number") throw new Error("Not a number");
    if (this.minValue !== undefined && value < this.minValue)
      throw new Error(`Number is less than min ${this.minValue}`);
    if (this.maxValue !== undefined && value > this.maxValue)
      throw new Error(`Number is greater than max ${this.maxValue}`);
    return value;
  }
}

// Boolean schema
class BooleanSchema {
  private requiredFlag = false;
  required() {
    this.requiredFlag = true;
    return this;
  }
  parse(value: unknown): boolean {
    if (value === undefined || value === null) {
      if (this.requiredFlag) throw new Error("Required boolean missing");
      return false;
    }
    if (typeof value !== "boolean") throw new Error("Not a boolean");
    return value;
  }
}

// Array schema with generics
class ArraySchema<TSchema> {
  private itemSchema: TSchema;
  private requiredFlag = false;
  constructor(itemSchema: TSchema) {
    this.itemSchema = itemSchema;
  }
  required() {
    this.requiredFlag = true;
    return this;
  }
  parse(value: unknown): InferSchema<TSchema>[] {
    if (value === undefined || value === null) {
      if (this.requiredFlag) throw new Error("Required array missing");
      return [];
    }
    if (!Array.isArray(value)) throw new Error("Not an array");
    const arr: InferSchema<TSchema>[] = [];
    for (let i = 0; i < value.length; i++) {
      // @ts-expect-error: parse exists on all schema types
      arr.push(this.itemSchema.parse(value[i]));
    }
    return arr;
  }
}

// Object schema with generics
type SchemaShape = {
  [key: string]:
    | StringSchema
    | NumberSchema
    | BooleanSchema
    | ObjectSchema<any>
    | ArraySchema<any>;
};

type InferObject<T extends SchemaShape> = {
  [K in keyof T]: InferSchema<T[K]>;
};

class ObjectSchema<T extends SchemaShape> {
  private shape: T;
  private requiredFlag = false;
  constructor(shape: T) {
    this.shape = shape;
  }
  required() {
    this.requiredFlag = true;
    return this;
  }
  parse(value: unknown): InferObject<T> {
    if (value === undefined || value === null) {
      if (this.requiredFlag) throw new Error("Required object missing");
      return {} as InferObject<T>;
    }
    if (typeof value !== "object" || value === null)
      throw new Error("Not an object");
    const result: any = {};
    for (const key in this.shape) {
      const fieldSchema = this.shape[key];
      result[key] = fieldSchema.parse((value as any)[key]);
    }
    return result as InferObject<T>;
  }
}

export const schema = {
  string: () => new StringSchema(),
  number: () => new NumberSchema(),
  boolean: () => new BooleanSchema(),
  array: <TSchema>(itemSchema: TSchema) => new ArraySchema<TSchema>(itemSchema),
  object: <T extends SchemaShape>(shape: T) => new ObjectSchema<T>(shape),
};
