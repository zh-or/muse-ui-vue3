<template>
  <transition name="mu-popover-transition">
    <div
      v-if="open"
      ref="rootRef"
      :class="['mu-popover', transitionName]"
      :style="{ 'z-index': zIndex }"
      v-resize="setStyle"
      v-scroll="{ target: trigger, callback: setStyle }"
      v-click-outside="clickOutSideHandler"
    >
      <slot />
    </div>
  </transition>
</template>

<script>
import resize from '../internal/directives/resize'
import scroll from '../internal/directives/scroll'
import clickOutSide from '../internal/directives/click-outside'
export default { directives: { resize, scroll, clickOutside: clickOutSide } }
</script>

<script setup>
import { ref, computed, onMounted, onUpdated } from 'vue'
import { usePopup, popupOpenProps } from '../composables/usePopup'

defineOptions({ name: 'mu-popover', inheritAttrs: false })

const SPACE = 8
const emit = defineEmits(['update:open', 'close'])
const props = defineProps({
  ...popupOpenProps,
  overlay: { default: false },
  appendBody: { type: Boolean, default: false },
  lazy: Boolean,
  cover: Boolean,
  space: { type: Number, default: 0 },
  trigger: {},
  placement: {
    type: String,
    default: 'bottom-start',
    validator: (val) => ['top','top-start','top-end','bottom','bottom-start','bottom-end','left','left-start','left-end','right','right-start','right-end'].indexOf(val) !== -1
  }
})

const rootRef = ref(null)
const { zIndex } = usePopup(props, { emit }, rootRef)
defineExpose({ root: rootRef })

function getLeftPosition(width, react) {
  let left = 0
  const maxLeft = window.innerWidth - SPACE - width
  const minLeft = SPACE
  switch (props.placement) {
    case 'left': case 'left-start': case 'left-end':
      left = react.left - width - props.space
      if (props.cover) left += react.width
      else if (left < minLeft) left = react.left + react.width + props.space
      break
    case 'right': case 'right-start': case 'right-end':
      left = props.cover ? react.left : react.left + react.width > maxLeft ? react.left - width - props.space : react.left + react.width + props.space
      break
    case 'top': case 'bottom': left = react.left + react.width / 2 - width / 2; break
    case 'bottom-start': case 'top-start': left = react.left; break
    case 'bottom-end': case 'top-end': left = react.left + react.width - width; break
  }
  left = Math.min(maxLeft, left); left = Math.max(minLeft, left)
  return left
}

function getTopPosition(height, react) {
  let top = 0
  const maxTop = window.innerHeight - SPACE - height
  const minTop = SPACE
  switch (props.placement) {
    case 'top': case 'top-start': case 'top-end':
      top = react.top - height
      if (!props.cover) { top += props.space; if (top < minTop) top = react.top + react.height + props.space }
      else top += react.height
      break
    case 'bottom': case 'bottom-start': case 'bottom-end':
      top = props.cover ? react.top : react.top + react.height + props.space > maxTop ? react.top - height - props.space : react.top + react.height + props.space
      break
    case 'left': case 'right': top = react.top + react.height / 2 - height / 2; break
    case 'left-start': case 'right-start': top = react.top; break
    case 'left-end': case 'right-end': top = react.top + react.height - height; break
  }
  top = Math.min(maxTop, top); top = Math.max(minTop, top)
  return top
}

function setStyle() {
  if (!props.open) return
  const el = rootRef.value
  const triggerEl = props.trigger
  if (!el || !triggerEl) return
  const react = triggerEl.getBoundingClientRect()
  if (react.top < -react.height || react.top > window.innerHeight) close('overflow')
  el.style.top = getTopPosition(el.offsetHeight, react) + 'px'
  el.style.left = getLeftPosition(el.offsetWidth, react) + 'px'
}

function close(reason) { if (!props.open) return; emit('update:open', false); emit('close', reason) }

function clickOutSideHandler(e) {
  if (props.trigger && props.trigger.contains(e.target)) return
  close('clickOutSide')
}

const transitionName = computed(() => {
  if (props.cover) return `transition-${props.placement}`
  return props.placement.indexOf('top') !== -1 || ['left-end', 'right-end'].indexOf(props.placement) !== -1
    ? 'transition-top' : 'transition-bottom'
})

onMounted(() => setStyle())
onUpdated(() => setTimeout(() => setStyle(), 0))
</script>
