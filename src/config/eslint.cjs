const base = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
};
const basePackage = '@ebonex/eslint-config-qps';

module.exports = {
  base: Object.assign({}, base, {
    extends: [basePackage],
  }),
  node: Object.assign({}, base, {
    extends: [basePackage, `${basePackage}/typescript`],
  }),
  react: Object.assign({}, base, {
    extends: [`${basePackage}/react`, `${basePackage}/typescript`],
  }),
  vue: Object.assign({}, base, {
    extends: [`${basePackage}/vue`],
  }),
};
