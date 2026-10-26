<template>
  <div class="mainsite-cta-box" data-pagefind-ignore="index">
    <div class="cta-inner">
      <div class="cta-content">
        <div class="cta-badge">
          <span>选购中心协同导流</span>
          <span class="cta-disclosure-tag">同运营网络关系披露</span>
        </div>
        <h4 class="cta-heading">{{ title || '前往机场榜一选购中心对比真实套餐与测速' }}</h4>
        <p class="cta-desc">
          {{ description || '分站提供客观技术资料与选型方法；如需查看各商户当前最新套餐标价、多地域网络真实测速矩阵及折扣，可前往主站。' }}
        </p>
        <div class="cta-meta">
          <span>已核验目标：<code>{{ verifiedRouteKey }}</code></span>
          <span v-if="verifiedDate">· 核验日期：{{ verifiedDate }}</span>
        </div>
      </div>

      <div class="cta-action">
        <a
          :href="finalTargetUrl"
          target="_blank"
          rel="nofollow sponsored noopener"
          class="cta-button"
        >
          <span>{{ buttonText || '在主站查看当前方案' }}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  targetRoute?: 'recommend' | 'pricing' | 'compare' | 'ai_streaming' | 'reviews';
  campaign?: string;
  contentId?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  verifiedDate?: string;
}>();

// 固定白名单字典，严禁任意外部不受控域名
const routeMap: Record<string, string> = {
  recommend: '/recommend/',
  pricing: '/pricing/',
  compare: '/compare/',
  ai_streaming: '/ai-streaming/',
  reviews: '/reviews/'
};

const verifiedRouteKey = computed(() => {
  return props.targetRoute && routeMap[props.targetRoute] ? props.targetRoute : 'recommend';
});

const finalTargetUrl = computed(() => {
  const baseDomain = 'https://jichangbang.org';
  const path = routeMap[verifiedRouteKey.value] || '/recommend/';
  const url = new URL(path, baseDomain);

  url.searchParams.set('utm_source', 'tizicankao.cc');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', props.campaign || 'editorial_cta');
  if (props.contentId) {
    url.searchParams.set('utm_content', props.contentId);
  }

  return url.toString();
});
</script>

<style scoped>
.mainsite-cta-box {
  background: #ffffff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  padding: 18px 22px;
  margin: 2rem 0;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.05);
}

.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.cta-content {
  flex: 1 1 360px;
}

.cta-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: #1d4ed8;
}

.cta-disclosure-tag {
  color: #64748b;
  font-weight: normal;
  background: #f1f5f9;
  padding: 1px 6px;
  border-radius: 4px;
}

.cta-heading {
  margin: 0 0 6px 0;
  font-size: 1.08rem;
  font-weight: 700;
  color: #0f172a;
}

.cta-desc {
  margin: 0 0 8px 0;
  font-size: 13.5px;
  color: #475569;
  line-height: 1.5;
}

.cta-meta {
  font-size: 12px;
  color: #64748b;
}

.cta-meta code {
  background: #f1f5f9;
  padding: 1px 4px;
  border-radius: 3px;
  color: #1e293b;
}

.cta-action {
  flex-shrink: 0;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #2563eb;
  color: #ffffff !important;
  text-decoration: none !important;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
  transition: all 0.15s ease;
}

.cta-button:hover {
  background-color: #1d4ed8;
}
</style>
