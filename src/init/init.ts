import path from "node:path";
import initLint from "./init-lint";
import { FrameworkType, PackageManagerType, projectInfo } from "./typings";
import updatePackageJSON from "./init-package";
import initGit from "./init-git";

export type InitTplProps = {
  packageManager?: PackageManagerType;
  framework?: FrameworkType;
  projectInfo?: projectInfo;
};
const run = async (props: InitTplProps) => {
  const { framework = "react", packageManager = "npm", projectInfo } = props;

  const projectRoot = path.join(process.cwd(), projectInfo?.projectName || "");

  try {
    // 初始化 git | .gitignore
    await initGit(projectRoot);

    // // 更新 package.json name |version |dependencies相关初始化
    updatePackageJSON(framework, projectInfo, projectRoot);
    // //创建 eslint |prettier |stylelint 文件
    await initLint(framework, projectRoot);

    //安装依赖包
  } catch (e) {
    console.log(e);
  }
};

export default run;
