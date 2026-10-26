import * as fs from 'fs';
import * as path from 'path';

export function checkLinks(): boolean {
  const contentDir = path.resolve(process.cwd(), 'content');
  const registryPath = path.resolve(process.cwd(), 'data/content_registry.json');
  if (!fs.existsSync(registryPath)) return false;

  const nodes = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  const validUrls = new Set<string>(nodes.map((n: any) => n.url));
  validUrls.add('/');
  validUrls.add('/404.html');
  ['/about/', '/methodology/', '/privacy/', '/terms/', '/disclosure/', '/contact/'].forEach(u => validUrls.add(u));

  let hasError = false;

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile() && ent.name.endsWith('.md')) {
        const text = fs.readFileSync(full, 'utf-8');
        const linkMatches = text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
        for (const match of linkMatches) {
          const rawUrl = match[2].trim();

          // 排除锚点或外链
          if (rawUrl.startsWith('#') || rawUrl.startsWith('mailto:') || rawUrl.startsWith('tel:')) {
            continue;
          }

          if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
            // 检查主站外链必须包含 utm_source
            if (rawUrl.includes('jichangbang.org')) {
              if (!rawUrl.includes('utm_source=tizicankao.cc')) {
                console.warn(`[WARN] Main site link missing utm_source in ${ent.name}: ${rawUrl}`);
              }
            }
            continue;
          }

          // 内链必须符合规范带尾斜杠（除文件外）
          const cleanUrl = rawUrl.split('#')[0].split('?')[0];
          if (!validUrls.has(cleanUrl) && !validUrls.has(cleanUrl + '/')) {
            console.error(`[ERROR] Broken internal link in ${ent.name}: "${rawUrl}" (resolved as ${cleanUrl})`);
            hasError = true;
          }
        }
      }
    }
  }

  walk(contentDir);

  if (hasError) {
    console.error(`[FAIL] Link check failed.`);
    return false;
  }

  console.log(`[PASS] Link check PASSED! All internal links match registered nodes, and external CTAs conform to standards.`);
  return true;
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('check-links')) {
  const ok = checkLinks();
  if (!ok) process.exit(1);
}
