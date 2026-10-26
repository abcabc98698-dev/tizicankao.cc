<template>
  <div class="related-tasks-box" data-pagefind-ignore="index" v-if="tasks && tasks.length > 0">
    <div class="related-header">
      <span class="related-tag">配套与后续行动推荐</span>
      <h4 class="related-title">{{ title || '关联任务与延伸阅读' }}</h4>
    </div>

    <div class="related-grid">
      <a
        v-for="(t, i) in tasks"
        :key="i"
        :href="t.url"
        class="task-card"
      >
        <div class="task-badge-row">
          <span class="edge-type" :class="'edge-' + t.type">{{ getEdgeLabel(t.type) }}</span>
        </div>
        <div class="task-text-title">{{ t.title }}</div>
        <p class="task-desc" v-if="t.description">{{ t.description }}</p>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RelatedTaskItem {
  type: 'prerequisite' | 'explains' | 'evidence' | 'troubleshoots' | 'next_step';
  title: string;
  url: string;
  description?: string;
}

defineProps<{
  title?: string;
  tasks: RelatedTaskItem[];
}>();

function getEdgeLabel(type: string): string {
  switch (type) {
    case 'prerequisite': return '前置准备';
    case 'explains': return '底层机制';
    case 'evidence': return '证据资料';
    case 'troubleshoots': return '排障处理';
    case 'next_step': return '下一步行动';
    default: return '关联指南';
  }
}
</script>

<style scoped>
.related-tasks-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 18px;
  margin: 2.2rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.related-header {
  margin-bottom: 14px;
}

.related-tag {
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.related-title {
  margin: 4px 0 0 0;
  font-size: 1.08rem;
  color: #0f172a;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.task-card {
  display: block;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px;
  text-decoration: none;
  transition: all 0.15s ease;
}

.task-card:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.task-badge-row {
  margin-bottom: 6px;
}

.edge-type {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 3px;
}

.edge-prerequisite { background: #fef3c7; color: #92400e; }
.edge-explains { background: #f3e8ff; color: #6b21a8; }
.edge-evidence { background: #e0f2fe; color: #0369a1; }
.edge-troubleshoots { background: #fee2e2; color: #991b1b; }
.edge-next_step { background: #dcfce7; color: #166534; }

.task-text-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
  margin-bottom: 4px;
}

.task-desc {
  font-size: 12px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}
</style>
