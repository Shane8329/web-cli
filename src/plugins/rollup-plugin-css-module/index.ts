/**
 * auto CSS Module
 * math the imported style file and add flag for cssModule.
 */
function autoCSSModulePlugin() {
  return {
    name: "rollup-auto-css-module",
    transform(code) {
      let result = code;
      const REG_EXP =
        /(import\s+[a-z]+\s+from\s+["'](?:(?!module\.less)\S)+\.(css|less|sass|scss|styl|stylus))(["'])/;

      if (code.match(REG_EXP)) {
        result = code.replace(REG_EXP, (...arg) => {
          const [, $2, , $4] = arg;
          return `${$2}?.module.css${$4}`;
        });
      }
      return {
        code: result,
        map: null,
      };
    },
  };
}

export { autoCSSModulePlugin as default };
