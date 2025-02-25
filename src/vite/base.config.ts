import cssModule from "../plugins/rollup-plugin-css-module";
import react from "../plugins/vite-plugin-react";

export default () => {
  return {
    plugins: [cssModule(), ...react()],

    resolve: {
      alias: {
        "@": "/src/",
      },
    },
  };
};
