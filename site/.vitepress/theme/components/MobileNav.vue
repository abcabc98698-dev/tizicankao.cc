<template>
  <div class="mobile-nav-container">
    <button
      type="button"
      class="mobile-toggle-btn"
      aria-label="切换导航菜单"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <svg v-if="!isOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>

    <div v-show="isOpen" class="mobile-drawer-overlay" @click="isOpen = false"></div>

    <div v-show="isOpen" class="mobile-drawer">
      <div class="drawer-header">
        <div class="drawer-brand-wrap">
          <img :src="'/avatar.jpg'" alt="梯子参考" class="drawer-avatar" />
          <span class="drawer-brand">梯子参考</span>
        </div>
        <button class="close-btn" @click="isOpen = false">✕</button>
      </div>

      <nav class="drawer-nav">
        <div class="nav-group-title">核心导航</div>
        <a href="/" class="drawer-link" @click="isOpen = false">首页</a>
        <a href="/choose/" class="drawer-link" @click="isOpen = false">梯子怎么选</a>
        <a href="/mobile/" class="drawer-link" @click="isOpen = false">手机方案</a>
        <a href="/desktop/" class="drawer-link" @click="isOpen = false">电脑方案</a>
        <a href="/beginner/" class="drawer-link" @click="isOpen = false">新手方案</a>
        <a href="/service-types/" class="drawer-link" @click="isOpen = false">服务类型</a>

        <div class="nav-group-title">更多专题</div>
        <a href="/checklist/" class="drawer-link" @click="isOpen = false">选型检查</a>
        <a href="/free-trial/" class="drawer-link" @click="isOpen = false">免费试用</a>
        <a href="/brands/" class="drawer-link" @click="isOpen = false">品牌数据库</a>
        <a href="/clients/" class="drawer-link" @click="isOpen = false">客户端下载</a>
        <a href="/guides/" class="drawer-link" @click="isOpen = false">使用教程</a>
        <a href="/troubleshooting/" class="drawer-link" @click="isOpen = false">网络排障</a>
        <a href="/risks/" class="drawer-link" @click="isOpen = false">风险提示</a>
        <a href="/wiki/" class="drawer-link" @click="isOpen = false">知识百科</a>

        <div class="nav-group-title">选购与外部入口</div>
        <a
          href="https://jichangbang.org/recommend/?utm_source=tizicankao.cc&utm_medium=referral&utm_campaign=mobile_drawer"
          target="_blank"
          rel="noopener sponsored"
          class="drawer-link main-site-link"
          @click="isOpen = false"
        >
          <span>机场榜一 · 选购中心 ↗</span>
          <span class="ext-badge">外站</span>
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);
</script>

<style scoped>
.mobile-nav-container {
  display: flex;
  align-items: center;
}

.mobile-toggle-btn {
  background: transparent;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 6px 8px;
  cursor: pointer;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  z-index: 1000;
}

.mobile-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 82%;
  max-width: 320px;
  background: #ffffff;
  z-index: 1001;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.drawer-brand-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drawer-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #cbd5e1;
  object-fit: cover;
}

.drawer-brand {
  font-weight: 700;
  font-size: 16px;
  color: #0f172a;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
}

.drawer-nav {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-group-title {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 12px;
  margin-bottom: 4px;
  padding-left: 8px;
}

.drawer-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  color: #1e293b;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
}

.drawer-link:hover {
  background-color: #f1f5f9;
  color: #2563eb;
}

.main-site-link {
  background-color: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.ext-badge {
  font-size: 11px;
  background: #dbeafe;
  color: #1e40af;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
