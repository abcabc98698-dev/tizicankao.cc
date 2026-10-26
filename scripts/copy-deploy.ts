import * as fs from 'fs';
import * as path from 'path';

export function copyDeployAssets(): void {
  const src = path.resolve(process.cwd(), 'deploy/.htaccess');
  const dest = path.resolve(process.cwd(), 'dist/.htaccess');

  if (fs.existsSync(src) && fs.existsSync(path.dirname(dest))) {
    fs.copyFileSync(src, dest);
    console.log('[DEPLOY] Copied deploy/.htaccess to dist/.htaccess');
  }
}

if (process.argv[1] && process.argv[1].endsWith('copy-deploy.ts')) {
  copyDeployAssets();
}
