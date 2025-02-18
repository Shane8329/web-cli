import chalk from "chalk";
import inquirer from "inquirer";
import initProject from "./init";
import { downloadGitProject } from "../utils/download";
import { questions, tpls } from "./config";

const log = console.log;

function question(url: string) {
  inquirer
    .prompt(questions)
    .then(async (answers: any) => {
      //下载模板
      await downloadGitProject(url, answers?.projectName);

      //初始化项目配置
      initProject({
        packageManager: answers?.bag,
        projectInfo: answers,
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export default function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "tplName",
        message: "请选择模板:",
        prefix: "➜",
        choices: tpls?.map((v) => v?.name),
      },
    ])
    .then((answers) => {
      const n = tpls?.find((n) => n?.name === answers.tplName);
      if (n) {
        question(n?.url);
      } else {
        log(chalk.red("暂不支持, 请等待后续开发提供..."));
      }
    });
}
