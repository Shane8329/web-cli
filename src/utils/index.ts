import { sync } from "cross-spawn";
import fs from "fs-extra";
import inquirer from "inquirer";
import stringify from "json-stable-stringify-without-jsonify";
import os from "node:os";
import path from "node:path";
import shell from "shelljs";
import { PackageJson } from "type-fest";
import { findPackageJson } from "./npm-package";

export function appendScript(pkg: PackageJson, scriptName: string, cmd: string) {
  pkg.scripts ||= {};
  if (pkg.scripts[scriptName] !== undefined) {
    if (pkg.scripts[scriptName].includes(cmd)) {
      console.log(`  "${cmd}" command already exists in ${scriptName} script, skipping.`);
    } else {
      console.log(`  appending "${cmd}" command to ${scriptName} script`);
      pkg.scripts[scriptName] += ` && ${cmd}`;
    }
  } else {
    console.log(`  setting ${scriptName} script to command "${cmd}"`);
    pkg.scripts[scriptName] = cmd;
  }
}

export const prompt = async (prompts: any[]) => {
  return await new inquirer.prompt(prompts);
};

export const createPackageFile = async (projectRoot = process.cwd()) => {
  const gitPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(gitPath)) {
    sync(`npm`, ["init"], { cwd: projectRoot, stdio: "inherit" });
  }
};

export function getPkg() {
  return JSON.parse(findPackageJson(__dirname));
}

function sortByKey(a, b) {
  return a.key > b.key ? 1 : -1;
}
export function toStringify(pkg: object) {
  return `${stringify(pkg, { cmp: sortByKey, space: 4 })}\n`;
}

/*
  参数解析  
  type = default 此处支持的解析输入格式为 qps commit 备注 分支名称 
  type = options 此处支持的解析输入格式为 qps --name=xx --age=23 备注 分支名称 
*/
export function getParams(type = "default") {
  const args = process.argv.slice(3);
  if (type === "options") {
    const params = Object.fromEntries(
      args.reduce((pre, item) => {
        if (item.startsWith("--")) {
          return [...pre, item.slice(2).split("=")];
        }
        return pre;
      }, [])
    );
    return params || [];
  } else {
    return args || [];
  }
}

// promise 封装 接受参数为函数
export function cmdExec(cmd) {
  return new Promise((resolve, reject) => {
    shell.exec("rm -f .git/index.lock");
    shell.exec(cmd, (code) => {
      if (code !== 0) {
        reject();
        shell.exit(1);
      } else {
        resolve(true);
      }
    });
  });
}

export function winPath(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  if (isExtendedLengthPath) {
    return path;
  }
  return path.replace(/\\/g, "/");
}

export const dynamicImport = (file: string) => {
  const platform = os.platform();

  const fn = new Function("file", "return import(file)");

  if (platform === "win32") {
    file = `file://${file}`;
  }

  return fn(`${file}?key=${new Date().getTime()}`);
};

export function isPath(str) {
  if (typeof str !== "string") {
    return false;
  }

  // 判断是否是绝对路径
  if (path.isAbsolute(str)) {
    return true;
  }

  // 判断是否能解析为一个有效的路径对象
  const parsed = path.parse(str);
  if (parsed.dir && parsed.base) {
    return true;
  }

  return false;
}
