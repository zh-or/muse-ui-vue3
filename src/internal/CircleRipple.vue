<template>
  <div
    class="mu-circle-ripple"
    :class="{ 'mu-ripple-leave-active': leaving }"
    :style="styles"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  mergeStyle: {
    type: Object,
    default() {
      return {}
    }
  },
  color: {
    type: String,
    default: ''
  },
  opacity: {
    type: Number
  },
  leaving: {
    type: Boolean,
    default: false
  }
})

const styles = computed(() => {
  const { color, opacity, mergeStyle } = props
  const { directionInvariant, ...cssStyle } = mergeStyle
  return { color, opacity, ...cssStyle }
})
</script>

<style lang="less">
@import '../styles/components/circle-ripple.less';
</style>
