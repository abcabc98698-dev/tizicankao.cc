import * as fs from 'fs';
import * as path from 'path';

export function copyDeployAssets(): void {
  // 1. 同步 Apache .htaccess
  const htaccessSrc = path.resolve(process.cwd(), 'deploy/.htaccess');
  const htaccessDest = path.resolve(process.cwd(), 'dist/.htaccess');

  if (fs.existsSync(htaccessSrc) && fs.existsSync(path.dirname(htaccessDest))) {
    fs.copyFileSync(htaccessSrc, htaccessDest);
    console.log('[DEPLOY] Copied deploy/.htaccess to dist/.htaccess');
  }

  // 2. 同步 site/public 资产 (robots.txt, favicon.ico 等) 至 dist
  const publicDir = path.resolve(process.cwd(), 'site/public');
  const distDir = path.resolve(process.cwd(), 'dist');

  if (fs.existsSync(publicDir) && fs.existsSync(distDir)) {
    const files = fs.readdirSync(publicDir);
    for (const file of files) {
      const srcFile = path.join(publicDir, file);
      const destFile = path.join(distDir, file);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
      }
    }
    console.log('[DEPLOY] Synced site/public assets (robots.txt, favicon, etc.) to dist');
  }
}

if (process.argv[1] && process.argv[1].endsWith('copy-deploy.ts')) {
  copyDeployAssets();
}
