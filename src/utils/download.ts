import compressing from "compressing";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import request from "./request";
export async function downloadGitProject(
  repoUrl: string,
  projectName: string,
  token = "r6vhNJb_3ud7yxgeiSku"
) {
  return new Promise(async (resolve, reject) => {
    const targetDir = process.cwd();
    const file = fs.createWriteStream(path.join(targetDir, `${projectName}.zip`));

    try {
      const res = await request(repoUrl, { headers: { "PRIVATE-TOKEN": token }, type: "buffer" });

      res.pipe(file);

      file.on("finish", async () => {
        file.close();
        await extractAndRename(path.join(targetDir, `${projectName}.zip`), targetDir, projectName);
        resolve(true);
      });
    } catch (err) {
      fs.unlink(file);
      console.error(`Error downloading project: ${err}`);
      reject(err);
    }
  });
}

async function extractAndRename(filePath: string, targetDir: string, projectName: string) {
  const extractDir = path.join(targetDir, `${projectName}-temp`);

  await compressing.zip.uncompress(filePath, extractDir);
  const files = fs.readdirSync(extractDir);

  if (files.length === 1) {
    const innerDir = path.join(extractDir, files[0]);
    fs.renameSync(innerDir, path.join(targetDir, projectName));
  }
  fs.rmdirSync(extractDir, { recursive: true });
  fs.unlinkSync(filePath);
}
