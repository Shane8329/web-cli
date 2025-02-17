import { build as viteBuild } from 'vite';
import baseConfig from './base.config.ts'

async function build() {
   viteBuild(baseConfig());
}
export default build;
