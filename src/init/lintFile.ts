import createFile from './createFile';
import { CreateFileType, FrameworkType } from './typings';

const fileList = [
  {
    type: 'eslint',
    configExt: '.cjs',
    saveExt: '.cjs',
  },
  {
    type: 'commitlint',
    saveExt: '.cjs',
  },
  {
    type: 'prettier',
    saveExt: '.cjs',
  },
  {
    type: 'npm',
    configExt: '',
    saveExt: '',
  },
];
export default async function initFile(framework: FrameworkType, projectRoot) {
  let files = [...fileList];

  if (framework !== 'node') {
    files = [
      ...files,
      {
        type: 'stylelint',
        saveExt: '.cjs',
      },
    ];
  }

  const promiseList = (files as CreateFileType[]).map((item) => {
    return createFile(item, framework, projectRoot);
  });

  try {
    await Promise.all(promiseList);
    console.log('create file success!');
  } catch (e) {
    console.error(e);
    throw new Error(`create file error ${e.toString()}`);
  }
}
