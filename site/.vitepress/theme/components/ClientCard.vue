<template>
  <div class="client-card" data-pagefind-body>
    <div class="client-header">
      <div class="client-title-row">
        <h4 class="client-name">{{ name }}</h4>
        <span class="client-core-badge" v-if="core">核心：{{ core }}</span>
      </div>
      <span class="client-version" v-if="version">已核验版本：{{ version }}</span>
    </div>

    <p class="client-desc" v-if="description">{{ description }}</p>

    <div class="client-tags">
      <span class="platform-tag" v-for="p in platforms" :key="p">{{ p }}</span>
    </div>

    <div class="client-links">
      <a
        v-if="repoUrl"
        :href="repoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="client-btn official"
      >
        官方开源仓库 / Releases ↗
      </a>
      <a
        v-if="guideUrl"
        :href="guideUrl"
        class="client-btn guide"
      >
        本站安装与配置指南 →
      </a>
    </div>

    <div class="client-safe-tip">
      <span class="tip-icon">🛡️</span>
      <span>安全提醒：切勿在第三方未核验网盘或重打包网站下载，防止内嵌恶意后门与凭据窃取脚本。</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  core?: string;
  version?: string;
  description?: string;
  platforms?: string[];
  repoUrl?: string;
  guideUrl?: string;
}>();
</script>

<style scoped>
.client-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 18px;
  margin: 1.2rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.client-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.client-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.client-name {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.client-core-badge {
  font-size: 11.5px;
  background: #f1f5f9;
  color: #334155;
  padding: 2px 6px;
  border-radius: 4px;
}

.client-version {
  font-size: 12px;
  color: #059669;
  font-weight: 500;
}

.client-desc {
  font-size: 13.5px;
  color: #475569;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.client-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.platform-tag {
  background: #eff6ff;
  color: #1e40af;
  font-size: 11.5px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.client-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.client-btn {
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
}

.client-btn.official {
  background: #0f172a;
  color: #ffffff !important;
}

.client-btn.official:hover {
  background: #1e293b;
}

.client-btn.guide {
  background: #f1f5f9;
  color: #2563eb !important;
  border: 1px solid #cbd5e1;
}

.client-btn.guide:hover {
  background: #e2e8f0;
}

.client-safe-tip {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  background: #f8fafc;
  padding: 8px 10px;
  border-radius: 6px;
}

.tip-icon {
  font-size: 14px;
}
</style>
