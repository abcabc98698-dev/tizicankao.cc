import * as fs from 'fs';
import * as path from 'path';

export function prepareContent(): { publishedCount: number } {
  const contentDir = path.resolve(process.cwd(), 'content');
  const generatedDir = path.resolve(process.cwd(), 'site/generated');
  const registryPath = path.resolve(process.cwd(), 'data/content_registry.json');

  if (!fs.existsSync(registryPath)) {
    console.error(`[ERROR] content_registry.json not found.`);
    return { publishedCount: 0 };
  }

  const nodes = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  const publishedMap = new Map<string, any>();
  for (const n of nodes) {
    if (n.status === 'published') {
      publishedMap.set(n.url, n);
    }
  }

  console.log(`[PREPARE] Total published nodes in registry whitelist: ${publishedMap.size}`);

  // 安全清理 site/generated 目录，严禁影响 site/.vitepress
  if (fs.existsSync(generatedDir)) {
    fs.rmSync(generatedDir, { recursive: true, force: true });
  }
  fs.mkdirSync(generatedDir, { recursive: true });

  let copiedCount = 0;

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(full);
      } else if (item.isFile() && item.name.endsWith('.md')) {
        const rel = path.relative(contentDir, full).replace(/\\/g, '/');
        let pageUrl = '/' + rel.replace(/index\.md$/, '');
        if (!pageUrl.endsWith('/')) pageUrl += '/';
        if (pageUrl === '//') pageUrl = '/';

        // 仅复制在注册表中白名单且 status === 'published' 的文件
        if (publishedMap.has(pageUrl)) {
          const dest = path.join(generatedDir, rel);
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.copyFileSync(full, dest);
          copiedCount++;
        }
      }
    }
  }

  walk(contentDir);

  // 写入标准的 404.md 页面
  const notFoundContent = `---
title: 404 - 页面未找到
layout: page
---

# 404：您访问的指南或页面不存在

抱歉，您请求的链接可能已被更名、归档或暂未发布。

- 返回 [梯子参考首页](/)
- 查阅 [梯子怎么选选型指南](/choose/)
- 查阅 [网络排障速查库](/troubleshooting/)
- 使用顶部搜索框直接检索软件或具体错误代码

<Disclosure title="HTTP 404 状态说明" text="本站静态部署于 Apache 服务器，提供标准 404.html 响应码与自适应导航，杜绝盲目重定向至首页造成收录混乱。" />
`;
  fs.writeFileSync(path.join(generatedDir, '404.md'), notFoundContent, 'utf-8');

  // 写入静态资产 robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://tizicankao.cc/sitemap.xml
`;
  const staticRobotsPath = path.resolve(process.cwd(), 'site/public/robots.txt');
  fs.mkdirSync(path.dirname(staticRobotsPath), { recursive: true });
  fs.writeFileSync(staticRobotsPath, robotsTxt, 'utf-8');

  console.log(`[PREPARE] Successfully prepared ${copiedCount} published documents into site/generated.`);
  return { publishedCount: copiedCount };
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('prepare-content')) {
  prepareContent();
}
