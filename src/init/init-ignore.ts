import fs from "fs-extra";
import path from "node:path";

export const ignoreFile = async (projectRoot = process.cwd()) => {
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
