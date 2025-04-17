import React, { useState, useEffect } from "react";
import "./App.css";
import { z } from "zod";
import { useLocalStorage } from "use-super-local-storage";

function App() {
  const [storedValue, setStoredValue] = useLocalStorage<string>(
    "demoKey",
    z.string(),
    "hello world"
  );
  const [keys, setKeys] = useState<string[]>([]);

  // refresh key list whenever storage changes
  useEffect(() => {
    setKeys(Object.keys(localStorage));
  }, [storedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoredValue(e.target.value);
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
    <div className="app">
      <h1>LocalStorage Explorer</h1>

      <section className="controls">
        <label>
          demoKey:
          <input
            type="text"
            value={storedValue}
            onChange={handleChange}
            placeholder="Type a value…"
          />
        </label>
        <button onClick={() => setStoredValue(storedValue)}>Save</button>
        <button className="danger" onClick={clearAll}>
          Clear All
        </button>
      </section>

      <section>
        <h2>Contents</h2>
        <table className="storage-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr
                key={key}
                className={key === "demoKey" ? "highlight" : undefined}
              >
                <td>{key}</td>
                <td>{localStorage.getItem(key)}</td>
                <td>
                  <button onClick={() => handleDelete(key)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
