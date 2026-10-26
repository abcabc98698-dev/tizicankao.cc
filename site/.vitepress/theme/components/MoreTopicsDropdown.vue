<template>
  <div class="dropdown-wrapper" ref="dropdownRef" @keydown.esc="closeDropdown">
    <button
      type="button"
      class="nav-btn dropdown-trigger"
      :class="{ 'is-active': isOpen }"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      @click="toggleDropdown"
      @keydown.down.prevent="focusFirstItem"
    >
      <span>更多专题</span>
      <svg class="chevron" :class="{ rotated: isOpen }" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <div v-show="isOpen" class="dropdown-menu" role="menu">
      <a
        v-for="(item, index) in topics"
        :key="item.path"
        :href="item.path"
        class="dropdown-item"
        role="menuitem"
        ref="itemRefs"
        @click="closeDropdown"
      >
        <span class="item-title">{{ item.name }}</span>
        <span class="item-desc">{{ item.desc }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const itemRefs = ref<HTMLAnchorElement[]>([]);

// 8个“更多专题”严格按指定顺序
const topics = [
  { name: '选型检查', path: '/checklist/', desc: '买前核验与买后验收清单' },
  { name: '免费试用', path: '/free-trial/', desc: '领取资格、时钟与退款边界' },
  { name: '品牌数据库', path: '/brands/', desc: '品牌身份、官网与套餐档案' },
  { name: '客户端下载', path: '/clients/', desc: '各平台官方安装包与校验值' },
  { name: '使用教程', path: '/guides/', desc: '从安装到首次跑通完整流程' },
  { name: '网络排障', path: '/troubleshooting/', desc: '启动异常、超时与报错诊断' },
  { name: '风险提示', path: '/risks/', desc: '营销虚标、仿冒与凭据泄露' },
  { name: '知识百科', path: '/wiki/', desc: '连接拓扑、分流与协议机制' }
];

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function closeDropdown() {
  isOpen.value = false;
}

function focusFirstItem() {
  if (!isOpen.value) isOpen.value = true;
  setTimeout(() => {
    itemRefs.value[0]?.focus();
  }, 50);
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: #334155;
  font-size: 14.5px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dropdown-trigger:hover,
.dropdown-trigger.is-active {
  background-color: #f1f5f9;
  color: #2563eb;
}

.chevron {
  transition: transform 0.2s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 6px;
  width: 250px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  padding: 6px 0;
  z-index: 999;
}

.dropdown-item {
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.dropdown-item:hover,
.dropdown-item:focus {
  background-color: #f8fafc;
  outline: none;
}

.item-title {
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
}

.item-desc {
  color: #64748b;
  font-size: 12px;
  margin-top: 2px;
}
</style>
