<template>
  <div
    class="mu-paper"
    :class="{
      'mu-paper-circle': circle,
      'mu-paper-round': rounded,
      ['mu-elevation-' + zDepth]: !!zDepth
    }"
  >
    <slot />
  </div>
</template>

<script setup>
import { defineOptions } from 'vue';
import { convertClass } from '../utils' // keep import for any other usage
defineOptions({ name: 'mu-paper' });

defineProps({
  circle: Boolean,
  rounded: {
    type: Boolean,
    default: true
  },
  zDepth: {
    type: Number,
    default: 0,
    validator(val) {
      return val >= 0 && val < 25
    }
  }
})
</script>
