import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxFactory: "MiniReact.createElement",
  },
});
