import { ZodSchema } from "zod";

/**
 * A custom hook that manages local storage with optional encryption and error handling.
 */
export type UseLocalStorageType = <T>(
  key: string,
  schema: ZodSchema<T>,
  initialValue: T,
  config?: LocalStorageConfiguration<T>
) => [T, React.Dispatch<React.SetStateAction<T>>];

/**
 * Configuration options for the useLocalStorage hook.
 */
export type LocalStorageConfiguration<T> = {
  /**
   * Handles errors that occur during local storage operations.
   *
   * @param value - The value that caused the error.
   */
  onError?: (value: any) => void;

  /**
   * A callback function that is called after the value has been validated.
   *
   * @param oldValue - The old/current value before the change.
   * @param newValue - The new value that will be set.
   */
  onChangeAfterValidation?: (oldValue: T, newValue: T) => void;

  /**
   * A callback function that is called before the value is validated and set.
   *
   * @param oldValue - The old/current value before the change.
   * @param newValue - The new value that will be set.
   */
  onChangeBeforeValidation?: (oldValue: T, newValue: any) => void;

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
    /**
     * Encrypt the key.
     */
    key?: boolean;
    /**
     * Encrypt the value.
     */
    value?: boolean;
    /**
     * The phrase used for encryption.
     * This is a simple XOR cipher and should not be used for sensitive data.
     */
    phrase: string;
  };

  /**
   * The value will be stored in a different key using the datetime as a suffix.
   *
   * @default false
   */
  backupOnError?: boolean;

  /**
   * Enable debug mode to log local storage operations.
   *
   * @default false
   */
  debug?: boolean;
};
