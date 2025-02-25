import react from "@vitejs/plugin-react";
import cssModule from "../plugins/rollup-plugin-css-module";

export default () => {
  return {
    plugins: [cssModule()],

    resolve: {
      alias: {
        "@": "/src/",
      },
    },
  };
};
