import { program } from "commander";
import { serve, build, preview } from "./vite";
import { getPkg } from "./utils";
import init from "./init";
export const run = () => {
  console.log("--------------web-cli--------------");
  const pkg = getPkg();

  program.version(pkg?.version, "-V, --version", "查看版本");

  program
    .command("init")
    .description("模板选择")
    .option("-tpl, --template <templateName>", "模板名称")
    .action(function (cmd) {
      init(cmd?.template);
    });

  program.command("build").description("cli build").action(build);

  program.command("serve").description("cli serve").action(serve);
  program.command("preview").description("cli preview").action(preview);

  program.parse(process.argv);
};
