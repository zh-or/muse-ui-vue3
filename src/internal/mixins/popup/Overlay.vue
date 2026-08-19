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
import { ref, computed, inject } from 'vue'
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

const state = inject('overlayState', null)
const show = ref(false)

const overlayStyle = computed(() => ({
  opacity: state ? state.opacity : props.opacity,
  'background-color': state ? state.color : props.color,
  position: props.fixed ? 'fixed' : '',
  'z-index': state ? state.zIndex : props.zIndex
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
