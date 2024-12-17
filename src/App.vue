<script setup lang="ts">
import { onMounted, ref } from 'vue';
import setEditor, { iframeCode } from './tests';

const editor = ref<null | HTMLElement>(null);
onMounted(() => {
  if (!editor.value) return;
  setEditor(editor.value);
})
</script>

<template>
  <div class="w-full h-full flex justify-center items-center flex-col lg:flex-row">
    <div
      ref="editor"
      class="w-full h-1/2 lg:w-1/2 lg:h-full"
    />
    <iframe
      class="flex-grow w-full lg:w-auto lg:h-full"
      :srcdoc="iframeCode"
    />
  </div>
</template>

<style scoped>
</style>
