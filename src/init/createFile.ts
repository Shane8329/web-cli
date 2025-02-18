import fs from 'fs-extra';
import merge from 'merge';
import path from 'node:path';
import { toStringify } from '../utils/index';
import request from '../utils/request';
import { CreateFileType, FrameworkType } from './typings';

const configUrl = {
  eslint: 'http://pipeline.ebonex.io/api/cms/publish/content?chunkId=17&env=3',
  stylelint:
    'http://pipeline.ebonex.io/api/cms/publish/content?chunkId=18&env=3',
  prettier:
    'http://pipeline.ebonex.io/api/cms/publish/content?chunkId=19&env=3',
  commitlint:
    'http://pipeline.ebonex.io/api/cms/publish/content?chunkId=79&env=3',
};
async function downloadFile(path: string) {
  const res: any = await request(path);
  if (res?.data) {
    return JSON.parse(JSON.stringify(res?.data));
  }
  return null;
}
// 创建文件
export default async function createFile(
  { type, configExt = '.json', saveExt = '.cjs' }: CreateFileType,
  framework?: FrameworkType,
  projectRoot = process.cwd(),
) {
  let content = '';
  let data = null;

  if (configUrl?.[type]) {
    console.log(`download ${type} config`);
    data = await downloadFile(configUrl?.[type]);
  }
  if (type === 'eslint') {
    let config = {};
    if (!data) {
      const eslintPath = path.join(__dirname, './config/eslint.cjs');
      config = (await require(eslintPath))?.[framework];
      content = toStringify(config);
    } else {
      const base = data?.base;
      const frameworkByConfig = data?.[framework];
      config = merge(base, frameworkByConfig);
    }
    content = toStringify(config);
  } else {
    if (!data) {
      content = fs.readFileSync(
        path.join(__dirname, `./config/${type}${configExt}`),
        'utf-8',
      );
    } else {
      content = toStringify(data);
    }
  }

  if (saveExt === '.cjs' || saveExt === '.js') {
    content = `module.exports = ${content}`;
  }

  fs.writeFileSync(path.join(projectRoot, `.${type}rc${saveExt}`), content);
}
