<template>
  <div class="disclosure-card" data-pagefind-ignore="index">
    <div class="disclosure-head">
      <span class="disc-icon">ℹ️</span>
      <strong>{{ title || '重要说明与中立性披露' }}</strong>
    </div>
    <div class="disclosure-body">
      <slot>
        <p>{{ text }}</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  text?: string;
}>();
</script>

<style scoped>
.disclosure-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px 16px;
  margin: 1.5rem 0;
  font-size: 13px;
  line-height: 1.55;
  color: #475569;
}

.disclosure-head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #0f172a;
  margin-bottom: 6px;
  font-size: 13.5px;
}

.disclosure-body p {
  margin: 0;
}
</style>
