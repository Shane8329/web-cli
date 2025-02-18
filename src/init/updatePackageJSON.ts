import { PackageJson } from 'type-fest';
import {
  findPackageJson,
  updatePackage,
  updateScript,
} from '../utils/npm-package';
import { FrameworkType } from './typings';

export function getEslintExt(framework: FrameworkType) {
  let ext = '.js,.ts';

  if (framework === 'vue2' || framework === 'vue3') {
    ext += ',.vue';
  }

  if (framework === 'react') {
    ext += ',jsx,.tsx';
  }

  return ext;
}

//更新package.json
export default function updatePackageJSON(
  framework: FrameworkType,
  projectInfo,
  projectRoot,
) {
  const str = findPackageJson(projectRoot);
  const pkg = JSON.parse(str) as PackageJson;

  let styleFileType = 'css,less,scss';
  if (framework === 'vue2' || framework === 'vue3') {
    styleFileType += ',vue';
  }

  if (projectInfo?.projectName) {
    pkg.name = projectInfo?.projectName;
  }

  if (projectInfo?.version) {
    pkg.version = projectInfo?.version;
  }
  if (projectInfo?.author) {
    pkg.author = projectInfo?.author;
  }
  const cmdList = [
    {
      name: 'lint:fix',
      cmd: `npm run eslint ${
        framework !== 'node' ? '&& npm run stylelint' : ''
      }`,
    },
    {
      name: 'eslint',
      cmd: `eslint -c ./.eslintrc.cjs --ext ${getEslintExt(framework)}`,
    },
    {
      name: 'prettier',
      cmd: `prettier --write --ignore-unknown`,
    },
    {
      name: 'lint-staged',
      cmd: 'lint-staged',
    },
    {
      name: 'prepare',
      cmd: 'husky install',
    },
  ];

  if (framework !== 'node') {
    cmdList.push({
      name: 'stylelint',
      cmd: `stylelint **/*.{${styleFileType}}`,
    });
  }

  updateScript(pkg, cmdList);

  pkg['lint-staged'] = {
    [`./**/*{${getEslintExt(framework)}}`]: ['npm run eslint'],
    './**/*': ['npm run prettier'],
  };

  if (framework !== 'node') {
    pkg['lint-staged'][`./**/*.{${styleFileType}}`] = ['npm run stylelint'];
  }

  updatePackage(pkg, projectRoot);
}
