<template>
  <nav class="toc-container" aria-label="本页目录" v-if="headers.length > 0">
    <div class="toc-header">
      <svg class="toc-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
      <span class="toc-title">本页章节大纲</span>
    </div>

    <ul class="toc-list">
      <li
        v-for="item in headers"
        :key="item.id"
        :class="['toc-item', `toc-level-${item.level}`, { 'is-active': activeId === item.id }]"
      >
        <a :href="`#${item.id}`" class="toc-link" @click.prevent="scrollTo(item.id)">
          {{ item.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute, useData } from 'vitepress';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const route = useRoute();
const { page } = useData();
const headers = ref<TocItem[]>([]);
const activeId = ref('');

const updateHeaders = () => {
  // 1. 优先尝试从 page.headers 解析
  const rawList = page.value?.headers;
  if (rawList && Array.isArray(rawList) && rawList.length > 0) {
    const list: TocItem[] = [];
    const walk = (items: any[]) => {
      for (const it of items) {
        if (it.level === 2 || it.level === 3) {
          list.push({ id: it.slug, text: it.title, level: it.level });
        }
        if (it.children) walk(it.children);
      }
    };
    walk(rawList);
    if (list.length > 0) {
      headers.value = list;
      return;
    }
  }

  // 2. 客户端 DOM 兜底解析
  if (typeof document !== 'undefined') {
    const elements = document.querySelectorAll('.vp-doc h2, .vp-doc h3');
    const items: TocItem[] = [];
    elements.forEach((el) => {
      const id = el.getAttribute('id');
      if (!id) return;
      let text = el.textContent || '';
      text = text.replace(/[\u200B\u200C\u200D\uFEFF]/g, '').trim();
      if (text.endsWith('#')) text = text.slice(0, -1).trim();
      const level = el.tagName.toLowerCase() === 'h2' ? 2 : 3;
      items.push({ id, text, level });
    });
    headers.value = items;
  }
};

const handleScroll = () => {
  if (headers.value.length === 0 || typeof document === 'undefined') return;
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const offset = 120;

  for (let i = headers.value.length - 1; i >= 0; i--) {
    const el = document.getElementById(headers.value[i].id);
    if (el && el.offsetTop - offset <= scrollY) {
      activeId.value = headers.value[i].id;
      break;
    }
  }
};

const scrollTo = (id: string) => {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.pageYOffset - 75;
    window.scrollTo({ top: y, behavior: 'smooth' });
    activeId.value = id;
    if (history.pushState) {
      history.pushState(null, '', `#${id}`);
    }
  }
};

onMounted(() => {
  nextTick(() => {
    updateHeaders();
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  });
});

watch(() => route.path, () => {
  nextTick(() => {
    updateHeaders();
    handleScroll();
  });
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
.toc-container {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 16px 14px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  font-size: 13px;
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
  color: #0f172a;
  font-weight: 700;
  font-size: 13.5px;
}

.toc-icon {
  color: #2563eb;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.toc-item {
  line-height: 1.45;
  transition: all 0.15s ease;
}

.toc-level-3 {
  padding-left: 14px;
  font-size: 12.5px;
}

.toc-link {
  color: #64748b;
  text-decoration: none;
  display: block;
  padding: 4px 6px;
  border-radius: 4px;
  border-left: 2px solid transparent;
  transition: all 0.15s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toc-link:hover {
  color: #2563eb;
  background: #f8fafc;
}

.toc-item.is-active .toc-link {
  color: #2563eb;
  font-weight: 600;
  background: #eff6ff;
  border-left-color: #2563eb;
}
</style>
