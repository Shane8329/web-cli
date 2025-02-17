#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { run } from "../dist/index.js";
try {
  run();
} catch (e) {
  console.error(e);
}
