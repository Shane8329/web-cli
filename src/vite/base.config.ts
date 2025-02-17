import react from "@vitejs/plugin-react";
import babel from '@rollup/plugin-babel';
import less from 'less';

export default  () => {
  return {
    plugins: [
      react(),
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-react"],
        extensions: [".js"], // 指定需要处理的文件扩展名
      }),
    ],

    resolve: {
      alias: {
        '@': '/src/',
      },
    },
  };
};
