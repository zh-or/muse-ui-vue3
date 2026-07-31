<script setup>
import { useSlots, defineOptions } from 'vue';

defineOptions({ name: 'mu-list-action' });

const slots = useSlots();
</script>

<template>
  <div :class="['mu-item-action', { 'is-more': slots.default && slots.default().length > 1 }]">
    <slot />
  </div>
</template>
