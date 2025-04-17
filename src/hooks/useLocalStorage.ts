import { useState, useEffect } from "react";
import { UseLocalStorageType } from "../types/main.types";
import { encryptString, decryptString } from "../libs/encrypt";
import { ZodSchema } from "zod";

export const useLocalStorage: UseLocalStorageType = <T>(
  key: string,
  schema: ZodSchema<T>,
  initialValue: T,
  config: Partial<{
    onError: (value: any) => void;
    restoreOnError: boolean;
    useBroadcastChannel: boolean;
    encrypt: { key?: boolean; value?: boolean };
    backupOnError: boolean;
  }> = {}
) => {
  const {
    onError,
    restoreOnError = true,
    useBroadcastChannel = true,
    encrypt,
    backupOnError,
  } = config;

  const encryptionPhrase = "default_phrase"; // Replace with a secure phrase or pass it via config

  const encryptIfNeeded = (value: string, shouldEncrypt?: boolean) =>
    shouldEncrypt ? encryptString(encryptionPhrase, value) : value;

  const decryptIfNeeded = (value: string, shouldDecrypt?: boolean) =>
    shouldDecrypt ? decryptString(encryptionPhrase, value) : value;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const storedKey = encryptIfNeeded(key, encrypt?.key);
      const item = localStorage.getItem(storedKey);
      if (item) {
        const decryptedValue = decryptIfNeeded(item, encrypt?.value);
        const parsed = JSON.parse(decryptedValue);
        const validated = schema.parse(parsed);
        return validated;
      }
    } catch (error) {
      if (onError) onError(error);
      if (restoreOnError) return initialValue;
    }
    return initialValue;
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      const serializedValue = JSON.stringify(valueToStore);
      const encryptedValue = encryptIfNeeded(serializedValue, encrypt?.value);
      const storedKey = encryptIfNeeded(key, encrypt?.key);

      localStorage.setItem(storedKey, encryptedValue);
      setStoredValue(valueToStore);

      if (useBroadcastChannel) {
        const channel = new BroadcastChannel(storedKey);
        channel.postMessage(encryptedValue);
        channel.close();
      }
    } catch (error) {
      if (onError) onError(error);
      if (backupOnError) {
        const backupKey = `${key}_${new Date().toISOString()}`;
        const encryptedBackupKey = encryptIfNeeded(backupKey, encrypt?.key);
        localStorage.setItem(encryptedBackupKey, JSON.stringify(value));
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
          const parsed = JSON.parse(decryptedValue);
          const validated = schema.parse(parsed);
          setStoredValue(validated);
        } catch (error) {
          if (onError) onError(error);
        }
      };
      channel.addEventListener("message", handleMessage);
      return () => channel.close();
    }
  }, [key, schema, useBroadcastChannel, encrypt, onError]);

  return [storedValue, setValue];
};
