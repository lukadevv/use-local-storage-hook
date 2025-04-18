import React, { useState, useEffect } from "react";
import "./App.css";
import { useLocalStorage } from "use-super-local-storage";
import { SchemaType } from "use-super-local-storage";

// Define schemas using the new builder style
const numberSchema = (s: SchemaType) => s.number();
const stringSchema = (s: SchemaType) => s.string();
const objectSchema = (s: SchemaType) =>
  s.object({ name: s.string(), age: s.number() });
const secretSchema = (s: SchemaType) => s.string();

function App() {
  // Test values for different types
  const [numberValue, setNumberValue] = useLocalStorage(
    "numberKey",
    numberSchema,
    0,
    { debug: true }
  );
  const [stringValue, setStringValue] = useLocalStorage(
    "stringKey",
    stringSchema,
    "",
    { debug: true }
  );
  const [objectValue, setObjectValue] = useLocalStorage(
    "objectKey",
    objectSchema,
    { name: "", age: 0 },
    { debug: true }
  );

  // Example with encryption
  const [secretValue, setSecretValue] = useLocalStorage(
    "secretKey",
    secretSchema,
    "",
    {
      debug: true,
      encrypt: { value: true, phrase: "mySecretPhrase" },
    }
  );

  const [keys, setKeys] = useState<string[]>([]);

  // Refresh key list whenever storage changes
  useEffect(() => {
    setKeys(Object.keys(localStorage));
  }, [numberValue, stringValue, objectValue, secretValue]);

  // Handlers for each type
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberValue(Number(e.target.value));
  };

  const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStringValue(e.target.value);
  };

  const handleObjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObjectValue({
      ...objectValue,
      [e.target.name]:
        e.target.name === "age" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecretValue(e.target.value);
  };

  const handleDelete = (key: string) => {
    localStorage.removeItem(key);
    setKeys(Object.keys(localStorage));
  };

  const clearAll = () => {
    localStorage.clear();
    setKeys([]);
  };

  return (
    <div
      className="app"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #18181b 0%, #23272f 100%)",
        fontFamily: "Segoe UI, sans-serif",
        color: "#fff",
      }}
    >
      <div
        style={{
          background: "#23272f",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          padding: "2rem 2.5rem",
          maxWidth: 500,
          width: "100%",
          marginBottom: "2rem",
          color: "#fff",
        }}
      >
        <a
          href="https://github.com/lukadevv/use-super-local-storage"
          style={{ textAlign: "center", marginBottom: 1, fontSize: 27 }}
        >
          use-super-local-storage
        </a>
        <h2
          style={{
            textAlign: "center",
            marginBottom: 24,
            fontSize: 22,
            borderBottom: "1px solid black",
            paddingBottom: 12,
            opacity: 0.8,
          }}
        >
          Playground
        </h2>
        <section className="controls" style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 18 }}>
              <b>Number Test:</b>
            </label>
            <input
              type="number"
              value={numberValue}
              onChange={handleNumberChange}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #444",
                background: "#18181b",
                color: "#fff",
                fontSize: 18,
              }}
              placeholder="Type a number…"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 18 }}>
              <b>String Test:</b>
            </label>
            <input
              type="text"
              value={stringValue}
              onChange={handleStringChange}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #444",
                background: "#18181b",
                color: "#fff",
                fontSize: 18,
              }}
              placeholder="Type a string…"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 18 }}>
              <b>Object Test:</b>
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                name="name"
                value={objectValue.name}
                onChange={handleObjectChange}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #444",
                  background: "#18181b",
                  color: "#fff",
                  fontSize: 18,
                }}
                placeholder="Name"
              />
              <input
                type="number"
                name="age"
                value={objectValue.age}
                onChange={handleObjectChange}
                style={{
                  width: 100,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #444",
                  background: "#18181b",
                  color: "#fff",
                  fontSize: 18,
                }}
                placeholder="Age"
              />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 18 }}>
              <b>Encrypted String Test:</b>
              <span style={{ fontSize: 13, color: "#a3a3a3", marginLeft: 8 }}>
                (stored encrypted in localStorage)
              </span>
            </label>
            <input
              type="text"
              value={secretValue}
              onChange={handleSecretChange}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #444",
                background: "#18181b",
                color: "#fff",
                fontSize: 18,
              }}
              placeholder="Type a secret string…"
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 16,
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => {
                setNumberValue(numberValue);
                setStringValue(stringValue);
                setObjectValue(objectValue);
                setSecretValue(secretValue);
              }}
              style={{
                padding: "10px 22px",
                borderRadius: 8,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                fontSize: 18,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Save All
            </button>
            <button
              onClick={clearAll}
              style={{
                padding: "10px 22px",
                borderRadius: 8,
                border: "none",
                background: "#ef4444",
                color: "#fff",
                fontWeight: 600,
                fontSize: 18,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Clear All
            </button>
          </div>
        </section>
      </div>

      <div
        style={{
          background: "#23272f",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          padding: "2rem 2.5rem",
          maxWidth: 700,
          width: "100%",
          color: "#fff",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 16, fontSize: 26 }}>
          📦 LocalStorage Contents
        </h2>
        <table
          className="storage-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 0,
            background: "#18181b",
            borderRadius: 10,
            overflow: "hidden",
            color: "#fff",
            fontSize: 17,
          }}
        >
          <thead>
            <tr style={{ background: "#18181b" }}>
              <th style={{ padding: 12, textAlign: "left" }}>Key</th>
              <th style={{ padding: 12, textAlign: "left" }}>Value</th>
              <th style={{ padding: 12, textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {keys.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  style={{ textAlign: "center", padding: 24, color: "#bbb" }}
                >
                  <i>No items in localStorage</i>
                </td>
              </tr>
            ) : (
              keys.map((key) => (
                <tr
                  key={key}
                  style={{
                    background:
                      key === "numberKey" ||
                      key === "stringKey" ||
                      key === "objectKey" ||
                      key === "secretKey"
                        ? "#334155"
                        : "#18181b",
                  }}
                >
                  <td
                    style={{ padding: 12, fontWeight: 500, textAlign: "start" }}
                  >
                    {key}
                  </td>
                  <td
                    style={{
                      padding: 12,
                      fontFamily: "monospace",
                      wordBreak: "break-all",
                      textAlign: "start",
                    }}
                  >
                    {localStorage.getItem(key)}
                  </td>
                  <td style={{ padding: 12, textAlign: "left" }}>
                    <button
                      onClick={() => handleDelete(key)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: 8,
                        border: "none",
                        background: "#f59e42",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div
          style={{
            marginTop: 28,
            textAlign: "center",
            color: "#a3a3a3",
            fontSize: 16,
          }}
        >
          <b>Tip:</b> Open the browser console to see debug logs in action!
        </div>
      </div>
    </div>
  );
}

export default App;
