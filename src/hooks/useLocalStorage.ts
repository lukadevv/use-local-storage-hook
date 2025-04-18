import { useState, useEffect } from "react";
import { UseLocalStorageType } from "../types/main.types";
import { encryptString, decryptString } from "../libs/encrypt";
import { schema as libSchema } from "../libs/schema";

export const useLocalStorage: UseLocalStorageType = (
  key,
  schemaFn,
  initialValue,
  config = {}
) => {
  const {
    onError,
    restoreOnError = true,
    useBroadcastChannel = true,
    debug,
    encrypt,
    backupOnError,
    onChangeBeforeValidation,
    onChangeAfterValidation,
  } = config;

  // Build the schema instance using the provided schema function and builder
  // (imported as libSchema in main.types.ts)
  const schema = schemaFn(libSchema);

  const log = (...args: any[]) => {
    if (debug) console.log("[useLocalStorage]", ...args);
  };

  const encryptIfNeeded = (value: string, shouldEncrypt?: boolean) => {
    const result =
      shouldEncrypt && encrypt?.phrase
        ? encryptString(encrypt.phrase, value)
        : value;
    log("encryptIfNeeded", { value, shouldEncrypt, result });
    return result;
  };

  const decryptIfNeeded = (value: string, shouldDecrypt?: boolean) => {
    const result =
      shouldDecrypt && encrypt?.phrase
        ? decryptString(encrypt.phrase, value)
        : value;
    log("decryptIfNeeded", { value, shouldDecrypt, result });
    return result;
  };

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const storedKey = encryptIfNeeded(key, encrypt?.key);
      const item = localStorage.getItem(storedKey);
      log("init", { storedKey, item });
      if (item) {
        const decryptedValue = decryptIfNeeded(item, encrypt?.value);
        let parsed: unknown;
        try {
          parsed = JSON.parse(decryptedValue);
        } catch {
          parsed = decryptedValue;
        }
        log("initParsed", { decryptedValue, parsed });
        const validated = schema.parse(parsed);
        log("initValidated", validated);
        return validated;
      }
    } catch (error) {
      log("initError", error);
      if (onError) onError(error);
      if (restoreOnError) {
        try {
          const storedKey = encryptIfNeeded(key, encrypt?.key);
          let serializedValue: string;
          if (typeof initialValue === "string") {
            serializedValue = initialValue as string;
          } else {
            serializedValue = JSON.stringify(initialValue);
          }
          const encryptedValue = encryptIfNeeded(
            serializedValue,
            encrypt?.value
          );
          localStorage.setItem(storedKey, encryptedValue);
          log("restore", { storedKey, serializedValue, encryptedValue });
        } catch (restoreError) {
          log("restoreError", restoreError);
        }
        return initialValue;
      }
    }
    return initialValue;
  });

  const setValue = (valueOrFn: any) => {
    try {
      const valueToStore =
        typeof valueOrFn === "function" ? valueOrFn(storedValue) : valueOrFn;

      if (onChangeBeforeValidation) {
        onChangeBeforeValidation(storedValue, valueToStore);
      }

      const validated = schema.parse(valueToStore);

      if (onChangeAfterValidation) {
        onChangeAfterValidation(storedValue, validated);
      }

      let serializedValue: string;
      if (typeof validated === "string") {
        serializedValue = validated as string;
      } else {
        serializedValue = JSON.stringify(validated);
      }
      const encryptedValue = encryptIfNeeded(serializedValue, encrypt?.value);
      const storedKey = encryptIfNeeded(key, encrypt?.key);

      localStorage.setItem(storedKey, encryptedValue);
      setStoredValue(validated);

      log("setValue", {
        valueToStore,
        validated,
        serializedValue,
        encryptedValue,
        storedKey,
      });

      if (useBroadcastChannel) {
        const channel = new BroadcastChannel(storedKey);
        channel.postMessage(encryptedValue);
        channel.close();
        log("broadcast", { storedKey, encryptedValue });
      }
    } catch (error) {
      console.error("Error setting value in localStorage:", error);
      log("setValueError", error);
      if (onError) onError(error);
      if (backupOnError) {
        const backupKey = `${key}_${new Date().toISOString()}`;
        const encryptedBackupKey = encryptIfNeeded(backupKey, encrypt?.key);
        localStorage.setItem(
          encryptedBackupKey,
          typeof valueOrFn === "string" ? valueOrFn : JSON.stringify(valueOrFn)
        );
        log("backup", { backupKey, encryptedBackupKey, value: valueOrFn });
      }
    }
  };

  useEffect(() => {
    if (useBroadcastChannel) {
      const storedKey = encryptIfNeeded(key, encrypt?.key);
      const channel = new BroadcastChannel(storedKey);
      const handleMessage = (event: MessageEvent) => {
        try {
          const decryptedValue = decryptIfNeeded(event.data, encrypt?.value);
          let parsed: unknown;
          try {
            parsed = JSON.parse(decryptedValue);
          } catch {
            parsed = decryptedValue;
          }
          const validated = schema.parse(parsed);
          setStoredValue(validated);
          log("broadcastReceived", { decryptedValue, parsed, validated });
        } catch (error) {
          log("broadcastError", error);
          if (onError) onError(error);
        }
      };
      channel.addEventListener("message", handleMessage);
      return () => channel.close();
    }
  }, [key, schemaFn, useBroadcastChannel, encrypt, onError]);

  return [storedValue, setValue];
};
