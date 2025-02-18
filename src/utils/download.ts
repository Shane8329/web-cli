import compressing from "compressing";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

export async function downloadGitProject(
  repoUrl: string,
  projectName: string,
  token = "r6vhNJb_3ud7yxgeiSku"
) {
  const targetDir = process.cwd();
  const file = fs.createWriteStream(path.join(targetDir, `${projectName}.zip`));

  const request = https.get(repoUrl, { headers: { "PRIVATE-TOKEN": token } }, (response) => {
    response.pipe(file);

    file.on("finish", () => {
      file.close();
      extractAndRename(path.join(targetDir, `${projectName}.zip`), targetDir, projectName);
    });
  });

  request.on("error", (err) => {
    fs.unlink(file);
    console.error(`Error downloading project: ${err.message}`);
  });
}

function extractAndRename(filePath: string, targetDir: string, projectName: string) {
  const extractDir = path.join(targetDir, `${projectName}-temp`);

  compressing.zip
    .uncompress(filePath, extractDir)
    .then(() => {
      const files = fs.readdirSync(extractDir);
      if (files.length === 1) {
        const innerDir = path.join(extractDir, files[0]);
        fs.renameSync(innerDir, path.join(targetDir, projectName));
      }
      fs.rmdirSync(extractDir, { recursive: true });
      fs.unlinkSync(filePath);
      console.log(`Project extracted and renamed to ${projectName}`);
    })
    .catch((err) => {
      console.error(`Error extracting project: ${err.message}`);
    });
}
