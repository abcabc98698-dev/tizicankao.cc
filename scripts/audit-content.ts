import * as fs from 'fs';
import * as path from 'path';

export interface AuditResult {
  filePath: string;
  url: string;
  totalChars: number;
  zhCharCount: number;
  isEligible: boolean;
  targetCount: number;
  warnings: string[];
}

/**
 * 严格按照 zhCharCount 口径计算有效汉字
 * 排除：
 * 1. YAML frontmatter (--- ... ---)
 * 2. 代码块 (``` ... ```)
 * 3. 行内代码 (`...`)
 * 4. HTML/Vue 组件标签及属性 (<Component ... />, <div ...>)
 * 5. Markdown 链接 URL 部分 [text](url)
 * 6. 图片 ![]()
 * 7. 纯英文、数字、标点符号
 * 仅统计真正呈现给读者的中文字符: [\u4e00-\u9fa5]
 */
export function countValidChineseCharacters(markdownContent: string): { zhCount: number; cleanText: string } {
  let cleaned = markdownContent;

  // 1. 移除 YAML frontmatter
  cleaned = cleaned.replace(/^---[\s\S]*?---\n*/m, '');

  // 2. 移除围栏代码块
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

  // 3. 移除行内代码
  cleaned = cleaned.replace(/`[^`]+`/g, '');

  // 4. 移除 Markdown 图片
  cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, '');

  // 5. 替换 Markdown 链接，只保留链接文字 [text](url) -> text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 6. 移除 HTML/Vue 组件闭合和自闭合标签 <Tag ...> 或 </Tag>
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // 7. 统计中文字符匹配
  const matches = cleaned.match(/[\u4e00-\u9fa5]/g);
  const zhCount = matches ? matches.length : 0;

  return { zhCount, cleanText: cleaned };
}

export function auditAllContent(): { results: AuditResult[]; totalZhCount: number; passed: boolean } {
  const contentDir = path.resolve(process.cwd(), 'content');
  const registryPath = path.resolve(process.cwd(), 'data/content_registry.json');

  if (!fs.existsSync(registryPath)) {
    console.error(`Registry not found: ${registryPath}`);
    return { results: [], totalZhCount: 0, passed: false };
  }

  const nodes = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  const nodeMap = new Map<string, any>(nodes.map((n: any) => [n.url, n]));

  const results: AuditResult[] = [];
  let totalZhCount = 0;
  let allPassed = true;

  function walkDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walkDir(fullPath);
      } else if (ent.isFile() && ent.name.endsWith('.md')) {
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const { zhCount } = countValidChineseCharacters(raw);

        // 计算对应的 URL
        const rel = path.relative(contentDir, fullPath).replace(/\\/g, '/');
        let pageUrl = '/' + rel.replace(/index\.md$/, '');
        if (!pageUrl.endsWith('/')) pageUrl += '/';
        if (pageUrl === '//') pageUrl = '/';

        const matchedNode = nodeMap.get(pageUrl);
        const targetCount = matchedNode ? matchedNode.wordTarget : 10000;
        const status = matchedNode ? matchedNode.status : 'unknown';

        const warnings: string[] = [];

        // 仅对 published 状态执行严苛达标校验
        if (status === 'published') {
          if (zhCount < 10000) {
            warnings.push(`字数未达标：实际有效汉字 ${zhCount} < 最低门槛 10,000 字`);
            allPassed = false;
          }
        }

        totalZhCount += zhCount;

        results.push({
          filePath: rel,
          url: pageUrl,
          totalChars: raw.length,
          zhCharCount: zhCount,
          isEligible: zhCount >= targetCount,
          targetCount,
          warnings
        });
      }
    }
  }

  walkDir(contentDir);

  // 回写 PROGRESS.json
  const progressPath = path.resolve(process.cwd(), 'PROGRESS.json');
  if (fs.existsSync(progressPath)) {
    const progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
    progress.zhCharStats = {
      totalEligibleChars: totalZhCount,
      publishedPages: results.filter(r => r.zhCharCount >= 10000).length,
      averageCharsPerPage: results.length > 0 ? Math.round(totalZhCount / results.length) : 0
    };
    progress.updatedAt = new Date().toISOString();
    fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2), 'utf-8');
  }

  return { results, totalZhCount, passed: allPassed };
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('audit-content')) {
  console.log(`[AUDIT] Starting zhCharCount content audit...`);
  const { results, totalZhCount, passed } = auditAllContent();
  console.log(`[AUDIT] Audited ${results.length} markdown documents.`);
  console.log(`[AUDIT] Total valid Chinese characters: ${totalZhCount.toLocaleString('zh-CN')}`);

  for (const r of results) {
    if (r.warnings.length > 0) {
      console.warn(`[WARN] ${r.url} (${r.filePath}): ${r.zhCharCount} 汉字 | ${r.warnings.join('; ')}`);
    } else {
      console.log(`[OK] ${r.url}: ${r.zhCharCount.toLocaleString('zh-CN')} 汉字 (目标: ${r.targetCount})`);
    }
  }

  if (!passed) {
    console.error(`[FAIL] Audit failed: Some published pages do not meet the 10,000 Chinese character threshold.`);
    process.exit(1);
  } else {
    console.log(`[PASS] All audited published pages satisfy depth requirements.`);
  }
}
