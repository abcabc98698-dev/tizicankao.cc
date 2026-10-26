<template>
  <details class="mobile-outline-card" v-if="headers.length > 0">
    <summary>
      <span class="icon">📑</span>
      <span class="summary-text">本篇核心章节速览（共 {{ headers.length }} 节，点击展开）</span>
    </summary>
    <div class="outline-links">
      <a
        v-for="(item, idx) in headers"
        :key="item.id"
        :href="`#${item.id}`"
        class="outline-link-item"
        @click="handleJump(item.id, $event)"
      >
        <span class="idx-badge">{{ idx + 1 }}</span>
        <span class="item-title">{{ item.text }}</span>
      </a>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRoute, useData } from 'vitepress';

interface OutlineItem {
  id: string;
  text: string;
}

const route = useRoute();
const { page } = useData();
const domHeaders = ref<OutlineItem[]>([]);

const headers = computed<OutlineItem[]>(() => {
  // 1. 优先使用 SSR/VitePress page.headers
  const rawList = page.value?.headers;
  if (rawList && Array.isArray(rawList) && rawList.length > 0) {
    const list: OutlineItem[] = [];
    for (const h of rawList) {
      if (h.level === 2) {
        list.push({ id: h.slug, text: h.title });
      }
    }
    if (list.length > 0) return list;
  }
  // 2. 客户端 DOM 补充
  return domHeaders.value;
});

const extractDomHeaders = () => {
  if (typeof document === 'undefined') return;
  const elements = document.querySelectorAll('.vp-doc h2');
  const items: OutlineItem[] = [];
  elements.forEach((el) => {
    const id = el.getAttribute('id');
    if (!id) return;
    let text = el.textContent || '';
    text = text.replace(/[\u200B\u200C\u200D\uFEFF]/g, '').trim();
    if (text.endsWith('#')) text = text.slice(0, -1).trim();
    items.push({ id, text });
  });
  domHeaders.value = items;
};

const handleJump = (id: string, e: Event) => {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (el) {
    e.preventDefault();
    const y = el.getBoundingClientRect().top + window.pageYOffset - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
    if (history.pushState) {
      history.pushState(null, '', `#${id}`);
    }
  }
};

onMounted(() => {
  nextTick(extractDomHeaders);
});

watch(() => route.path, () => {
  nextTick(extractDomHeaders);
});
</script>

<style scoped>
.idx-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background-color: #dbeafe;
  color: #1e40af;
  font-size: 11.5px;
  font-weight: 700;
  flex-shrink: 0;
}

.item-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
