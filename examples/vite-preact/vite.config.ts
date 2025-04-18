import { defineConfig } from "vite";
import preact from "@vitejs/plugin-react";
// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: "/use-super-local-storage/",
});
