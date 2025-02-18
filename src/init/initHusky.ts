import { sync } from "cross-spawn";
import { existsSync } from "fs";
import { join } from "path";

export default async function initHusky(packageManager, projectRoot) {
  const gitPath = join(projectRoot, ".git");
  if (!existsSync(gitPath)) {
    sync(`git`, ["init"], { cwd: projectRoot, stdio: "inherit" });
  }
}
