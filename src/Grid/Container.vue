<template>
  <div :class="fluid ? 'container-fluid' : 'container'">
    <slot />
  </div>
</template>
<script setup>
import { defineOptions } from 'vue'

defineOptions({ name: 'mu-container' })
defineProps({ fluid: Boolean })
</script>
