<template>
  <div
    ref="rootEl"
    class="mu-slider"
    :class="[rootColorClass, { zero: modelValue <= min, active, 'display-value': displayValue && active, disabled }]"
    :style="{ color: rootColor }"
    :tabindex="disabled ? -1 : 0"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeydown"
    @touchstart="handleTouchStart"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <input v-bind="inputAttrs" type="hidden" :value="modelValue" />
    <div v-if="displayValue" class="mu-slider-display-value" :class="thumbColorClass" :style="{ left: percent + '%', 'background-color': thumbBgColor }">
      <span class="display-value-text">{{ modelValue }}</span>
    </div>
    <div class="mu-slider-track" :class="trackColorClass" :style="{ 'background-color': trackBgColor }"></div>
    <div class="mu-slider-fill" :style="{ width: percent + '%' }"></div>
    <div class="mu-slider-thumb" :class="[thumbColorClass, thumbTextColorClass]" :style="{ left: percent + '%', color: thumbBgColor, 'background-color': thumbBgColor }">
      <FocusRipple v-if="showFocusRipple" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, useAttrs } from 'vue'
import keycode from 'keycode'
import FocusRipple from '../internal/FocusRipple'
import { useColor } from '../composables/useColor'

defineOptions({ name: 'mu-slider', inheritAttrs: false })

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  min: {
    type: Number,
    default: 0
  },
  step: {
    type: Number,
    default: 0.1
  },
  thumbColor: String,
  trackColor: String,
  disabled: Boolean,
  displayValue: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'drag-start', 'drag-stop'])

const { getNormalColorClass, getColor } = useColor(props)

const rootEl = ref(null)
const active = ref(false)
const hover = ref(false)
const focused = ref(false)
const dragging = ref(false)

let dragRunning = false

const percent = computed(() => {
  const percentNum = (props.modelValue - props.min) / (props.max - props.min) * 100
  return percentNum > 100 ? 100 : percentNum < 0 ? 0 : percentNum
})

const rootColorClass = computed(() => getNormalColorClass(props.color, true))
const rootColor = computed(() => getColor(props.color))
const thumbColorClass = computed(() => getNormalColorClass(props.thumbColor))
const thumbBgColor = computed(() => getColor(props.thumbColor))
const thumbTextColorClass = computed(() => getNormalColorClass(props.thumbColor, true))
const trackColorClass = computed(() => getNormalColorClass(props.trackColor))
const trackBgColor = computed(() => getColor(props.trackColor))
const showFocusRipple = computed(() => (focused.value || hover.value) && !active.value)

const inputAttrs = useAttrs()

function handleKeydown(e) {
  const { min, max, step } = props
  let action
  switch (keycode(e)) {
    case 'page down':
    case 'down':
      action = 'decrease'
      break
    case 'left':
      action = 'decrease'
      break
    case 'page up':
    case 'up':
      action = 'increase'
      break
    case 'right':
      action = 'increase'
      break
    case 'home':
      action = 'min'
      break
    case 'end':
      action = 'max'
      break
  }
  let value = props.modelValue
  if (action) {
    e.preventDefault()
    switch (action) {
      case 'decrease':
        value -= step
        break
      case 'increase':
        value += step
        break
      case 'min':
        value = min
        break
      case 'max':
        value = max
        break
    }
    value = parseFloat(value.toFixed(5))
    if (value > max) {
      value = max
    } else if (value < min) {
      value = min
    }
  }
  emit('update:modelValue', value)
}

function setValue(e) {
  const el = rootEl.value
  if (!el) return
  let value = (e.clientX - el.getBoundingClientRect().left) / el.offsetWidth * (props.max - props.min)
  value = Math.round(value / props.step) * props.step + props.min
  value = parseFloat(value.toFixed(5))
  if (value > props.max) {
    value = props.max
  } else if (value < props.min) {
    value = props.min
  }
  emit('update:modelValue', value)
}

function onDragStart(e) {
  dragging.value = true
  active.value = true
  emit('drag-start', e)
}

function onDragUpdate(e) {
  if (dragRunning) return
  dragRunning = true
  window.requestAnimationFrame(() => {
    dragRunning = false
    if (!props.disabled) setValue(e)
  })
}

function onDragStop(e) {
  dragRunning = false
  active.value = false
  emit('drag-stop', e)
}

function handleMouseDown(e) {
  if (props.disabled) return
  setValue(e)
  e.preventDefault()
  document.addEventListener('mousemove', handleDragMouseMove)
  document.addEventListener('mouseup', handleMouseEnd)
  e.currentTarget.focus()
  onDragStart(e)
}

function handleMouseUp() {
  if (props.disabled) return
  active.value = false
}

function handleTouchStart(e) {
  if (props.disabled) return
  setValue(e.touches[0])
  document.addEventListener('touchmove', handleTouchMove)
  document.addEventListener('touchend', handleTouchEnd)
  document.addEventListener('touchcancel', handleTouchEnd)
  e.preventDefault()
  onDragStart(e)
}

function handleTouchEnd(e) {
  if (props.disabled) return
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('touchcancel', handleTouchEnd)
  onDragStop(e)
}

function handleDragMouseMove(e) {
  onDragUpdate(e)
}

function handleTouchMove(e) {
  onDragUpdate(e.touches[0])
}

function handleMouseEnd(e) {
  document.removeEventListener('mousemove', handleDragMouseMove)
  document.removeEventListener('mouseup', handleMouseEnd)
  onDragStop(e)
}

function handleFocus() {
  if (props.disabled) return
  focused.value = true
}

function handleBlur() {
  if (props.disabled) return
  focused.value = false
}

function handleMouseEnter() {
  if (props.disabled) return
  hover.value = true
}

function handleMouseLeave() {
  if (props.disabled) return
  hover.value = false
}
</script>
