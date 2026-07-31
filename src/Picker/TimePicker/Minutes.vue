<template>
  <div class="mu-timepicker-minutes">
    <ClockPointer :hasSelected="minutes.hasSelected" :value="minutes.selected" type="minute" />
    <ClockNumber
      v-for="minute in minutes.numbers"
      :key="minute.minute"
      :value="minute.minute"
      type="minute"
      :selected="minute.isSelected"
    />
    <div
      ref="mask"
      class="mu-timepicker-minutes-mask"
      @mousedown="handleDown"
      @mouseup="handleUp"
      @mousemove="handleMove"
      @touchmove="handleTouch"
      @touchend="handleTouch"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import ClockNumber from './Number'
import ClockPointer from './Pointer'
import { getTouchEventOffsetValues, rad2deg } from './timeUtils'

const props = defineProps({
  initialMinutes: {
    type: Number,
    default() {
      return new Date().getMinutes()
    }
  }
})

const emit = defineEmits(['change'])

const center = ref({ x: 0, y: 0 })
const basePoint = ref({ x: 0, y: 0 })
const isMouseDown = ref(false)
const mask = ref(null)
const minutes = ref(null)

function getMinuteNumbers() {
  const minutesArr = []
  for (let i = 0; i < 12; i++) {
    minutesArr.push(i * 5)
  }
  const selectedMinutes = props.initialMinutes
  let hasSelected = false
  const numbers = minutesArr.map((minute) => {
    const isSelected = selectedMinutes === minute
    if (isSelected) hasSelected = true
    return { minute, isSelected }
  })
  return {
    numbers,
    hasSelected,
    selected: selectedMinutes
  }
}

minutes.value = getMinuteNumbers()

watch(() => props.initialMinutes, () => {
  minutes.value = getMinuteNumbers()
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

function isMousePressed(event) {
  if (typeof event.buttons === 'undefined') {
    return event.nativeEvent.which
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

function handleTouch(event) {
  event.preventDefault()
  setClock(event.changedTouches[0], event.type.toLowerCase() === 'touchend')
}

function setClock(event, finish) {
  if (typeof event.offsetX === 'undefined') {
    const offset = getTouchEventOffsetValues(event)
    event.offsetX = offset.offsetX
    event.offsetY = offset.offsetY
  }
  const val = getMinutes(event.offsetX, event.offsetY)
  emit('change', val, finish)
}

function getMinutes(offsetX, offsetY) {
  const step = 6
  const x = offsetX - center.value.x
  const y = offsetY - center.value.y
  const cx = basePoint.value.x - center.value.x
  const cy = basePoint.value.y - center.value.y
  const atan = Math.atan2(cx, cy) - Math.atan2(x, y)
  let deg = rad2deg(atan)
  deg = Math.round(deg / step) * step
  deg %= 360
  const value = Math.floor(deg / step) || 0
  return value
}
</script>
