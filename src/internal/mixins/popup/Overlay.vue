<template>
  <Transition name="mu-fade-transition">
    <div
      v-if="show"
      class="mu-overlay"
      :style="overlayStyle"
      @click="handleClick"
      @touchmove.prevent
    ></div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import '../../../styles/components/overlay.less'

defineOptions({ name: 'mu-overlay' })

const props = defineProps({
  fixed: Boolean,
  onClick: Function,
  opacity: {
    type: Number,
    default: 0.4
  },
  color: String,
  zIndex: Number
})

const show = ref(false)

const overlayStyle = computed(() => ({
  opacity: props.opacity,
  'background-color': props.color,
  position: props.fixed ? 'fixed' : '',
  'z-index': props.zIndex
}))

function handleClick() {
  if (props.onClick) props.onClick()
}

function open() {
  show.value = true
}

function close() {
  show.value = false
}

defineExpose({ open, close })
</script>
