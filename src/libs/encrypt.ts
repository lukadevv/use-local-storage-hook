// Simple reversible "encryption": base64 encode/decode with a salt prefix

const SALT = "uSLS:"; // Unique prefix to identify encoded values

function toBase64(str: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(str, "utf-8").toString("base64");
  } else {
    return btoa(unescape(encodeURIComponent(str)));
  }
}

function fromBase64(str: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(str, "base64").toString("utf-8");
  } else {
    return decodeURIComponent(escape(atob(str)));
  }
}

export function encryptString(phrase: string, value: string) {
  // Just add the phrase as a salt prefix, then base64 encode
  return toBase64(SALT + phrase + ":" + value);
}

export function decryptString(phrase: string, value: string) {
  try {
    const decoded = fromBase64(value);
    // Remove the salt and phrase prefix if present
    const prefix = SALT + phrase + ":";
    if (decoded.startsWith(prefix)) {
      return decoded.slice(prefix.length);
    }
    // If not matching, return as is (or empty string)
    return "";
  } catch {
    return "";
  }
}
