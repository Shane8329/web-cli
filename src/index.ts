import { Command } from "commander";
import { serve, build, preview } from "./vite";
import { getPkg } from "./utils";

export const run = () => {
  console.log("--------------web-cli--------------");
  const pkg = getPkg();

  const program = new Command();

  program.version(pkg?.version, "-V, --version", "查看版本");

  program.command("build").description("cli build").action(build);

  program.command("serve").description("cli serve").action(serve);
  program.command("preview").description("cli preview").action(preview);

  program.parse(process.argv);
};
