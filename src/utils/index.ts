import fs from 'fs-extra';
import path from 'node:path';

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

export function getPkg() {
  return JSON.parse(findPackageJson(__dirname) || '{}');
}