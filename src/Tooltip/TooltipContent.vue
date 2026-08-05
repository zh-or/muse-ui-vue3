<template>
  <Transition :name="'mu-tooltip-' + placement.split('-')[0]">
    <div
      v-if="open"
      v-resize="setStyle"
      v-scroll="setStyle"
      class="mu-tooltip"
      :style="{ 'z-index': zIndex }"
      ref="tooltipEl"
    >
      <slot />
    </div>
  </Transition>
</template>

<script>
import resize from '../internal/directives/resize'
import scroll from '../internal/directives/scroll'
export default { directives: { resize, scroll } }
</script>

<script setup>
import { ref, Transition, onMounted, onUpdated } from 'vue'
import { usePopup, popupOpenProps } from '../composables/usePopup'

defineOptions({
  directives: { resize, scroll }
})

const SPACE = 8
const props = defineProps({
  ...popupOpenProps,
  overlay: { default: false },
  escPressClose: { default: false },
  placement: {
    type: String,
    default: 'bottom',
    validator(val) {
      return ['top','top-start','top-end','bottom','bottom-start','bottom-end','left','left-start','left-end','right','right-start','right-end'].indexOf(val) !== -1
    }
  },
  trigger: {}
})

const emit = defineEmits(['mouseenter', 'mouseleave'])
const tooltipEl = ref(null)
const { zIndex } = usePopup(props, { emit }, tooltipEl)

function getLeftPosition(width, react) {
  switch (props.placement) {
    case 'left': case 'left-start': case 'left-end': return react.left - width - SPACE
    case 'right': case 'right-start': case 'right-end': return react.left + react.width + SPACE
    case 'top': case 'bottom': return react.left + react.width / 2 - width / 2
    case 'bottom-start': case 'top-start': return react.left
    case 'bottom-end': case 'top-end': return react.left + react.width - width
  }
}

function getTopPosition(height, react) {
  switch (props.placement) {
    case 'top': case 'top-start': case 'top-end': return react.top - height - SPACE
    case 'bottom': case 'bottom-start': case 'bottom-end': return react.top + react.height + SPACE
    case 'left': case 'right': return react.top + react.height / 2 - height / 2
    case 'left-start': case 'right-start': return react.top
    case 'left-end': case 'right-end': return react.top + react.height - height
  }
}

function setStyle() {
  if (!props.open) return
  const el = tooltipEl.value
  const triggerEl = props.trigger
  if (!el || !triggerEl) return
  const elReact = el.getBoundingClientRect()
  const react = triggerEl.getBoundingClientRect()
  el.style.top = getTopPosition(elReact.height, react) + 'px'
  el.style.left = getLeftPosition(elReact.width, react) + 'px'
}

onMounted(() => setStyle())
onUpdated(() => setTimeout(() => setStyle(), 0))
</script>
