<template>
  <div ref="rootEl" :class="['mu-refresh-control', refreshClass]" :style="refreshStyle">
    <Circular v-if="refreshing" :size="24" :border-width="2" />
    <svg v-else-if="draging" class="mu-refresh-svg-icon" :style="circularStyle" viewBox="0 0 24 24">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineOptions } from 'vue'

defineOptions({ name: 'mu-refresh-control' })
import Circular from '../Progress/Circular'
import { transitionEnd, getScrollEventTarget } from '../utils/dom'
import Drag from '../utils/drag'

const LENGTH = 130
const INITY = -68

const props = defineProps({ refreshing: Boolean, trigger: {} })
const emit = defineEmits(['refresh'])

const y = ref(0)
const draging = ref(false)
const state = ref('ready')
const rootEl = ref(null)
let drager = null
let handlePrevent = null
let handleTouchEnd = null

const refreshStyle = computed(() => {
  if (!props.refreshing && draging.value) {
    const translate3d = 'translate3d(0, ' + (y.value + INITY) + 'px, 0) '
    return { '-webkit-transform': translate3d, transform: translate3d }
  }
  return {}
})

const circularStyle = computed(() => {
  if (!props.refreshing && draging.value) {
    const percentage = y.value / LENGTH
    const rotate = 'rotate(' + (360 * percentage) + 'deg)'
    const opacity = y.value / Math.abs(INITY)
    return { '-webkit-transform': rotate, transform: rotate, opacity }
  }
  return {}
})

const refreshClass = computed(() => {
  const c = []
  switch (state.value) {
    case 'ready': c.push('mu-refresh-control-noshow'); break
    case 'dragStart': c.push('mu-refresh-control-hide'); break
    case 'dragAnimate': c.push('mu-refresh-control-animate', 'mu-refresh-control-hide'); break
    case 'refreshAnimate': c.push('mu-refresh-control-animate', 'mu-refresh-control-noshow'); break
  }
  if (props.refreshing) c.push('mu-refresh-control-refreshing')
  return c
})

function clearState() { state.value = 'ready'; draging.value = false; y.value = 0 }

function getScrollTop() {
  const scroller = getScrollEventTarget(rootEl.value)
  if (scroller === window) return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop)
  return scroller.scrollTop
}

function bindDrag() {
  if (!props.trigger) return
  drager = new Drag(props.trigger)
  state.value = 'ready'
  drager.start(() => {
    if (props.refreshing) return
    state.value = 'dragStart'
    const scrollTop = getScrollTop()
    if (scrollTop === 0) draging.value = true
  }).drag((pos, event) => {
    const scrollTop = getScrollTop()
    if (pos.y < 5 || props.refreshing || scrollTop !== 0) return
    if (scrollTop === 0 && !draging.value) { draging.value = true; drager.reset(event) }
    y.value = pos.y / 2
    if (y.value < 0) y.value = 1
    if (y.value > LENGTH) y.value = LENGTH
  }).end((pos, event) => {
    if (!pos.y || pos.y < 5) { clearState(); return }
    const canRefresh = y.value + INITY > 0 && draging.value
    state.value = 'dragAnimate'
    if (canRefresh) {
      draging.value = false
      emit('refresh')
    } else {
      y.value = 0
      transitionEnd(rootEl.value, clearState)
    }
  })

  handlePrevent = (event) => { if (draging.value && y.value > 0) event.preventDefault() }
  handleTouchEnd = () => true
  props.trigger.addEventListener('touchmove', handlePrevent, { passive: false })
  props.trigger.addEventListener('touchend', handleTouchEnd, { passive: false })
}

function unbindDrag() {
  if (!drager) return
  if (handlePrevent) {
    props.trigger.removeEventListener('touchmove', handlePrevent)
    props.trigger.removeEventListener('touchend', handleTouchEnd)
  }
  drager.destory()
  drager = null
}

onMounted(() => bindDrag())
onBeforeUnmount(() => unbindDrag())

watch(() => props.refreshing, (val) => {
  if (!val) { transitionEnd(rootEl.value, clearState) } else { state.value = 'refreshAnimate' }
})
watch(() => props.trigger, (trigger, oldTrigger) => {
  if (trigger === oldTrigger) return
  unbindDrag()
  bindDrag()
})
</script>
