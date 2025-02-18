import spawn from 'cross-spawn';
import {
  COMMIT_LINT,
  ESLINT_TS_DEPS,
  PRETTIER_LINT,
  REACT_COMPONENT,
  REACT_ESLINT_DEPS,
  STYLE_LINT,
  VUE_ESLINT_DEPS,
} from './deps-config';
import { FrameworkType, PackageManagerType } from './typings';

export default function addDependencies(
  packageManager: PackageManagerType,
  framework: FrameworkType,
  projectRoot = process.cwd(),
) {
  //获取eslint-config-ebonex deps
  const result = spawn.sync(
    'npm',
    ['show', '@ebonex/eslint-config-qps', '--json', 'peerDependencies'],
    { cwd: projectRoot, encoding: 'utf8' },
  );
  const peerDependenciesStr = result?.stdout?.toString();
  const peerDependencies = JSON.parse(peerDependenciesStr || {});
  let deps = Object.keys(peerDependencies).map((item) => `${item}@latest`);
  deps = ['@ebonex/eslint-config-qps@latest'];

  if (framework === 'react') {
    deps = [...deps, ...REACT_ESLINT_DEPS, ...REACT_COMPONENT];
  }

  if (framework === 'vue2' || framework === 'vue3') {
    deps = [...deps, ...VUE_ESLINT_DEPS];
  }

  if (framework !== 'node') {
    deps = [...deps, 'lint-staged@latest', ...STYLE_LINT];
  }

  if (framework === 'vue2' || framework === 'vue3') {
    deps = [...deps, ...ESLINT_TS_DEPS];
  }

  // todo:判断安装不同的规范
  deps = [...deps, ...COMMIT_LINT, ...PRETTIER_LINT];

  const installCmd = packageManager === 'yarn' ? 'add' : 'install';
  const legacy = packageManager === 'npm' ? '--legacy-peer-deps' : '';
  console.log(projectRoot);
  spawn.sync(packageManager, [installCmd, '-D', legacy].concat(deps), {
    cwd: projectRoot,
    stdio: 'inherit',
  });
}
