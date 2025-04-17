import { encryptString, decryptString } from "../libs/encrypt";

describe("encryptString / decryptString (simple base64 salt)", () => {
  const phrase = "test-phrase";
  const testCases = [
    "",
    "hello",
    "Hello, World!",
    "1234567890",
    "a-Z_0-9+/ special chars!@#",
    "😀 Unicode test 🚀",
    "こんにちは世界🌏",
    "Longer text with multiple words and 1234567890 symbols!",
  ];

  testCases.forEach((original) => {
    it(`should encrypt and decrypt "${original}" correctly`, () => {
      const encrypted = encryptString(phrase, original);
      expect(typeof encrypted).toBe("string");
      // For empty string, encrypted will also be empty
      if (original !== "") {
        expect(encrypted).not.toBe(original);
      }
      // Should only contain base64 characters
      expect(encrypted).toMatch(/^[A-Za-z0-9+/=]*$/);

      const decrypted = decryptString(phrase, encrypted);
      expect(decrypted).toBe(original);
    });
  });

  it("should produce different output for different phrases", () => {
    const text = "Sensitive data";
    const encrypted1 = encryptString("phrase1", text);
    const encrypted2 = encryptString("phrase2", text);
    expect(encrypted1).not.toBe(encrypted2);
    expect(decryptString("phrase1", encrypted1)).toBe(text);
    expect(decryptString("phrase2", encrypted2)).toBe(text);
  });

  it("should return empty string for empty input", () => {
    expect(decryptString(phrase, encryptString(phrase, ""))).toBe("");
  });

  it("should not decrypt with wrong phrase", () => {
    const original = "Secret";
    const encrypted = encryptString(phrase, original);
    const wrongDecrypted = decryptString("wrong-phrase", encrypted);
    expect(wrongDecrypted).toBe("");
  });

  it("should return empty string for invalid base64", () => {
    expect(decryptString(phrase, "not_base64!")).toBe("");
  });
});
