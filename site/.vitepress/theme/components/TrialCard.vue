<template>
  <div class="trial-card" data-pagefind-body>
    <div class="trial-header">
      <div class="trial-title-wrap">
        <span class="trial-badge" :class="typeClass">{{ typeLabel }}</span>
        <h4 class="trial-title">{{ title }}</h4>
      </div>
      <span class="trial-status" :class="{ expired: isExpired }">{{ isExpired ? '已失效/已结束' : '当前可核验' }}</span>
    </div>

    <div class="trial-grid">
      <div class="trial-col">
        <span class="col-lbl">领取前提与资格：</span>
        <span class="col-txt">{{ eligibility }}</span>
      </div>
      <div class="trial-col">
        <span class="col-lbl">额度与时间限制：</span>
        <span class="col-txt">{{ quotaTime }}</span>
      </div>
      <div class="trial-col">
        <span class="col-lbl">防扣费与退出注意：</span>
        <span class="col-txt warning-txt">{{ trapNotice }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  type: 'free_quota' | 'time_trial' | 'refund_policy';
  eligibility: string;
  quotaTime: string;
  trapNotice: string;
  isExpired?: boolean;
}>();

const typeLabel = computed(() => {
  switch (props.type) {
    case 'free_quota': return '注册赠送流量';
    case 'time_trial': return '限时免费试用';
    case 'refund_policy': return '付费后退款机制';
    default: return '体验方案';
  }
});

const typeClass = computed(() => {
  return `type-${props.type}`;
});
</script>

<style scoped>
.trial-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin: 1.2rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.trial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.trial-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trial-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.trial-badge.type-free_quota {
  background: #ecfdf5;
  color: #059669;
}

.trial-badge.type-time_trial {
  background: #eff6ff;
  color: #2563eb;
}

.trial-badge.type-refund_policy {
  background: #fffbe8;
  color: #d97706;
}

.trial-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #0f172a;
}

.trial-status {
  font-size: 12px;
  color: #059669;
  font-weight: 500;
}

.trial-status.expired {
  color: #94a3b8;
}

.trial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
}

.trial-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.col-lbl {
  font-size: 11.5px;
  color: #64748b;
  font-weight: 600;
}

.col-txt {
  font-size: 13px;
  color: #1e293b;
}

.warning-txt {
  color: #b45309;
}
</style>
