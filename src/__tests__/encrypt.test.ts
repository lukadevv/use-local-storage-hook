import { encryptString, decryptString } from "../libs/encrypt";

describe("Encryption and Decryption", () => {
  const phrase = "my-secret-phrase";
  const originalValue = "Hello, World!";

  test("encryptString should encrypt the value", () => {
    const encryptedValue = encryptString(phrase, originalValue);
    expect(encryptedValue).not.toBe(originalValue);
    expect(typeof encryptedValue).toBe("string");
  });

  test("decryptString should decrypt the value back to the original", () => {
    const encryptedValue = encryptString(phrase, originalValue);
    const decryptedValue = decryptString(phrase, encryptedValue);
    expect(decryptedValue).toBe(originalValue);
  });

  test("decryptString should fail with a different phrase", () => {
    const encryptedValue = encryptString(phrase, originalValue);
    const wrongPhrase = "wrong-phrase";
    const decryptedValue = decryptString(wrongPhrase, encryptedValue);
    expect(decryptedValue).not.toBe(originalValue);
  });

  test("encryptString and decryptString should handle empty strings", () => {
    const emptyValue = "";
    const encryptedValue = encryptString(phrase, emptyValue);
    const decryptedValue = decryptString(phrase, encryptedValue);
    expect(decryptedValue).toBe(emptyValue);
  });
});
