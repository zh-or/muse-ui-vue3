<template>
  <component
    :is="tag"
    @mousedown="autoBind ? handleMouseDown($event) : undefined"
    @mouseup="autoBind ? end() : undefined"
    @mouseleave="autoBind ? end() : undefined"
    @touchstart.passive="autoBind ? handleTouchStart($event) : undefined"
    @touchend="autoBind ? end() : undefined"
    @touchcancel="autoBind ? end() : undefined"
  >
    <div
      ref="holderRef"
      class="mu-ripple-wrapper"
      :class="[rippleWrapperClass]"
    >
      <CircleRipple
        v-for="ripple in ripples"
        :key="ripple.key"
        :color="ripple.color"
        :opacity="ripple.opacity"
        :merge-style="ripple.style"
        :leaving="ripple.leaving"
      />
    </div>
    <slot />
  </component>
</template>

<script setup>
import { ref } from 'vue'
import CircleRipple from './CircleRipple.vue'
import { getOffset } from '../utils/dom'

const props = defineProps({
  centerRipple: {
    type: Boolean,
    default: false
  },
  rippleWrapperClass: {},
  tag: {
    type: String,
    default: 'div'
  },
  autoBind: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: ''
  },
  opacity: Number
})

const nextKey = ref(0)
const ripples = ref([])
const holderRef = ref(null)
const ignoreNextMouseDown = ref(false)
const handleMove = ref(null)
let firstTouchY = 0
let firstTouchX = 0
let startTime = 0

function start(event, isRippleTouchGenerated) {
  if (ignoreNextMouseDown.value && !isRippleTouchGenerated) {
    ignoreNextMouseDown.value = false
    return
  }
  ripples.value.push({
    key: nextKey.value++,
    color: props.color,
    opacity: props.opacity,
    style: props.centerRipple ? {} : getRippleStyle(event)
  })
  ignoreNextMouseDown.value = isRippleTouchGenerated
}

function end() {
  const activeRipples = ripples.value.filter((ripple) => !ripple.leaving)
  if (activeRipples.length === 0) return
  activeRipples.forEach((ripple) => {
    ripple.leaving = true
    setTimeout(() => {
      ripples.value = ripples.value.filter((item) => item !== ripple)
    }, 450)
  })
  stopListeningForScrollAbort()
}

function stopListeningForScrollAbort() {
  if (!handleMove.value) {
    handleMove.value = handleTouchMove
  }
  document.body.removeEventListener('touchmove', handleMove.value, false)
}

function startListeningForScrollAbort(event) {
  firstTouchY = event.touches[0].clientY
  firstTouchX = event.touches[0].clientX
  document.body.addEventListener('touchmove', handleMove.value, false)
}

function handleMouseDown(event) {
  if (event.button === 0) {
    start(event, false)
  }
}

function handleTouchStart(event) {
  if (!handleMove.value) {
    handleMove.value = handleTouchMove
  }
  if (event.touches) {
    startListeningForScrollAbort(event)
    startTime = Date.now()
  }
  start(event.touches[0], true)
}

function handleTouchMove(event) {
  const deltaY = Math.abs(event.touches[0].clientY - firstTouchY)
  const deltaX = Math.abs(event.touches[0].clientX - firstTouchX)
  if (deltaY > 6 || deltaX > 6) end()
}

function getRippleStyle(event) {
  const el = holderRef.value
  if (!el) return {}
  const offset = getOffset(el)
  const elHeight = el.offsetHeight
  const elWidth = el.offsetWidth
  const isTouchEvent = event.touches && event.touches.length
  const pageX = isTouchEvent ? event.touches[0].pageX : event.pageX
  const pageY = isTouchEvent ? event.touches[0].pageY : event.pageY
  const pointerX = pageX - offset.left
  const pointerY = pageY - offset.top
  const topLeftDiag = calcDiag(pointerX, pointerY)
  const topRightDiag = calcDiag(elWidth - pointerX, pointerY)
  const botRightDiag = calcDiag(elWidth - pointerX, elHeight - pointerY)
  const botLeftDiag = calcDiag(pointerX, elHeight - pointerY)
  const rippleRadius = Math.max(topLeftDiag, topRightDiag, botRightDiag, botLeftDiag)
  const rippleSize = rippleRadius * 2
  const left = pointerX - rippleRadius
  const top = pointerY - rippleRadius

  return {
    directionInvariant: true,
    height: rippleSize + 'px',
    width: rippleSize + 'px',
    top: top + 'px',
    left: left + 'px'
  }
}

function calcDiag(a, b) {
  return Math.sqrt((a * a) + (b * b))
}

defineExpose({ start, end, handleMouseDown, handleTouchStart, root: holderRef })
</script>

<style lang="less">
@import '../styles/components/touch-ripple.less';
</style>
