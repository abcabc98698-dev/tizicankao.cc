<template>
  <div class="topic-matrix-box" data-pagefind-body>
    <div class="matrix-header" v-if="title || subtitle">
      <h3 class="matrix-title" v-if="title">{{ title }}</h3>
      <p class="matrix-subtitle" v-if="subtitle">{{ subtitle }}</p>
    </div>

    <!-- 语义化结构表格/卡片流 -->
    <div class="matrix-table-wrap">
      <table class="custom-table matrix-table">
        <thead>
          <tr>
            <th style="min-width: 140px;">用户核心问题</th>
            <th style="min-width: 120px;">适合谁 / 场景</th>
            <th style="min-width: 130px;">前置条件 / 依赖</th>
            <th style="min-width: 180px;">目标深度文章</th>
            <th style="min-width: 130px;">可核验依据</th>
            <th style="min-width: 120px;">后续下一步</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" :key="i">
            <td class="col-question">
              <strong>{{ item.question }}</strong>
            </td>
            <td class="col-audience">{{ item.audience }}</td>
            <td class="col-prereq">{{ item.prerequisite }}</td>
            <td class="col-target">
              <a :href="item.targetUrl" class="matrix-link">
                {{ item.targetTitle }}
              </a>
            </td>
            <td class="col-evidence">
              <span class="evidence-tag">{{ item.evidence }}</span>
            </td>
            <td class="col-next">
              <a v-if="item.nextUrl" :href="item.nextUrl" class="next-link">
                {{ item.nextStep }} →
              </a>
              <span v-else class="next-text">{{ item.nextStep }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MatrixItem {
  question: string;
  audience: string;
  prerequisite: string;
  targetTitle: string;
  targetUrl: string;
  evidence: string;
  nextStep: string;
  nextUrl?: string;
}

defineProps<{
  title?: string;
  subtitle?: string;
  items: MatrixItem[];
}>();
</script>

<style scoped>
.topic-matrix-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
  margin: 2rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.matrix-header {
  margin-bottom: 16px;
}

.matrix-title {
  margin: 0 0 6px 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.matrix-subtitle {
  margin: 0;
  font-size: 14px;
  color: #475569;
}

.matrix-table-wrap {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.matrix-table th {
  background-color: #f8fafc;
  font-size: 13px;
  padding: 10px 12px;
  color: #334155;
  white-space: nowrap;
}

.matrix-table td {
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.5;
  vertical-align: top;
}

.matrix-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.matrix-link:hover {
  color: #1d4ed8;
}

.evidence-tag {
  display: inline-block;
  background: #f1f5f9;
  color: #475569;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11.5px;
}

.next-link {
  color: #059669;
  text-decoration: none;
  font-weight: 500;
}

.next-link:hover {
  text-decoration: underline;
}

.next-text {
  color: #64748b;
}
</style>
