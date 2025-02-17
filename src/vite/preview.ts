import fs from "node:fs";
import path from "node:path";
import { loadConfigFromFile, mergeConfig, preview as vitePreview } from "vite";
import baseConfig from "./base.config";

async function preview() {
  const configPath = path.join(process.cwd(), "./vite.config.ts");
  let overrides = {};

  if (fs.existsSync(configPath)) {
    const configFile = await loadConfigFromFile(
      { command: "build", mode: "production" },
      configPath
    );
    overrides = configFile?.config || {};
  }

  const config = mergeConfig(baseConfig(), overrides);
  const previewServer = await vitePreview(config);
  previewServer.printUrls();
  previewServer.bindCLIShortcuts({ print: true });
}
export default preview;
