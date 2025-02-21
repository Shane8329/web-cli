import { PackageJson } from "type-fest";
import { FrameworkType } from "./typings";
import fs from "fs-extra";
import { findPackageJson, toStringify } from "../utils";
import path from "node:path";
import {
  COMMIT_LINT,
  PRETTIER_LINT,
  REACT_DEPS,
  STYLE_LINT,
  TYPESCRIPT,
  VITE_DEPS,
  VUE_ESLINT_DEPS,
} from "./config";

function getEslintExt(framework: FrameworkType) {
  let ext = ".js,.ts";

  if (framework === "vue2" || framework === "vue3") {
    ext += ",.vue";
  }

  if (framework === "react") {
    ext += ",jsx,.tsx";
  }

  return ext;
}

//更新package.json
export default function updatePackageJSON(framework: FrameworkType, projectInfo, projectRoot) {
  const str = findPackageJson(projectRoot);
  const pkg = JSON.parse(str) as PackageJson;

  let styleFileType = "css,less,scss";

  if (framework === "vue2" || framework === "vue3") {
    styleFileType += ",vue";
  }

  pkg.name = projectInfo?.projectName ?? undefined;
  pkg.version = projectInfo?.version ?? undefined;
  pkg.author = projectInfo?.author ?? undefined;

  const scripts = [
    {
      name: "lint:fix",
      cmd: `npm run eslint ${framework !== "node" ? "&& npm run stylelint" : ""}`,
    },
    {
      name: "eslint",
      cmd: `eslint -c ./.eslintrc.cjs --ext ${getEslintExt(framework)}`,
    },
    {
      name: "prettier",
      cmd: `prettier --write --ignore-unknown`,
    },
    {
      name: "lint-staged",
      cmd: "lint-staged",
    },
    {
      name: "prepare",
      cmd: "husky install",
    },
  ];

  if (framework !== "node") {
    scripts.push({
      name: "stylelint",
      cmd: `stylelint **/*.{${styleFileType}}`,
    });
  }

  scripts.forEach((script) => {
    // 更新命令
    const { name, cmd } = script;
    pkg.scripts ||= {};
    pkg.scripts[name] = cmd;
  });

  pkg["lint-staged"] = {
    [`./**/*{${getEslintExt(framework)}}`]: ["npm run eslint"],
    "./**/*": ["npm run prettier"],
  };

  if (framework !== "node") {
    pkg["lint-staged"][`./**/*.{${styleFileType}}`] = ["npm run stylelint"];
  }

  let deps = { "@ebonex/eslint-config-qps": "^0.0.4" };

  if (framework === "react") {
    deps = { ...deps, ...REACT_DEPS };
  }

  if (framework === "vue2" || framework === "vue3") {
    deps = { ...deps, ...VUE_ESLINT_DEPS };
  }

  if (framework !== "node") {
    deps = { ...deps, "lint-staged": "latest", ...STYLE_LINT };
  }

  // todo:判断安装不同的规范
  pkg.devDependencies = {
    ...(pkg.devDependencies || {}),
    ...COMMIT_LINT,
    ...PRETTIER_LINT,
    ...TYPESCRIPT,
    ...VITE_DEPS,
    ...deps,
  };

  const packagePath = path.join(projectRoot, "package.json");

  fs.writeFileSync(packagePath, toStringify(pkg));
}
