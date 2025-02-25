import fs from "node:fs";
import path from "node:path";
import { createServer, loadConfigFromFile, mergeConfig } from "vite";
import serveConfig from "./base.config";

async function serve() {
  const configPath = path.join(process.cwd(), "./vite.config.ts");
  let overrides = {};

  if (fs.existsSync(configPath)) {
    const configFile = await loadConfigFromFile(
      { command: "serve", mode: "development" },
      configPath
    );

    overrides = configFile?.config || {};
  }

  const defaultConfig = serveConfig();

  const server = await createServer(mergeConfig(defaultConfig, overrides));

  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
}

export default serve;
