<template>
  <nav class="breadcrumbs-nav" aria-label="面包屑导航" data-pagefind-ignore="index">
    <ol class="breadcrumbs-ol">
      <li class="crumb-item">
        <a href="/" class="crumb-link">首页</a>
        <span class="crumb-separator">/</span>
      </li>
      <li v-for="(c, i) in items" :key="i" class="crumb-item">
        <a v-if="i < items.length - 1" :href="c.url" class="crumb-link">{{ c.title }}</a>
        <span v-else class="crumb-current" aria-current="page">{{ c.title }}</span>
        <span v-if="i < items.length - 1" class="crumb-separator">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface BreadcrumbItem {
  title: string;
  url: string;
}

const props = defineProps<{
  items: BreadcrumbItem[];
}>();

// JSON-LD 结构化数据可在父级组件或 Head 中自动补充
</script>

<style scoped>
.breadcrumbs-nav {
  margin-bottom: 1.25rem;
  font-size: 13px;
  color: #64748b;
}

.breadcrumbs-ol {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 6px;
}

.crumb-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.crumb-link {
  color: #475569;
  text-decoration: none;
}

.crumb-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.crumb-current {
  color: #0f172a;
  font-weight: 500;
}

.crumb-separator {
  color: #cbd5e1;
}
</style>
