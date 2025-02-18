import fs from "fs-extra";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  sourcemap: false,
  minify: false,
  clean: true,
  shims: true,
  plugins: [
    {
      name: "copy-config-plugin",
      buildStart() {
        fs.copySync("./src/config", "dist/config");
        // fs.copyFileSync("./src/plugin/rollup-plugin-models/provider.tsx", "dist/provider.tsx");
        // fs.copyFileSync("./src/plugin/rollup-plugin-models/use-model.ts", "dist/use-model.ts");
      },
    },
  ],
});
