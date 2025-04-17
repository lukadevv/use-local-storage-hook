import { renderHook, act, waitFor } from "@testing-library/react";
import { z } from "zod";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Mock localStorage
const mockLocalStorage: Record<string, string> = {};
const mockSetItem = jest.fn((key, value) => {
  mockLocalStorage[key] = value;
});
global.localStorage = {
  getItem: jest.fn((key) => mockLocalStorage[key] || null),
  setItem: mockSetItem,
  removeItem: jest.fn((key) => {
    delete mockLocalStorage[key];
  }),
  clear: jest.fn(() => {
    Object.keys(mockLocalStorage).forEach(
      (key) => delete mockLocalStorage[key]
    );
  }),
} as any;

// Mock BroadcastChannel
const mockBroadcastChannel = {
  postMessage: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  close: jest.fn(),
};
global.BroadcastChannel = jest.fn(() => mockBroadcastChannel) as any;

describe("useLocalStorage Hook", () => {
  const schema = z.object({
    name: z.string(),
    age: z.number(),
  });

  const initialValue = { name: "John Doe", age: 30 };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockLocalStorage).forEach(
      (key) => delete mockLocalStorage[key]
    );
  });

  afterEach(() => {
    localStorage.clear();
    mockBroadcastChannel.close();
  });

  test("should initialize with the initial value if localStorage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage("user", schema, initialValue)
    );

    expect(result.current[0]).toEqual(initialValue);
  });

  test("should retrieve and parse value from localStorage", () => {
    const storedValue = JSON.stringify({ name: "Jane Doe", age: 25 });
    localStorage.setItem("user", storedValue);

    const { result } = renderHook(() =>
      useLocalStorage("user", schema, initialValue)
    );

    expect(result.current[0]).toEqual({ name: "Jane Doe", age: 25 });
  });

  // test("should update localStorage when value is set", () => {
  //   const { result } = renderHook(() =>
  //     useLocalStorage("user", schema, initialValue)
  //   );

  //   act(() => {
  //     result.current[1]({ name: "Alice", age: 35 });
  //   });

  //   expect(mockSetItem).toHaveBeenCalledWith(
  //     "user",
  //     JSON.stringify({ name: "Alice", age: 35 })
  //   );
  //   expect(result.current[0]).toEqual({ name: "Alice", age: 35 });
  // });

  test("should handle schema validation errors", () => {
    const invalidValue = JSON.stringify({
      name: "Invalid User",
      age: "not-a-number",
    });
    localStorage.setItem("user", invalidValue);

    const onError = jest.fn();
    const { result } = renderHook(() =>
      useLocalStorage("user", schema, initialValue, { onError })
    );

    expect(result.current[0]).toEqual(initialValue);
    expect(onError).toHaveBeenCalled();
  });

  test("should encrypt and decrypt values if encryption is enabled", () => {
    const encryptConfig = {
      key: true,
      value: true,
      phrase: "secret-phrase",
    };

    const { result } = renderHook(() =>
      useLocalStorage("user", schema, initialValue, { encrypt: encryptConfig })
    );

    act(() => {
      result.current[1]({ name: "Bob", age: 40 });
    });

    const encryptedKey = Object.keys(mockLocalStorage)[0];
    const encryptedValue = mockLocalStorage[encryptedKey];

    expect(encryptedKey).not.toBe("user");
    expect(encryptedValue).not.toBe(JSON.stringify({ name: "Bob", age: 40 }));

    const { result: newResult } = renderHook(() =>
      useLocalStorage("user", schema, initialValue, { encrypt: encryptConfig })
    );

    expect(newResult.current[0]).toEqual({ name: "Bob", age: 40 });
  });

  test("should sync state across tabs using BroadcastChannel", async () => {
    const mockBroadcastChannel = {
      postMessage: jest.fn(),
      addEventListener: jest.fn((_, callback) => {
        setTimeout(() => {
          callback({ data: JSON.stringify({ name: "Eve", age: 28 }) });
        }, 100);
      }),
      close: jest.fn(),
    };

    global.BroadcastChannel = jest.fn(() => mockBroadcastChannel) as any;

    const { result } = renderHook(() =>
      useLocalStorage("user", schema, initialValue, {
        useBroadcastChannel: true,
      })
    );

    expect(result.current[0]).toEqual(initialValue);

    await waitFor(
      () => {
        expect(result.current[0]).toEqual({ name: "Eve", age: 28 });
      },
      { timeout: 500 }
    );
  });
});
