import { ZodSchema } from "zod";

export type UseLocalStorageType = <T>(
  key: string,
  schema: ZodSchema<T>,
  initialValue: T,
  config?: LocalStorageConfiguration
) => [T, React.Dispatch<React.SetStateAction<T>>];

export type LocalStorageConfiguration = {
  /**
   * Handles errors that occur during local storage operations.
   *
   * @param value - The value that caused the error.
   */
  onError?: (value: any) => void;

  /**
   * Restore to initial value if an error occurs.
   *
   * @default true
   */
  restoreOnError?: boolean;

  /**
   * Create a broadcast channel to sync local storage across tabs.
   *
   * @default true
   */
  useBroadcastChannel?: boolean;

  /**
   * A basic encryption of the key/value.
   *
   * This is not a secure encryption method and should not be used for sensitive data.
   */
  encrypt?: {
    key?: boolean;
    value?: boolean;
  };

  /**
   * The value will be stored in a different key using the datetime as a suffix.
   */
  backupOnError?: boolean;
};
