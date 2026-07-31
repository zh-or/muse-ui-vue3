<template>
  <hr
    class="mu-divider"
    :class="{
      inset: inset,
      'shallow-inset': shallowInset
    }"
  >
</template>

<script setup>
import { defineOptions } from 'vue';
defineOptions({ name: 'mu-divider' });
defineProps({
  inset: Boolean,
  shallowInset: Boolean
})
</script>
