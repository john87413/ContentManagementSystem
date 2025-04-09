<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useSidebarStore } from './stores/SidebarStore';

const sidebarStore = useSidebarStore();

const handleResize = () => {
  if (window.innerWidth < 768) {
    sidebarStore.setCollapsed(true);
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style>
</style>
