<template>
  <div class="decision-tree-box" data-pagefind-body>
    <div class="dt-header" v-if="title">
      <span class="dt-tag">选型判断决策树</span>
      <h4 class="dt-title">{{ title }}</h4>
    </div>

    <div class="dt-branches">
      <div v-for="(b, i) in branches" :key="i" class="dt-branch-card">
        <div class="branch-index">分支 {{ i + 1 }}</div>
        <div class="branch-body">
          <div class="branch-condition">
            <strong>判定条件：</strong>
            <span>{{ b.condition }}</span>
          </div>

          <div class="branch-grid">
            <div class="step-col">
              <span class="step-label">推荐行动</span>
              <p class="step-val">{{ b.action }}</p>
            </div>
            <div class="step-col">
              <span class="step-label">验证验收标准</span>
              <p class="step-val">{{ b.verification }}</p>
            </div>
            <div class="step-col exit-col">
              <span class="step-label">不达标退出/替代方案</span>
              <p class="step-val">{{ b.exitRoute }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BranchItem {
  condition: string;
  action: string;
  verification: string;
  exitRoute: string;
}

defineProps<{
  title?: string;
  branches: BranchItem[];
}>();
</script>

<style scoped>
.decision-tree-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
  margin: 1.8rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.dt-tag {
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.dt-title {
  margin: 4px 0 16px 0;
  font-size: 1.12rem;
  color: #0f172a;
}

.dt-branches {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.dt-branch-card {
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
}

.branch-index {
  background: #e2e8f0;
  color: #475569;
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  writing-mode: vertical-lr;
  letter-spacing: 0.1em;
}

.branch-body {
  padding: 14px 16px;
  flex: 1;
}

.branch-condition {
  font-size: 14px;
  color: #0f172a;
  margin-bottom: 12px;
  line-height: 1.5;
}

.branch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.step-col {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 10px;
}

.exit-col {
  border-left: 3px solid #f59e0b;
}

.step-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
}

.step-val {
  margin: 0;
  font-size: 12.5px;
  color: #1e293b;
  line-height: 1.45;
}

@media (max-width: 640px) {
  .dt-branch-card {
    flex-direction: column;
  }
  .branch-index {
    writing-mode: horizontal-tb;
    padding: 4px 10px;
  }
}
</style>
