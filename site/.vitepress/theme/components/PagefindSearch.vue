<template>
  <div class="search-container">
    <button
      type="button"
      class="search-trigger-btn"
      aria-label="搜索全站指南"
      @click="openModal"
    >
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <span class="search-placeholder">搜索方案、软件、排障...</span>
      <kbd class="search-kbd">Ctrl K</kbd>
    </button>

    <!-- 搜索模态框 -->
    <div v-if="isOpen" class="search-modal-overlay" @click.self="closeModal" @keydown.esc="closeModal">
      <div class="search-modal">
        <div class="search-input-wrapper">
          <svg class="modal-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref="searchInputRef"
            v-model="query"
            type="search"
            placeholder="输入关键词（如：手机方案、Clash Verge Rev、TUN模式、订阅超时）..."
            class="search-input"
            @input="handleSearch"
          />
          <button class="modal-close-btn" @click="closeModal">Esc</button>
        </div>

        <div class="search-results-area">
          <div v-if="isLoading" class="search-state-msg">
            <span>正在检索全站索引...</span>
          </div>

          <div v-else-if="pagefindNotLoaded" class="search-state-msg warning">
            <p><strong>搜索索引提示：</strong></p>
            <p>当前运行在本地无索引开发模式。请在终端执行 <code>npm run build</code> 生成正式静态全文 Pagefind 索引。</p>
          </div>

          <div v-else-if="hasSearched && results.length === 0" class="search-state-msg">
            未找到与“{{ query }}”相关的技术方案或排障指南。
          </div>

          <div v-else-if="results.length > 0" class="results-list">
            <a
              v-for="(item, index) in results"
              :key="index"
              :href="item.url"
              class="result-item"
              @click="closeModal"
            >
              <div class="result-title">{{ item.meta?.title || item.url }}</div>
              <div class="result-excerpt" v-html="item.excerpt"></div>
            </a>
          </div>

          <div v-else class="search-hints">
            <span>常见检索：</span>
            <button type="button" class="hint-tag" @click="setQuery('手机方案')">手机方案</button>
            <button type="button" class="hint-tag" @click="setQuery('Clash Verge Rev')">Clash Verge Rev</button>
            <button type="button" class="hint-tag" @click="setQuery('v2rayN')">v2rayN</button>
            <button type="button" class="hint-tag" @click="setQuery('TUN')">TUN</button>
            <button type="button" class="hint-tag" @click="setQuery('订阅超时')">订阅超时</button>
          </div>
        </div>

        <div class="search-modal-footer">
          <span>基于 Pagefind 本地静态多语言索引构建，无第三方跟踪与隐私上传</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

interface SearchResultItem {
  url: string;
  excerpt: string;
  meta?: {
    title?: string;
  };
}

const isOpen = ref(false);
const query = ref('');
const isLoading = ref(false);
const hasSearched = ref(false);
const pagefindNotLoaded = ref(false);
const results = ref<SearchResultItem[]>([]);
const searchInputRef = ref<HTMLInputElement | null>(null);

let pagefindInstance: any = null;

async function loadPagefind() {
  if (pagefindInstance) return pagefindInstance;
  if (typeof window === 'undefined') return null;
  try {
    // 动态载入由 Pagefind CLI 生成在 /pagefind/pagefind.js 的脚本，通过 new Function 避免打包期 Rollup 静态分析
    const importDynamic = new Function('url', 'return import(url)');
    const pagefind = await importDynamic('/pagefind/pagefind.js');
    await pagefind.init();
    pagefindInstance = pagefind;
    pagefindNotLoaded.value = false;
    return pagefind;
  } catch (err) {
    // 本地开发环境还未执行 pagefind index 时
    pagefindNotLoaded.value = true;
    return null;
  }
}

function openModal() {
  isOpen.value = true;
  nextTick(() => {
    searchInputRef.value?.focus();
  });
  loadPagefind();
}

function closeModal() {
  isOpen.value = false;
  query.value = '';
  results.value = [];
  hasSearched.value = false;
}

function setQuery(text: string) {
  query.value = text;
  handleSearch();
}

async function handleSearch() {
  const q = query.value.trim();
  if (!q) {
    results.value = [];
    hasSearched.value = false;
    return;
  }

  hasSearched.value = true;
  isLoading.value = true;

  const pagefind = await loadPagefind();
  if (!pagefind) {
    isLoading.value = false;
    return;
  }

  try {
    const searchRes = await pagefind.search(q);
    const dataList = await Promise.all(
      searchRes.results.slice(0, 10).map((r: any) => r.data())
    );
    results.value = dataList;
  } catch (e) {
    results.value = [];
  } finally {
    isLoading.value = false;
  }
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (isOpen.value) {
      closeModal();
    } else {
      openModal();
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
}

.search-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 12px;
  color: #64748b;
  cursor: pointer;
  font-size: 13.5px;
  transition: all 0.15s ease;
}

.search-trigger-btn:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.search-placeholder {
  display: inline-block;
}

.search-kbd {
  font-family: inherit;
  font-size: 11px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 1px 5px;
  color: #64748b;
}

@media (max-width: 640px) {
  .search-placeholder,
  .search-kbd {
    display: none;
  }
  .search-trigger-btn {
    padding: 6px 8px;
  }
}

.search-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
}

.search-modal {
  width: 90%;
  max-width: 620px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid #e2e8f0;
  gap: 12px;
}

.modal-search-icon {
  color: #64748b;
}

.search-input {
  flex: 1;
  border: none;
  font-size: 16px;
  outline: none;
  color: #0f172a;
}

.modal-close-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 11px;
  padding: 2px 6px;
  color: #64748b;
  cursor: pointer;
}

.search-results-area {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
  min-height: 180px;
}

.search-state-msg {
  text-align: center;
  padding: 30px 10px;
  color: #64748b;
  font-size: 14px;
}

.search-state-msg.warning {
  color: #b45309;
  background: #fffbeb;
  border-radius: 6px;
  padding: 16px;
  text-align: left;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-item {
  display: block;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  background: #f8fafc;
  text-decoration: none;
  transition: all 0.15s ease;
}

.result-item:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.result-title {
  font-weight: 600;
  font-size: 15px;
  color: #0f172a;
  margin-bottom: 4px;
}

.result-excerpt {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
}

.result-excerpt :deep(mark) {
  background: #fef08a;
  color: #854d0e;
  padding: 0 2px;
  border-radius: 2px;
}

.search-hints {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 13px;
  padding: 20px 8px;
}

.hint-tag {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 12px;
  color: #334155;
  cursor: pointer;
}

.hint-tag:hover {
  background: #e2e8f0;
  color: #2563eb;
}

.search-modal-footer {
  border-top: 1px solid #f1f5f9;
  padding: 10px 18px;
  background: #fafafa;
  font-size: 12px;
  color: #94a3b8;
  text-align: right;
}
</style>
