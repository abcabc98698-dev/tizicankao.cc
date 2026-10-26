import * as fs from 'fs';
import * as path from 'path';

interface ContentNode {
  id: string;
  type: string;
  title: string;
  url: string;
  parentId: string | null;
  hubId: string | null;
  wordTarget: number;
  status: string;
}

export function validatePlan(): boolean {
  const registryPath = path.resolve(process.cwd(), 'data/content_registry.json');
  if (!fs.existsSync(registryPath)) {
    console.error(`[ERROR] content_registry.json does not exist at ${registryPath}`);
    return false;
  }

  const nodes: ContentNode[] = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  console.log(`[VALIDATE] Loaded ${nodes.length} nodes from registry.`);

  let hasError = false;

  // 1. 验证总数
  if (nodes.length !== 560) {
    console.error(`[ERROR] Expected 560 nodes, found ${nodes.length}`);
    hasError = true;
  }

  // 2. 验证类型分布
  const counts: Record<string, number> = {};
  for (const n of nodes) {
    counts[n.type] = (counts[n.type] || 0) + 1;
  }
  console.log(`[VALIDATE] Node type distribution:`, counts);

  if (counts['home'] !== 1) {
    console.error(`[ERROR] Expected 1 home node, found ${counts['home']}`);
    hasError = true;
  }
  if (counts['main_topic'] !== 13) {
    console.error(`[ERROR] Expected 13 main_topic nodes, found ${counts['main_topic']}`);
    hasError = true;
  }
  if (counts['sub_topic'] !== 26) {
    console.error(`[ERROR] Expected 26 sub_topic nodes, found ${counts['sub_topic']}`);
    hasError = true;
  }
  if (counts['cluster'] !== 104) {
    console.error(`[ERROR] Expected 104 cluster nodes, found ${counts['cluster']}`);
    hasError = true;
  }
  if (counts['article'] !== 416) {
    console.error(`[ERROR] Expected 416 article nodes, found ${counts['article']}`);
    hasError = true;
  }

  // 3. 验证 ID 唯一性
  const idSet = new Set<string>();
  for (const n of nodes) {
    if (idSet.has(n.id)) {
      console.error(`[ERROR] Duplicate node ID found: ${n.id}`);
      hasError = true;
    }
    idSet.add(n.id);
  }

  // 4. 验证 URL 唯一性与格式
  const urlSet = new Set<string>();
  for (const n of nodes) {
    if (urlSet.has(n.url)) {
      console.error(`[ERROR] Duplicate URL found: ${n.url} for node ${n.id}`);
      hasError = true;
    }
    urlSet.add(n.url);

    if (!n.url.startsWith('/') || !n.url.endsWith('/')) {
      console.error(`[ERROR] URL must start and end with slash: ${n.url} (${n.id})`);
      hasError = true;
    }
  }

  // 5. 验证父子引用与循环依赖
  const nodeMap = new Map<string, ContentNode>(nodes.map(n => [n.id, n]));
  for (const n of nodes) {
    if (n.type === 'home') {
      if (n.parentId !== null) {
        console.error(`[ERROR] Home node must have parentId = null`);
        hasError = true;
      }
      continue;
    }

    if (!n.parentId || !nodeMap.has(n.parentId)) {
      console.error(`[ERROR] Node ${n.id} has invalid parentId: ${n.parentId}`);
      hasError = true;
      continue;
    }

    // 检查循环祖先
    let curr: ContentNode | undefined = nodeMap.get(n.parentId);
    const visited = new Set<string>([n.id]);
    while (curr) {
      if (visited.has(curr.id)) {
        console.error(`[ERROR] Circular parent reference detected at node ${n.id} -> ${curr.id}`);
        hasError = true;
        break;
      }
      visited.add(curr.id);
      curr = curr.parentId ? nodeMap.get(curr.parentId) : undefined;
    }
  }

  if (hasError) {
    console.error(`[FAIL] Plan validation failed with errors.`);
    return false;
  }

  console.log(`[PASS] Plan validation PASSED! Exactly 560 nodes, perfect tree hierarchy, unique URLs, no circular dependencies.`);
  return true;
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('validate-plan')) {
  const ok = validatePlan();
  if (!ok) {
    process.exit(1);
  }
}
