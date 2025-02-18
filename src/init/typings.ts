export type FrameworkType = "node" | "react" | "vue2" | "vue3";
export type ConfigExtType = ".js" | ".cjs" | ".json" | "";
export type PackageManagerType = "npm" | "yarn" | "pnpm";
export type CreateFileType = {
  type: string;
  saveExt?: ConfigExtType;
};
export type projectInfo = {
  projectName: string;
  version?: string;
  email?: string;
  bag?: string;
  author?: string;
};
