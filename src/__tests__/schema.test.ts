import { schema } from "../libs/schema";

describe("Schema Utility", () => {
  describe("StringSchema", () => {
    it("should parse a valid string", () => {
      const stringSchema = schema.string().required().min(3).max(10);
      expect(stringSchema.parse("hello")).toBe("hello");
    });

    it("should throw an error for a string shorter than the minimum length", () => {
      const stringSchema = schema.string().min(5);
      expect(() => stringSchema.parse("hi")).toThrow(
        "String is shorter than min length 5"
      );
    });

    it("should throw an error for a non-string value", () => {
      const stringSchema = schema.string();
      expect(() => stringSchema.parse(123)).toThrow("Not a string");
    });
  });

  describe("NumberSchema", () => {
    it("should parse a valid number", () => {
      const numberSchema = schema.number().required().min(10).max(100);
      expect(numberSchema.parse(50)).toBe(50);
    });

    it("should throw an error for a number less than the minimum value", () => {
      const numberSchema = schema.number().min(10);
      expect(() => numberSchema.parse(5)).toThrow("Number is less than min 10");
    });

    it("should throw an error for a non-number value", () => {
      const numberSchema = schema.number();
      expect(() => numberSchema.parse("not-a-number")).toThrow("Not a number");
    });
  });

  describe("BooleanSchema", () => {
    it("should parse a valid boolean", () => {
      const booleanSchema = schema.boolean().required();
      expect(booleanSchema.parse(true)).toBe(true);
    });

    it("should throw an error for a non-boolean value", () => {
      const booleanSchema = schema.boolean();
      expect(() => booleanSchema.parse("not-a-boolean")).toThrow(
        "Not a boolean"
      );
    });
  });

  describe("ArraySchema", () => {
    it("should parse a valid array of strings", () => {
      const arraySchema = schema.array(schema.string().min(2));
      expect(arraySchema.parse(["hi", "hello"])).toEqual(["hi", "hello"]);
    });

    it("should throw an error for a non-array value", () => {
      const arraySchema = schema.array(schema.string());
      expect(() => arraySchema.parse("not-an-array")).toThrow("Not an array");
    });

    it("should throw an error for invalid items in the array", () => {
      const arraySchema = schema.array(schema.number().min(10));
      expect(() => arraySchema.parse([5, 15])).toThrow(
        "Number is less than min 10"
      );
    });
  });

  describe("ObjectSchema", () => {
    it("should parse a valid object", () => {
      const objectSchema = schema.object({
        name: schema.string().required(),
        age: schema.number().min(18),
      });
      expect(objectSchema.parse({ name: "John", age: 25 })).toEqual({
        name: "John",
        age: 25,
      });
    });

    it("should throw an error for a missing required field", () => {
      const objectSchema = schema.object({
        name: schema.string().required(),
        age: schema.number(),
      });
      expect(() => objectSchema.parse({ age: 25 })).toThrow(
        "Required string missing"
      );
    });

    it("should throw an error for an invalid field type", () => {
      const objectSchema = schema.object({
        name: schema.string(),
        age: schema.number(),
      });
      expect(() =>
        objectSchema.parse({ name: "John", age: "not-a-number" })
      ).toThrow("Not a number");
    });
  });
});
