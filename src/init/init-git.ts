import fs from "fs-extra";
import { existsSync } from "node:fs";
import path, { join } from "node:path";
import { sync } from "cross-spawn";

export default async (projectRoot = process.cwd()) => {
  const gitPath = join(projectRoot, ".git");

  if (!existsSync(gitPath)) {
    sync(`git`, ["init"], { cwd: projectRoot, stdio: "inherit" });
  }

  const gitignorePath = path.join(projectRoot, ".gitignore");

  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, `node_modules\n/src/.jay\n`);
  }

  const eslintignorePath = path.join(projectRoot, ".eslintignore");

  if (!fs.existsSync(eslintignorePath)) {
    fs.writeFileSync(
      eslintignorePath,
      `node_modules\nbin\ndist\n.eslintrc.cjs\n.commitlintrc.cjs\n.prettierrc.cjs\n`
    );
  }
};
