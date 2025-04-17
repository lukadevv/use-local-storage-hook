# use-super-local-storage

`use-super-local-storage` is a React hook that simplifies working with `localStorage` while providing advanced features like encryption, schema validation, error handling, and cross-tab synchronization.

## Installation

Install the package using npm or yarn:

```bash
npm install use-super-local-storage
```

or

```bash
yarn add use-super-local-storage
```

## Features

- **Schema Validation**: Validate stored data using [Zod](https://zod.dev/).
- **Encryption**: Encrypt keys and values using a simple XOR cipher.
- **Cross-Tab Synchronization**: Sync `localStorage` changes across browser tabs using `BroadcastChannel`.
- **Error Handling**: Handle errors gracefully with custom callbacks.
- **Backup on Error**: Automatically back up values with a timestamped key.

## Usage

### Basic Example

```tsx
import React from "react";
import { useLocalStorage } from "use-super-local-storage";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

const App = () => {
  const [user, setUser] = useLocalStorage(
    "user",
    schema,
    { name: "John Doe", age: 30 }
  );

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => setUser({ name: "Jane Doe", age: 25 })}>
        Update User
      </button>
    </div>
  );
};

export default App;
```

### Advanced Example with Encryption and Error Handling

```tsx
import React from "react";
import { useLocalStorage } from "use-super-local-storage";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

const App = () => {
  const [user, setUser] = useLocalStorage(
    "user",
    schema,
    { name: "John Doe", age: 30 },
    {
      encrypt: {
        key: true,
        value: true,
        phrase: "my-secret-phrase",
      },
      onError: (error) => console.error("LocalStorage Error:", error),
      restoreOnError: true,
      useBroadcastChannel: true,
      backupOnError: true,
    }
  );

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => setUser({ name: "Jane Doe", age: 25 })}>
        Update User
      </button>
    </div>
  );
};

export default App;
```

## API

### `useLocalStorage`

```typescript
useLocalStorage<T>(
  key: string,
  schema: ZodSchema<T>,
  initialValue: T,
  config?: LocalStorageConfiguration
): [T, React.Dispatch<React.SetStateAction<T>>];
```

#### Parameters

- `key` (string): The key used to store the value in `localStorage`.
- `schema` (ZodSchema<T>): A Zod schema to validate the stored value.
- `initialValue` (T): The initial value to use if no value is found in `localStorage`.
- `config` (LocalStorageConfiguration): Optional configuration object.

#### Configuration Options

- `onError` (function): Callback for handling errors.
- `restoreOnError` (boolean): Restore to the initial value if an error occurs. Default: `true`.
- `useBroadcastChannel` (boolean): Enable cross-tab synchronization. Default: `true`.
- `encrypt` (object): Encryption options.
  - `key` (boolean): Encrypt the key. Default: `false`.
  - `value` (boolean): Encrypt the value. Default: `false`.
  - `phrase` (string): The encryption phrase.
- `backupOnError` (boolean): Store a backup of the value with a timestamped key if an error occurs. Default: `false`.

#### Returns

- `[storedValue, setValue]`: A tuple containing the stored value and a function to update it.

## Notes

- **Encryption**: The encryption method used is a simple XOR cipher. It is not secure for sensitive data.
- **Validation**: The hook uses [Zod](https://zod.dev/) for schema validation. Ensure you provide a valid schema.

## License

This project is licensed under the MIT License.