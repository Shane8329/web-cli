export const tpls = [
  {
    name: "React + TypeScript + Vite",
    url: "https://gitlab-front.ebonex.io/api/v4/projects/350/repository/archive.zip",
  },
];

export const questions = [
  {
    type: "input",
    name: "projectName",
    prefix: "➜",
    message: "项目名称:",
    validate: function (input) {
      if (input.trim() === "") {
        return "项目名称不能为空，请重新输入";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "version",
    prefix: "➜",
    message: "版本号:",
  },
  {
    type: "input",
    name: "email",
    prefix: "➜",
    message: "邮箱:",
  },
  {
    type: "list",
    name: "bag",
    prefix: "➜",
    message: "包管理源:",
    choices: ["npm", "yarn", "pnpm"],
  },
  {
    type: "input",
    name: "author",
    prefix: "➜",
    message: "作者:",
  },
];

export const lints = [
  {
    type: "eslint",
    saveExt: ".cjs",
  },
  {
    type: "commitlint",
    saveExt: ".cjs",
  },
  {
    type: "prettier",
    saveExt: ".cjs",
  },
  {
    type: "npm",
    saveExt: "",
  },
  {
    type: "stylelint",
    saveExt: ".cjs",
    remove: (framework) => framework === "node",
  },
];
