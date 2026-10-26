<template>
  <div
    class="reading-progress-bar"
    :style="{ width: progress + '%' }"
    aria-hidden="true"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const progress = ref(0);

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight > 0) {
    progress.value = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
  } else {
    progress.value = 0;
  }
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
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2.5px;
  background: linear-gradient(90deg, #3b82f6, #2563eb, #1d4ed8);
  z-index: 100;
  transition: width 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(37, 99, 235, 0.4);
}
</style>
