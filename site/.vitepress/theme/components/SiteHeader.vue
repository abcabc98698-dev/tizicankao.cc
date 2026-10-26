<template>
  <header class="site-header">
    <div class="header-inner">
      <!-- 品牌区域 -->
      <div class="header-brand-wrap">
        <a href="/" class="brand-link" title="梯子参考 tizicankao.cc 首页">
          <img :src="'/avatar.jpg'" alt="梯子参考" class="brand-avatar" />
          <div class="brand-text-col">
            <span class="brand-title">梯子参考</span>
            <span class="brand-domain">tizicankao.cc</span>
          </div>
        </a>
      </div>

      <!-- 桌面固定导航菜单 -->
      <nav class="desktop-nav" aria-label="主导航">
        <a href="/" class="nav-link">首页</a>
        <a href="/choose/" class="nav-link">梯子怎么选</a>
        <a href="/mobile/" class="nav-link">手机方案</a>
        <a href="/desktop/" class="nav-link">电脑方案</a>
        <a href="/beginner/" class="nav-link">新手方案</a>
        <a href="/service-types/" class="nav-link">服务类型</a>

        <!-- 更多专题下拉菜单 -->
        <MoreTopicsDropdown />
      </nav>

      <!-- 右侧操作区：搜索 + 外部选购中心 + 移动端汉堡按钮 -->
      <div class="header-right-actions">
        <!-- 搜索框 -->
        <PagefindSearch />

        <!-- 外部选购主站胶囊（独立标识为外站，不占用本地栏目链接） -->
        <div class="main-site-badge-wrap">
          <a
            href="https://jichangbang.org/recommend/?utm_source=tizicankao.cc&utm_medium=referral&utm_campaign=header_badge"
            target="_blank"
            rel="nofollow sponsored noopener"
            class="main-site-capsule"
            title="前往 机场榜一 选购中心（独立第三方服务与套餐横向测评）"
          >
            <span class="capsule-text">机场榜一 · 选购中心 ↗</span>
          </a>
        </div>

        <!-- 移动端抽屉按钮 -->
        <div class="mobile-only-wrap">
          <MobileNav />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import MoreTopicsDropdown from './MoreTopicsDropdown.vue';
import MobileNav from './MobileNav.vue';
import PagefindSearch from './PagefindSearch.vue';
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.header-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 16px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header-brand-wrap {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.brand-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid #cbd5e1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  object-fit: cover;
  flex-shrink: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.brand-link:hover .brand-avatar {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.2);
}

.brand-text-col {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-title {
  font-size: 17.5px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.brand-domain {
  font-size: 11.5px;
  color: #64748b;
  font-weight: 500;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  padding: 6px 12px;
  color: #334155;
  text-decoration: none;
  font-size: 14.5px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.nav-link:hover {
  background-color: #f1f5f9;
  color: #2563eb;
}

.header-right-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.main-site-capsule {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 600;
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.main-site-capsule:hover {
  background-color: #dbeafe;
  color: #1e40af;
}

.mobile-only-wrap {
  display: none;
}

@media (max-width: 1024px) {
  .desktop-nav {
    display: none;
  }
  .mobile-only-wrap {
    display: block;
  }
}

@media (max-width: 768px) {
  .brand-domain {
    display: none;
  }
  .main-site-badge-wrap {
    display: none;
  }
}
</style>
