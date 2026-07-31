<template>
  <div class="mu-focus-ripple-wrapper">
    <div
      ref="innerCircleRef"
      class="mu-focus-ripple"
      :style="style"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: ''
  },
  opacity: {
    type: Number
  }
})

const innerCircleRef = ref(null)

const style = computed(() => ({
  color: props.color,
  opacity: props.opacity
}))

function setRippleSize() {
  const el = innerCircleRef.value
  if (!el) return
  const height = el.offsetHeight
  const width = el.offsetWidth
  const size = Math.max(height, width)

  let oldTop = 0
  if (el.style.top.indexOf('px', el.style.top.length - 2) !== -1) {
    oldTop = parseInt(el.style.top)
  }

  el.style.height = `${size}px`
  el.style.top = `${(height / 2) - (size / 2) + oldTop}px`
}

onMounted(() => setRippleSize())
onUpdated(() => setRippleSize())
</script>

<style lang="less">
@import '../styles/components/focus-ripple.less';
</style>
