import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { winPath } from '../utils';

export const baseExports = './src/.qps/exports.ts';

export const createFolderCache = (projectRoot = process.cwd()) => {
  const path = winPath(join(projectRoot, './src/.qps/'));
  mkdirSync(path, { recursive: true });
};

export const getTmpCode = () => {
  const list = [
    `export {RouterProvider} from './plugin-router/runtime'`,
    `export {createSearchParams, generatePath, matchPath, matchRoutes, Navigate, NavLink, Outlet, resolvePath, useLocation, useMatch, useNavigate, useOutlet, useOutletContext, useParams, useResolvedPath, useRoutes, useSearchParams, } from 'react-router-dom';`,
    `export {Provider} from './plugin-models/provider'`,
    `export {useModel} from './plugin-models/use-model'`,
  ];
  return list.join('\n');
};

export const createExports = (projectRoot = process.cwd()) => {
  const path = join(projectRoot, baseExports);
  writeFileSync(path, getTmpCode());
};

//创建虚拟目录
export const initCache = (projectRoot = process.cwd()) => {
  createFolderCache(projectRoot);
  createExports(projectRoot);
};
