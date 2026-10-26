<template>
  <button
    v-show="visible"
    class="back-to-top-btn"
    @click="scrollToTop"
    aria-label="返回顶部"
    title="返回顶部"
  >
    <svg class="arrow-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const visible = ref(false);

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  visible.value = scrollTop > 360;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.back-to-top-btn {
  position: fixed;
  right: 28px;
  bottom: 32px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 40;
  transition: all 0.2s ease;
}

.back-to-top-btn:hover {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
}

.arrow-icon {
  display: block;
}

@media (max-width: 768px) {
  .back-to-top-btn {
    right: 18px;
    bottom: 24px;
    width: 38px;
    height: 38px;
  }
}
</style>
