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

export const ESLINT_TS_DEPS = { "@typescript-eslint/eslint-plugin": "^7.5.0" };
export const REACT_ESLINT_DEPS = {
  "eslint-plugin-react": "^7.34.1",
  "eslint-plugin-react-hooks": "^4.6.0",
  husky: "^8.0.3",
  less: "^4.2.0",
  "@ebonex/eslint-plugin-usestate-order": "^1.0.0",
};
export const VUE_ESLINT_DEPS = {
  "eslint-plugin-vue": "latest",
  "vue-eslint-parser": "latest",
  husky: "^8.0.3",
  less: "^4.2.0",
  "@babel/eslint-parser": "latest",
};

export const COMMIT_LINT = {
  "@commitlint/cli": "^19.2.1",
  "@commitlint/config-conventional": "^19.1.0",
  "@commitlint/config-validator": "^19.0.3",
};

export const PRETTIER_LINT = {
  prettier: "^3.2.5",
  "prettier-plugin-organize-imports": "^3.2.4",
  "prettier-plugin-packagejson": "^2.4.14",
};
export const STYLE_LINT = {
  stylelint: "^16.3.1",
  "stylelint-config-standard": "^36.0.0",
  "stylelint-less": "^3.0.1",
  "stylelint-order": "^6.0.4",
  "postcss-less": "^6.0.0",
};

export const REACT_COMPONENT = { "react-router-dom": "^6.22.3", "@ebonex/qps": "^0.3.23" };
