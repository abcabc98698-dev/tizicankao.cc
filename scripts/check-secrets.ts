import * as fs from 'fs';
import * as path from 'path';

export function checkSecrets(): boolean {
  const contentDir = path.resolve(process.cwd(), 'content');

  // 常见敏感特征匹配
  const secretPatterns = [
    { name: 'Private Key', regex: /-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----/ },
    { name: 'Raw UUID Token in Link', regex: /[?&]token=[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i },
    { name: 'V2Ray VLESS Password in URI', regex: /vless:\/\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}@(?!(example|127\.0\.0\.1|0\.0\.0\.0))/i },
    { name: 'Suspicious Live API Key', regex: /sk-[a-zA-Z0-9]{32,}/ }
  ];

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
        for (const pat of secretPatterns) {
          if (pat.regex.test(text)) {
            console.error(`[SECURITY ERROR] Potential real credential/secret detected (${pat.name}) in ${ent.name}`);
            hasError = true;
          }
        }
      }
    }
  }

  walk(contentDir);

  if (hasError) {
    console.error(`[FAIL] Secrets audit failed. Please mask real tokens with placeholders (e.g. YOUR_SUB_TOKEN).`);
    return false;
  }

  console.log(`[PASS] Secrets audit PASSED! No live tokens or private keys found in documentation.`);
  return true;
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('check-secrets')) {
  const ok = checkSecrets();
  if (!ok) process.exit(1);
}
