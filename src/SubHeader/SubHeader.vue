<template>
  <div class="mu-sub-header" :class="{ inset: inset }">
    <slot />
  </div>
</template>

<script setup>
import { defineOptions } from 'vue';
defineOptions({ name: 'mu-sub-header' });
defineProps({
  inset: Boolean
})
</script>
