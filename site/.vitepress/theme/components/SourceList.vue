<template>
  <div class="source-list-box" data-pagefind-ignore="index">
    <div class="source-header">
      <span class="source-tag">一手证据与引用来源清单</span>
    </div>
    <ul class="sources-ul">
      <li v-for="(s, i) in sources" :key="i" class="source-li">
        <div class="source-main">
          <a :href="s.url" target="_blank" rel="noopener noreferrer" class="source-link">
            {{ s.title }} ↗
          </a>
          <span class="source-publisher">（发布机构：{{ s.publisher }}，访问日期：{{ s.accessedAt }}）</span>
        </div>
        <div class="source-claims" v-if="s.supportsClaims && s.supportsClaims.length > 0">
          <span class="claim-label">支撑论据：</span>
          <span class="claim-item" v-for="(c, ci) in s.supportsClaims" :key="ci">{{ c }}</span>
        </div>
        <div class="source-limit" v-if="s.limitations">
          <span class="limit-label">局限与约束：</span>
          <span>{{ s.limitations }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface SourceItem {
  title: string;
  url: string;
  publisher: string;
  accessedAt: string;
  supportsClaims?: string[];
  limitations?: string;
}

defineProps<{
  sources: SourceItem[];
}>();
</script>

<style scoped>
.source-list-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px 20px;
  margin: 2rem 0;
}

.source-tag {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
}

.sources-ul {
  margin: 10px 0 0 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.source-li {
  border-bottom: 1px dashed #e2e8f0;
  padding-bottom: 10px;
}

.source-li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.source-link {
  font-weight: 600;
  color: #2563eb;
  font-size: 13.5px;
  text-decoration: underline;
}

.source-publisher {
  font-size: 12px;
  color: #64748b;
  margin-left: 6px;
}

.source-claims {
  margin-top: 4px;
  font-size: 12.5px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.claim-label {
  color: #475569;
  font-weight: 500;
}

.claim-item {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11.5px;
  color: #1e293b;
}

.source-limit {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}

.limit-label {
  font-weight: 500;
  color: #b45309;
}
</style>
