import type { PluginPass } from "@babel/core";
import { types as t } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";
import type { Visitor } from "@babel/traverse";

export default declare((api) => {
  api.assertVersion(7);
  const hookName = "useAccess";
  const libPath = "@/access";
  const checkFunName = "check";
  const authCheckFunName = "_accessCheck";

  const visitor: Visitor<PluginPass> = {
    Program(path: any) {
      let needImport = true;
      const paths = new Set();

      // 确保我们在顶层路径中处理所有的 JSX 元素
      path.traverse({
        JSXOpeningElement(jsxPath: any) {
          const attributes = jsxPath.container.openingElement.attributes;

          attributes.forEach((attribute: any) => {
            if (
              attribute.type === "JSXAttribute" &&
              attribute?.name?.name === "data-access" &&
              (attribute?.value?.value || attribute?.value?.expression)
            ) {
              debugger;
              // 创建一个新的函数调用表达式
              const funcIdentifier = t.identifier(authCheckFunName);
              const argValue =
                attribute.value.type === "StringLiteral"
                  ? attribute.value.value
                  : attribute.value.expression.value; // 假设 value 是一个表达式或字符串
              const argumentsArray = [t.stringLiteral(argValue)];
              const callExpression = t.callExpression(funcIdentifier, argumentsArray);

              // 替换原来的 value 并更改属性名
              attribute.value = t.jsxExpressionContainer(callExpression);
              attribute.name.name = "data-if";

              const parent = jsxPath.findParent((p) => {
                return (
                  (p.isFunctionExpression() || p.isArrowFunctionExpression()) &&
                  (p.parent.type === "ExportDefaultDeclaration" ||
                    p.parent.type === "ExportNamedDeclaration" ||
                    p.parent.type === "VariableDeclarator")
                );
              });

              if (parent) {
                paths.add(parent);
              }
            }
          });
        },
        ImportSpecifier(path: any) {
          const { node } = path;
          if (node.imported.name === hookName) {
            needImport = false;
          }
        },
      });

      if (paths.size) {
        if (needImport) {
          path.node.body.unshift(
            t.importDeclaration(
              [t.importSpecifier(t.identifier(hookName), t.identifier(hookName))],
              t.stringLiteral(libPath)
            )
          );
        }
        paths.forEach((parentPath: any) => {
          if (parentPath.isFunction()) {
            // 注入新的变量声明
            // 创建 useAccess 调用
            const useAccessCall = t.callExpression(t.identifier(hookName), []);

            // 创建解构赋值的属性（{check: _accessCheck}）
            const checkProperty = t.objectProperty(
              t.identifier(checkFunName),
              t.identifier(authCheckFunName),
              false, // 计算属性（默认为 false）
              true // 简写属性（默认为 false，但对于解构赋值应设为 true）
            );

            // 创建对象解构赋值模式
            const objectPattern = t.objectPattern([checkProperty]);

            // 创建变量声明者
            const variableDeclarator = t.variableDeclarator(objectPattern, useAccessCall);

            // 创建变量声明
            const variableDeclaration = t.variableDeclaration("const", [variableDeclarator]);

            // 添加到函数体的开始处
            parentPath.node.body.body.unshift(variableDeclaration);
          }
        });
      }
    },
  };

  return {
    name: "babel-plugin-access",
    visitor,
  };
});
