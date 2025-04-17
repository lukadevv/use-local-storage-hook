/**
 * Encrypts a string using a simple XOR cipher.
 *
 * @param phrase The phrase used for encryption.
 * @param value The string to be encrypted.
 * @returns The encrypted string.
 */
export function encryptString(phrase: string, value: string) {
  const key = phrase
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let encrypted = "";

  for (let i = 0; i < value.length; i++) {
    encrypted += String.fromCharCode(value.charCodeAt(i) ^ key);
  }
  return encrypted;
}

/**
 * Decrypts a string using a simple XOR cipher.
 *
 * @param phrase The phrase used for encryption/decryption.
 * @param value The encrypted string to be decrypted.
 * @returns The decrypted string.
 */
export function decryptString(phrase: string, value: string) {
  const key = phrase
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let decrypted = "";

  for (let i = 0; i < value.length; i++) {
    decrypted += String.fromCharCode(value.charCodeAt(i) ^ key);
  }
  return decrypted;
}
