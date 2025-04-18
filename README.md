<div align="center">

  <img src="https://raw.githubusercontent.com/lukadevv/lukadevv/refs/heads/main/use-super-local-storage.webp" alt="logo" width="200"/>

# use-super-local-storage

![npm](https://img.shields.io/npm/dw/use-super-local-storage")

**0 dependencies · Lightweight · Type-safe · React & Preact support**

</div>

---

`use-super-local-storage` is a React/Preact hook for localStorage with **type-safe schema validation**, **encryption**, **cross-tab sync**, and **error handling**—all with zero dependencies and a tiny bundle size.

- **Zero dependencies**: No runtime dependencies, not even Zod or Yup.
- **Type-safe schema validation**: Use a built-in, type-safe schema builder (inspired by Zod/Yup).
- **Encryption**: Optional XOR encryption for keys and values.
- **Cross-tab sync**: Sync state across browser tabs using `BroadcastChannel`.
- **Error handling**: Custom error and backup strategies.
- **Works with React & Preact**: For Preact, alias `react`/`react-dom` to `preact/compat`.

---

## Installation

```bash
npm install use-super-local-storage
# or
yarn add use-super-local-storage
```

---

## Features

- **Type-safe schema validation** (no Zod/Yup required)
- **Encryption** (simple XOR, optional)
- **Cross-tab synchronization**
- **Error handling & backup**
- **Works with React and Preact**
- **Zero dependencies**

---

## Usage

### 1. Define your schema

```tsx
import { schema, SchemaType } from "use-super-local-storage";

const userSchema = (s: SchemaType) =>
  s.object({
    name: s.string().min(2).max(32).required(),
    age: s.number().min(0).max(120).required(),
    tags: s.array(s.string()),
    profile: s.object({
      id: s.number().required(),
      admin: s.boolean(),
    }),
  });
```

### 2. Use the hook

```tsx
import React from "react";
import { useLocalStorage } from "use-super-local-storage";

const initialValue = {
  name: "John Doe",
  age: 30,
  tags: [],
  profile: { id: 1, admin: false },
};

const [user, setUser] = useLocalStorage("user", userSchema, initialValue);

function App() {
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => setUser({ ...user, name: "Jane Doe" })}>
        Update Name
      </button>
    </div>
  );
}

export default App;
```

---

### Advanced Example: Encryption & Error Handling

```tsx
const encryptConfig = {
  key: true,
  value: true,
  phrase: "my-secret-phrase",
};

const [user, setUser] = useLocalStorage("user", userSchema, initialValue, {
  encrypt: {
    key: true, // Encrypt the key in localStorage
    value: true, // Encrypt the value in localStorage
    phrase: "my-secret-phrase", // Encryption phrase (simple XOR)
  },
  onError: (error) => console.error("LocalStorage Error:", error),
  restoreOnError: true, // Restore to initial value on error (default: true)
  useBroadcastChannel: true, // Sync across tabs (default: true)
  backupOnError: true, // Store a backup with a timestamped key on error
  debug: true, // Enable debug logging
  onChangeBeforeValidation: (oldValue, newValue) => {
    // Called before validation
  },
  onChangeAfterValidation: (oldValue, newValue) => {
    // Called after validation
  },
});
```

---

## API

### `useLocalStorage`

```typescript
import { SchemaType, LocalStorageConfiguration } from "use-super-local-storage";

type UseLocalStorageType = <R>(
  key: string,
  schema: (builder: SchemaType) => { parse(value: unknown): R },
  initialValue: R,
  config?: LocalStorageConfiguration<R>
) => [R, React.Dispatch<React.SetStateAction<R>>];
```

#### Parameters

- `key` (`string`): The key used in `localStorage`.
- `schema` (`function`): Receives the schema builder (`SchemaType`) and returns a schema instance.
- `initialValue` (`R`): The initial value if nothing is found in `localStorage`.
- `config` (`LocalStorageConfiguration<R>`): Optional configuration object.

#### Configuration Options (`LocalStorageConfiguration<T>`)

- `onError?: (value: any) => void`  
  Handles errors that occur during local storage operations.
- `onChangeAfterValidation?: (oldValue: T, newValue: T) => void`  
  Called after the value has been validated.
- `onChangeBeforeValidation?: (oldValue: T, newValue: any) => void`  
  Called before the value is validated and set.
- `restoreOnError?: boolean`  
  Restore to initial value if an error occurs. Default: `true`.
- `useBroadcastChannel?: boolean`  
  Sync local storage across tabs. Default: `true`.
- `encrypt?: { key?: boolean; value?: boolean; phrase: string }`  
  Basic encryption for key/value (simple XOR, not secure for sensitive data).
- `backupOnError?: boolean`  
  Store a backup with a timestamped key on error.
- `debug?: boolean`  
  Enable debug mode to log local storage operations.

#### Returns

- `[storedValue, setValue]`: The stored value and a setter function.

---

## Notes

- **Encryption**: Uses a simple XOR cipher. Not secure for sensitive data.
- **Validation**: Uses a built-in schema builder (not Zod/Yup).
- **Preact**: Alias `react` and `react-dom` to `preact/compat` for full compatibility.

---

## License

MIT
