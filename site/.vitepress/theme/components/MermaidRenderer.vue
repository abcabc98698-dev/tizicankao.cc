<template>
  <!-- 逻辑驱动组件，无独立可视模板 -->
  <span class="mermaid-renderer-anchor" style="display: none;"></span>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();

const renderMermaidCharts = async () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 寻找所有带有 language-mermaid 的容器
  const blocks = document.querySelectorAll('div[class*="language-mermaid"]');
  if (blocks.length === 0) return;

  try {
    const mermaid = (await import('mermaid')).default;
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      fontFamily: 'var(--font-sans)',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis'
      }
    });

    for (let i = 0; i < blocks.length; i++) {
      const container = blocks[i] as HTMLElement;
      // 避免重复渲染
      if (container.dataset.mermaidRendered === 'true') continue;

      // 提取纯源码
      const codeEl = container.querySelector('code') || container.querySelector('pre');
      const rawCode = (codeEl ? codeEl.textContent : container.textContent) || '';
      const cleanCode = rawCode.trim();
      if (!cleanCode) continue;

      const chartId = `mermaid-chart-${Date.now()}-${i}`;
      try {
        const { svg } = await mermaid.render(chartId, cleanCode);
        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'mermaid-chart-card';
        chartWrapper.innerHTML = svg;
        
        // 替换原生代码块
        container.style.display = 'none';
        container.dataset.mermaidRendered = 'true';
        container.parentNode?.insertBefore(chartWrapper, container.nextSibling);
      } catch (renderErr) {
        console.warn('[MermaidRenderer] Failed to render diagram:', renderErr);
        // 容错保留原代码块
      }
    }
  } catch (loadErr) {
    console.error('[MermaidRenderer] Failed to initialize mermaid:', loadErr);
  }
};

onMounted(() => {
  nextTick(() => {
    // 延迟 50ms 确保 DOM 挂载稳定
    setTimeout(renderMermaidCharts, 50);
  });
});

watch(() => route.path, () => {
  nextTick(() => {
    setTimeout(renderMermaidCharts, 80);
  });
});
</script>

<style>
/* 全局 mermaid 图表卡片质感 */
.mermaid-chart-card {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.8rem 0;
  padding: 24px 18px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

.mermaid-chart-card svg {
  max-width: 100%;
  height: auto;
  min-width: 280px;
}

@media (max-width: 768px) {
  .mermaid-chart-card {
    padding: 16px 12px;
    margin: 1.4rem 0;
  }
}
</style>
