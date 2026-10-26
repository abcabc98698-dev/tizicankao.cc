<template>
  <div class="answer-first-box" data-pagefind-ignore="index">
    <div class="af-header">
      <span class="af-pill">核心结论先行 (Answer-First)</span>
      <span class="af-timestamp" v-if="verifiedDate">核验日期：{{ verifiedDate }}</span>
    </div>

    <div class="af-verdict">
      <strong class="verdict-label">直接答案：</strong>
      <div class="verdict-content">
        <slot name="verdict">{{ verdict }}</slot>
      </div>
    </div>

    <div class="af-grid">
      <div class="af-grid-item" v-if="appliesTo">
        <span class="grid-title">适用对象与场景</span>
        <p class="grid-text">{{ appliesTo }}</p>
      </div>
      <div class="af-grid-item" v-if="prerequisites">
        <span class="grid-title">前置条件与成本</span>
        <p class="grid-text">{{ prerequisites }}</p>
      </div>
      <div class="af-grid-item" v-if="boundaries">
        <span class="grid-title">不适用与局限边界</span>
        <p class="grid-text">{{ boundaries }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  verdict?: string;
  appliesTo?: string;
  prerequisites?: string;
  boundaries?: string;
  verifiedDate?: string;
}>();
</script>

<style scoped>
.answer-first-box {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-left: 5px solid #2563eb;
  border-radius: 8px;
  padding: 18px 20px;
  margin: 1.5rem 0 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.af-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.af-pill {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: #eff6ff;
  color: #1d4ed8;
  padding: 3px 8px;
  border-radius: 4px;
}

.af-timestamp {
  font-size: 12px;
  color: #64748b;
}

.af-verdict {
  font-size: 15.5px;
  line-height: 1.6;
  color: #0f172a;
  margin-bottom: 16px;
  background: #ffffff;
  padding: 12px 14px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.verdict-label {
  color: #1d4ed8;
  margin-right: 4px;
}

.verdict-content {
  display: inline;
}

.af-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.af-grid-item {
  background: #ffffff;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.grid-title {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 4px;
}

.grid-text {
  font-size: 13.5px;
  color: #1e293b;
  margin: 0;
  line-height: 1.5;
}
</style>
