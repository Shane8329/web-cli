import path from "node:path";
import addDependencies from "./addDependencies";
import { initCache } from "./cache";
import initHusky from "./initHusky";
import initFile from "./lintFile";
import { FrameworkType, PackageManagerType } from "./typings";
import updatePackageJSON from "./updatePackageJSON";
import { ignoreFile } from "./ignore-file";

export type InitTplProps = {
  packageManager?: PackageManagerType;
  framework?: FrameworkType;
  projectInfo?: any;
};
const run = async (props: InitTplProps) => {
  // 无package.json 创建
  const { framework = "react", packageManager = "npm", projectInfo = {} } = props;

  const projectRoot = path.join(process.cwd(), projectInfo?.projectName || "");

  try {
    // 初始化 .gitignore
    await ignoreFile(projectRoot);

    // // 更新 package.json 信息
    // updatePackageJSON(framework, projectInfo, projectRoot);
    // //创建 eslint prettier styleline 文件
    // await initFile(framework, projectRoot);

    // addDependencies(packageManager, framework, projectRoot);

    // initHusky(packageManager, projectRoot);

    // initCache(projectRoot);

    //安装依赖包
  } catch (e) {
    console.log(e);
  }
};

export default run;
