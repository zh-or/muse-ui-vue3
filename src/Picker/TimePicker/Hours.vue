<template>
  <div class="mu-timepicker-hours">
    <ClockPointer :value="getSelected()" type="hour" :hasSelected="true" />
    <ClockNumber
      v-for="hour in hours"
      :key="hour"
      :value="hour"
      type="hour"
      :selected="getSelected() === hour"
    />
    <div
      ref="mask"
      class="mu-timepicker-hours-mask"
      @mousedown="handleDown"
      @mouseup="handleUp"
      @mousemove="handleMove"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ClockNumber from './Number'
import ClockPointer from './Pointer'
import { getTouchEventOffsetValues, rad2deg } from './timeUtils'

const props = defineProps({
  format: {
    type: String,
    default: 'ampm',
    validator(val) {
      return ['ampm', '24hr'].indexOf(val) !== -1
    }
  },
  initialHours: {
    type: Number,
    default: new Date().getHours()
  }
})

const emit = defineEmits(['change'])

const center = ref({ x: 0, y: 0 })
const basePoint = ref({ x: 0, y: 0 })
const isMouseDown = ref(false)
const mask = ref(null)

const hours = computed(() => {
  const hourSize = props.format === 'ampm' ? 12 : 24
  const hours = []
  for (let i = 1; i <= hourSize; i++) {
    hours.push(i % 24)
  }
  return hours
})

onMounted(() => {
  const clockElement = mask.value
  center.value = {
    x: clockElement.offsetWidth / 2,
    y: clockElement.offsetHeight / 2
  }
  basePoint.value = {
    x: center.value.x,
    y: 0
  }
})

function getSelected() {
  let hour = props.initialHours
  if (props.format === 'ampm') {
    hour %= 12
    hour = hour || 12
  }
  return hour
}

function isMousePressed(event) {
  if (typeof event.buttons === 'undefined') {
    return event.which
  }
  return event.buttons
}

function handleDown() {
  isMouseDown.value = true
}

function handleUp(event) {
  if (!isMouseDown.value) return
  event.preventDefault()
  isMouseDown.value = false
  setClock(event, true)
}

function handleMove(event) {
  event.preventDefault()
  if (isMousePressed(event) !== 1) return
  setClock(event, false)
}

function handleTouchMove(event) {
  event.preventDefault()
  setClock(event.changedTouches[0], false)
}

function handleTouchEnd(event) {
  event.preventDefault()
  setClock(event.changedTouches[0], true)
}

function setClock(event, finish) {
  if (typeof event.offsetX === 'undefined') {
    const offset = getTouchEventOffsetValues(event)
    event.offsetX = offset.offsetX
    event.offsetY = offset.offsetY
  }
  const val = getHours(event.offsetX, event.offsetY)
  emit('change', val, finish)
}

function getHours(offsetX, offsetY) {
  const step = 30
  const x = offsetX - center.value.x
  const y = offsetY - center.value.y
  const cx = basePoint.value.x - center.value.x
  const cy = basePoint.value.y - center.value.y
  const atan = Math.atan2(cx, cy) - Math.atan2(x, y)
  let deg = rad2deg(atan)
  deg = Math.round(deg / step) * step
  deg %= 360
  let value = Math.floor(deg / step) || 0
  const delta = Math.pow(x, 2) + Math.pow(y, 2)
  const distance = Math.sqrt(delta)
  value = value || 12
  if (props.format === '24hr') {
    if (distance < 90) {
      value += 12
      value %= 24
    }
  } else {
    value %= 12
  }
  return value
}
</script>
