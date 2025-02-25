import react from "@vitejs/plugin-react";
import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import babelPluginAccess from "./babel-plugin-access";
function pluginReact() {
  const path = process.cwd() + `/src/.jay/plugin-react-runtime/`;

  const reactRuntime = {
    name: "vite-plugin-react",
    enforce: "pre",
    config(_: any, env: any) {
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
      //TODO： react build  还是引用了jsx-dev-runtime这个路径
      const codeDEV = `
      export { Fragment } from "react";

      import * as jsxRuntime from 'react/jsx-runtime';

      // 拿到 React 原始的 jsxRuntime 方法，包括 jsx 和 jsxs 
      // 注: 对于一些静态节点，React 会使用 jsxs 来进行创建，优化渲染性能
      const originJsx = jsxRuntime.jsx;
      const originJsxs = jsxRuntime.jsxs;
      
      const internalJsx = (jsx, type, props, ...args) => {
        // 如果发现有 _access 这个 prop
        if (props && props?.['data-if']!==null&&props?.['data-if']!==undefined) {
          if(!props?.['data-if']){
             return null
          }
          delete props?.['data-if'];
        }
        // 否则走原始的 jsx/jsxs 方法
        return jsx(type, props, ...args);
      };
      // 下面是我们自定义的 jsx 和 jsxs
      export const jsxDEV = (...args) => internalJsx(originJsx, ...args);
      export const jsxsDEV = (...args) => internalJsx(originJsxs, ...args);
      `;
      const code = `
      export { Fragment } from "react";

      import * as jsxRuntime from 'react/jsx-runtime';

      // 拿到 React 原始的 jsxRuntime 方法，包括 jsx 和 jsxs 
      // 注: 对于一些静态节点，React 会使用 jsxs 来进行创建，优化渲染性能
      const originJsx = jsxRuntime.jsx;
      const originJsxs = jsxRuntime.jsxs;
      
      const internalJsx = (jsx, type, props, ...args) => {
        // 如果发现有 _access 这个 prop
        if (props && props?.['data-if']!==null&&props?.['data-if']!==undefined) {
          if(!props?.['data-if']){
             return null
          }
          delete props?.['data-if'];
        }
        // 否则走原始的 jsx/jsxs 方法
        return jsx(type, props, ...args);
      };
      // 下面是我们自定义的 jsx 和 jsxs
      export const jsx = (...args) => internalJsx(originJsx, ...args);
      export const jsxs = (...args) => internalJsx(originJsxs, ...args);
      `;
      writeFile(join(path, "./jsx-dev-runtime.js"), codeDEV);
      writeFile(join(path, "./jsx-runtime.js"), code);
    },
  };

  return [
    reactRuntime,
    react({
      jsxRuntime: "automatic",
      include: /\.(js|ts|jsx|tsx)$/,
      jsxImportSource: join(process.cwd(), "/src/.jay/plugin-react-runtime"),
      babel() {
        return {
          plugins: [babelPluginAccess],
        };
      },
    }),
  ];
}

export default pluginReact;
