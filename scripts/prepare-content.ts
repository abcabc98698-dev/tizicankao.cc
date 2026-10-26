import * as fs from 'fs';
import * as path from 'path';

export function prepareContent(): { publishedCount: number; scaffoldCount: number } {
  const contentDir = path.resolve(process.cwd(), 'content');
  const generatedDir = path.resolve(process.cwd(), 'site/generated');
  const registryPath = path.resolve(process.cwd(), 'data/content_registry.json');

  if (!fs.existsSync(registryPath)) {
    console.error(`[ERROR] content_registry.json not found.`);
    return { publishedCount: 0, scaffoldCount: 0 };
  }

  const nodes: any[] = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  const publishedMap = new Map<string, any>();
  const allNodesMap = new Map<string, any>();

  for (const n of nodes) {
    allNodesMap.set(n.url, n);
    if (n.status === 'published') {
      publishedMap.set(n.url, n);
    }
  }

  console.log(`[PREPARE] Total nodes: ${nodes.length}, Published whitelist: ${publishedMap.size}`);

  // 安全清理 site/generated 目录，严禁影响 site/.vitepress
  if (fs.existsSync(generatedDir)) {
    fs.rmSync(generatedDir, { recursive: true, force: true });
  }
  fs.mkdirSync(generatedDir, { recursive: true });

  let copiedCount = 0;

  // 1. 优先复制 content/ 目录中已发布且通过审计的文件
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

        const isSupportPage = ['/about/', '/methodology/', '/privacy/', '/terms/', '/disclosure/', '/contact/'].includes(pageUrl);
        if (publishedMap.has(pageUrl) || isSupportPage) {
          const dest = path.join(generatedDir, rel);
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.copyFileSync(full, dest);
          copiedCount++;
        }
      }
    }
  }

  walk(contentDir);

  // 2. 为未发布的规划节点智能生成“编撰规划导引页”，彻底根绝全站任何 404
  let scaffoldCount = 0;
  for (const node of nodes) {
    let relPath = node.url === '/' ? 'index.md' : node.url.replace(/^\//, '') + 'index.md';
    const dest = path.join(generatedDir, relPath);

    if (!fs.existsSync(dest)) {
      const inScopeList = (node.inScope || []).map((s: string) => `- ${s}`).join('\n');
      const outOfScopeList = (node.outOfScope || []).map((s: string) => `- ${s}`).join('\n');

      const scaffoldDoc = `---
title: ${node.title}（方案规划与编撰中）
description: ${node.intent || '梯子参考技术方案库规划节点'}
head:
  - - meta
    - name: robots
      content: noindex, follow
---

# ${node.title}

<AnswerFirst
  verdict="本技术节点已正式纳入梯子参考（tizicankao.cc）560 规划知识图谱，当前处于实验室材料审计与客观事实核验阶段。本指南将严格依据真实物理网络测试展开，杜绝虚假参数与软文灌水。"
  appliesTo="正在寻找该特定场景、客户端或排障解决方案的桌面与移动端用户。"
  prerequisites="可先查阅已发布的关联主专题或已跑通的核心链路长文。"
  boundaries="在正文正式上线前，您可参考相关主专题或前往选购主站机场榜一查阅实时品牌数据。"
  verifiedDate="规划编撰中"
/>

## 一、方案规划与核心解答目标

- **本节点唯一规划编号**：\`${node.id}\`
- **节点类型**：\`${node.type}\` ｜ **所属主专题**：\`${node.hubId}\`
- **技术解决意图**：${node.intent || '解决具体网络选型与客户端使用问题'}
- **核心待解答问题**：${node.primaryQuestion || node.title}

### 覆盖技术范畴 (In Scope)
${inScopeList || '- 真实任务与技术指标匹配\n- 客观数据证据与参数对照'}

### 严格排除范畴 (Out of Scope)
${outOfScopeList || '- 泛泛而谈\n- 虚构测试数据\n- 商业推销'}

---

## 二、当前已就绪的关联旗舰指南推荐

如果您急需相关实操资料，推荐直接查阅梯子参考实验室已全量审计通过的核心链路：

- **选型总入口**：[梯子怎么选：基于真实任务、预算与设备约束的科学选型指南](/choose/)
- **需求与预算**：[查网页、看轻度视频与重度办公的梯子预算与配置基线](/choose/browsing-task-budget/)
- **电脑平台方案**：[Windows不同版本与CPU架构下的代理客户端选择](/desktop/windows-cpu-packages/)
- **客户端官方源**：[Clash Verge Rev发布页怎样阅读：版本、安装包与更新说明](/clients/verge-rev-official-release/)
- **完整安装教程**：[Clash Verge Rev安装到首次启动：前提、权限与完成检查](/guides/guide-install-verge-rev/)
- **本地网络排障**：[提示端口已被占用时，怎样定位占用进程而不盲目结束系统服务？](/troubleshooting/error-port-in-use/)

<MainSiteCTA
  title="需要立即横向对比各服务商最新真实测速数据与套餐？"
  description="梯子参考专注于通用选型逻辑与客户端配置教学。若您需要查看各品牌的实时晚高峰测速、机房拓扑、月付价格横向大对比及优惠码，请移步唯一选购主站。"
  buttonText="前往 机场榜一 选购中心 ↗"
  routeKey="recommend"
  placement="scaffold_fallback"
/>
`;
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, scaffoldDoc, 'utf-8');
      scaffoldCount++;
    }
  }

  // 3. 写入标准的 404.md 页面
  const notFoundContent = `---
title: 404 - 页面未找到
layout: page
---

# 404：您访问的指南或页面不存在

抱歉，您请求的链接可能已被更名、归档或暂未发布。

- 返回 [梯子参考首页](/)
- 查阅 [梯子怎么选选型指南](/choose/)
- 查阅 [端口已被占用排障指南](/troubleshooting/error-port-in-use/)
- 使用顶部搜索框直接检索软件或具体错误代码

<Disclosure title="HTTP 404 状态说明" text="本站静态部署于 Apache 服务器，提供标准 404.html 响应码与自适应导航，杜绝盲目重定向至首页造成收录混乱。" />
`;
  fs.writeFileSync(path.join(generatedDir, '404.md'), notFoundContent, 'utf-8');

  // 4. 写入静态资产 robots.txt 并同步 site/public 资产至 site/generated
  const robotsTxt = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: yisouspider
Allow: /

User-agent: *
Allow: /

Sitemap: https://tizicankao.cc/sitemap.xml
`;
  const staticRobotsPath = path.resolve(process.cwd(), 'site/public/robots.txt');
  fs.mkdirSync(path.dirname(staticRobotsPath), { recursive: true });
  fs.writeFileSync(staticRobotsPath, robotsTxt, 'utf-8');

  // 同步 public 资产 (avatar.jpg, favicon.ico 等) 至 generated
  const publicDir = path.resolve(process.cwd(), 'site/public');
  if (fs.existsSync(publicDir)) {
    const pubFiles = fs.readdirSync(publicDir);
    for (const pf of pubFiles) {
      const src = path.join(publicDir, pf);
      if (fs.statSync(src).isFile()) {
        fs.copyFileSync(src, path.join(generatedDir, pf));
      }
    }
  }

  console.log(`[PREPARE] Successfully prepared ${copiedCount} published docs + ${scaffoldCount} intelligent scaffold docs into site/generated.`);
  return { publishedCount: copiedCount, scaffoldCount };
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('prepare-content')) {
  prepareContent();
}
