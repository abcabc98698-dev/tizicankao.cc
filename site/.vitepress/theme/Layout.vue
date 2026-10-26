<template>
  <div class="site-wrapper">
    <!-- 统一品牌顶部导航 -->
    <SiteHeader />

    <!-- 核心主体内容区 -->
    <main class="site-main-content">
      <div class="vp-doc-wrapper" data-pagefind-body>
        <Content />
      </div>
    </main>

    <!-- 品牌简白风格页脚 -->
    <footer class="site-footer" data-pagefind-ignore="index">
      <div class="footer-inner">
        <div class="footer-links">
          <a href="/">首页</a>
          <span>·</span>
          <a href="/choose/">梯子怎么选</a>
          <span>·</span>
          <a href="/mobile/">手机方案</a>
          <span>·</span>
          <a href="/desktop/">电脑方案</a>
          <span>·</span>
          <a href="/beginner/">新手方案</a>
          <span>·</span>
          <a href="/service-types/">服务类型</a>
          <span>·</span>
          <a href="/checklist/">选型检查</a>
          <span>·</span>
          <a href="/free-trial/">免费试用</a>
          <span>·</span>
          <a href="/brands/">品牌数据库</a>
          <span>·</span>
          <a href="/clients/">客户端下载</a>
          <span>·</span>
          <a href="/guides/">使用教程</a>
          <span>·</span>
          <a href="/troubleshooting/">网络排障</a>
          <span>·</span>
          <a href="/risks/">风险提示</a>
          <span>·</span>
          <a href="/wiki/">知识百科</a>
        </div>

        <div class="footer-disclosure">
          <strong>网络与商业模式透明说明：</strong>
          梯子参考（tizicankao.cc）为面向设备与任务选型的中立技术资料库。本站不冒充第三方官网，不经营未授权代理分销。商业服务对比与实时套餐测速均主动导向同一运营网络的选购主站
          <a href="https://jichangbang.org/recommend/?utm_source=tizicankao.cc&utm_medium=referral&utm_campaign=footer" target="_blank" rel="noopener sponsored">机场榜一 (jichangbang.org) ↗</a>。
          所有软件下载均保留官方开源 Releases 溯源。
        </div>

        <div class="footer-copy">
          © 2026 梯子参考 tizicankao.cc ｜ 文档语言：zh-CN ｜ 静态全文索引驱动
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue';
</script>

<style scoped>
.vp-doc-wrapper {
  width: 100%;
}

.footer-disclosure {
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.6;
  max-width: 900px;
  margin: 0 auto;
}

.footer-disclosure a {
  color: #2563eb;
  text-decoration: underline;
}

.footer-copy {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 6px;
}
</style>
