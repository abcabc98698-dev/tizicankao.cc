import { validatePlan } from './validate-plan.js';
import { countValidChineseCharacters } from './audit-content.js';
import * as fs from 'fs';
import * as path from 'path';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${msg}`);
    passedTests++;
  } else {
    console.error(`  ✕ FAIL: ${msg}`);
    failedTests++;
  }
}

export async function runAllTests() {
  console.log(`[TEST SUITE] Running comprehensive verification...`);

  // 1. 560 规划节点拓扑测试
  console.log(`\nTest Group 1: 560 Node Architecture & Registry`);
  const planOk = validatePlan();
  assert(planOk, 'Full 560-node plan validation passes');

  // 2. zhCharCount 纯汉字计算模型精度测试
  console.log(`\nTest Group 2: zhCharCount Chinese Character Counter`);
  const sampleMd = `---
title: 测试页面
---
# 标题测试

这是一段正文，包含有效汉字。

\`\`\`bash
echo "这里是代码块中的汉字，应该被剔除"
\`\`\`

这里还有\`行内代码中的汉字\`，以及一个[Markdown链接文字](https://example.com/url-with-no-chars)。
<MainSiteCTA title="组件标题" />
`;
  const countRes = countValidChineseCharacters(sampleMd);
  // 正文：这是一段正文包含有效汉字 (12) + 这里还有 (4) + 以及一个 (4) + Markdown链接文字 (6) = 26
  assert(countRes.zhCount > 15 && countRes.zhCount < 35, `Valid Chinese characters properly extracted (found: ${countRes.zhCount})`);

  // 3. 主站白名单路由核验测试
  console.log(`\nTest Group 3: Main Site Routes`);
  const mainRoutesPath = path.resolve(process.cwd(), 'data/main_routes.json');
  assert(fs.existsSync(mainRoutesPath), 'data/main_routes.json exists');
  const mainRoutes = JSON.parse(fs.readFileSync(mainRoutesPath, 'utf-8'));
  assert(mainRoutes.mainSite === 'https://jichangbang.org', 'Main site URL is fixed to https://jichangbang.org');
  assert(Boolean(mainRoutes.verifiedRoutes.recommend), 'Route "recommend" exists');
  assert(Boolean(mainRoutes.verifiedRoutes.pricing), 'Route "pricing" exists');

  // 4. 组件全量注册核验测试
  console.log(`\nTest Group 4: Component Inventory & Design System`);
  const components = [
    'SiteHeader', 'MoreTopicsDropdown', 'MobileNav', 'PagefindSearch',
    'TaskFinder', 'AnswerFirst', 'TopicMatrix', 'ComparisonTable',
    'DecisionTree', 'VersionScope', 'SourceList', 'ClientCard',
    'TrialCard', 'MainSiteCTA', 'Disclosure', 'Breadcrumbs', 'RelatedTasks'
  ];
  for (const comp of components) {
    const compPath = path.resolve(process.cwd(), `site/.vitepress/theme/components/${comp}.vue`);
    assert(fs.existsSync(compPath), `Component ${comp}.vue is implemented`);
  }

  // 5. 总结输出
  console.log(`\n-----------------------------------------`);
  console.log(`Test Execution Summary: ${passedTests} passed, ${failedTests} failed.`);
  if (failedTests > 0) {
    process.exit(1);
  }
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('test-runner')) {
  runAllTests();
}
