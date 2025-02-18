import fs from 'fs-extra';
import path from 'node:path';
import { PackageJson } from 'type-fest';
import { toStringify } from './index';

type ScriptType = {
  name: string;
  cmd: string;
};

function setScriptType(pkg: PackageJson, script: ScriptType) {
  const { name, cmd } = script;
  pkg.scripts ||= {};
  pkg.scripts[name] = cmd;
}
// 更新命令
export function updateScript(
  pkg: PackageJson,
  scripts: ScriptType | ScriptType[],
) {
  if (!scripts) {
    return null;
  }

  if (Array.isArray(scripts)) {
    scripts.forEach((item) => {
      setScriptType(pkg, item);
    });
  } else {
    setScriptType(pkg, scripts);
  }
}
// 保存Package.json内容
export function updatePackage(pkg, projectRoot = process.cwd()) {
  const packagePath = path.join(projectRoot, 'package.json');

  fs.writeFileSync(packagePath, toStringify(pkg));
}

//查找package.json
export function findPackageJson(startDir?: string) {
  let dir = path.resolve(startDir || process.cwd());

  do {
    const pkgFile = path.join(dir, 'package.json');

    if (!fs.existsSync(pkgFile) || !fs.statSync(pkgFile).isFile()) {
      dir = path.join(dir, '..');
      continue;
    }
    const str = fs.readFileSync(pkgFile, 'utf-8');
    return str;
  } while (dir !== path.resolve(dir, '..'));
  return null;
}
