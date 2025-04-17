/**
 * Helper to encode a string to base64 using only a-Z, 0-9, +, /
 */
function toBase64(str: string): string {
  return btoa(
    typeof window === "undefined"
      ? Buffer.from(str, "utf-8").toString("base64")
      : new TextEncoder()
          .encode(str)
          .reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
}

/**
 * Helper to decode a base64 string
 */
function fromBase64(str: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(str, "base64").toString("utf-8");
  }
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Encrypts a string using a simple XOR cipher and encodes the result in base64 (a-Z-0-9+/).
 */
export function encryptString(phrase: string, value: string) {
  const key = phrase
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let encrypted = "";
  for (let i = 0; i < value.length; i++) {
    encrypted += String.fromCharCode(value.charCodeAt(i) ^ key);
  }
  return toBase64(encrypted);
}

/**
 * Decrypts a string using a simple XOR cipher and decodes from base64.
 */
export function decryptString(phrase: string, value: string) {
  const key = phrase
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const encrypted = fromBase64(value);
  let decrypted = "";
  for (let i = 0; i < encrypted.length; i++) {
    decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ key);
  }
  return decrypted;
}
