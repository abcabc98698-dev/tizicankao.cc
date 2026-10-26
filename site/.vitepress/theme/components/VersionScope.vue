<template>
  <div class="version-scope-badge" data-pagefind-ignore="index">
    <div class="scope-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
    </div>
    <div class="scope-content">
      <div class="scope-row">
        <strong>适用环境与版本范围：</strong>
        <span>{{ scope || '官方当前稳定版及长期支持版本' }}</span>
      </div>
      <div class="scope-sub" v-if="protocols || verifiedDate">
        <span v-if="protocols">涵盖协议：{{ protocols }}</span>
        <span v-if="verifiedDate">· 最近实测验证：{{ verifiedDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  scope?: string;
  protocols?: string;
  verifiedDate?: string;
}>();
</script>

<style scoped>
.version-scope-badge {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 1rem 0;
  font-size: 13px;
}

.scope-icon {
  color: #2563eb;
  margin-top: 2px;
}

.scope-content {
  flex: 1;
}

.scope-row {
  color: #0f172a;
}

.scope-sub {
  color: #64748b;
  font-size: 12px;
  margin-top: 2px;
}
</style>
