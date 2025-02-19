import { merge } from "merge";
import { toStringify } from "../utils";
import { CreateFileType, FrameworkType } from "./typings";
import fs from "fs-extra";
import path from "node:path";
import { lints } from "./config";

async function createFile(
  { type, saveExt = ".cjs" }: CreateFileType,
  framework?: FrameworkType,
  projectRoot = process.cwd()
) {
  let content = "";
  let res = null;
  let data = null;
  if (type === "npm") {
    content = fs.readFileSync(path.join(__dirname, `./config/npm`), "utf-8");
  } else {
    res = await import(path.join(__dirname, `./config/${type}.cjs`));
    data = res.default;

    if (type === "eslint") {
      let config = {};
      const base = data?.base;
      const frameworkByConfig = data?.[framework];
      config = merge(base, frameworkByConfig);

      content = toStringify(config);
    } else {
      content = toStringify(data);
    }
  }

  if (saveExt === ".cjs" || saveExt === ".js") {
    content = `module.exports = ${content}`;
  }

  fs.writeFileSync(path.join(projectRoot, `.${type}rc${saveExt}`), content);
}
export default async function initFile(framework: FrameworkType, projectRoot) {
  let files = [...lints].filter((item) => !item.remove?.(framework));

  const promiseList = (files as CreateFileType[]).map((item) => {
    return createFile(item, framework, projectRoot);
  });

  try {
    await Promise.all(promiseList);
    console.log("lint file init success!");
  } catch (e) {
    console.error(e);
    throw new Error(`create file error ${e.toString()}`);
  }
}
