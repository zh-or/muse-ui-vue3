<template>
  <span
    :class="['mu-timepicker-number ' + (selected ? bgColorClass : ''), numberClass]"
    :style="{ 'background-color': selected ? color : '', ...numberStyle }"
  >{{ value === 0 ? '00' : value }}</span>
</template>

<script setup>
import { inject, computed } from 'vue'
import { isInner as isInnerValue } from './timeUtils'

const getColorObject = inject('getColorObject')
const colorObj = computed(() => getColorObject())
const color = computed(() => colorObj.value.color)
const bgColorClass = computed(() => colorObj.value.bgColorClass)

const props = defineProps({
  value: { type: Number, default: 0 },
  type: { type: String, default: 'minute', validator: (val) => ['hour', 'minute'].includes(val) },
  selected: { type: Boolean, default: false }
})

const positions = [
  [0, 5], [54.5, 16.6], [94.4, 59.5], [109, 114], [94.4, 168.5],
  [54.5, 208.4], [0, 223], [-54.5, 208.4], [-94.4, 168.5],
  [-109, 114], [-94.4, 59.5], [-54.5, 19.6]
]

const innerPositions = [
  [0, 40], [36.9, 49.9], [64, 77], [74, 114], [64, 151],
  [37, 178], [0, 188], [-37, 178], [-64, 151], [-74, 114],
  [-64, 77], [-37, 50]
]

const isInner = computed(() => isInnerValue(props))

const numberClass = computed(() => ({
  'mu-timepicker-number__selected': props.selected,
  'mu-timepicker-number__inner': isInner.value
}))

const numberStyle = computed(() => {
  let pos = props.value
  if (props.type === 'hour') {
    pos %= 12
  } else {
    pos = pos / 5
  }
  let transformPos = positions[pos]
  if (isInner.value) transformPos = innerPositions[pos]
  const [x, y] = transformPos
  return {
    transform: `translate(${x}px, ${y}px)`,
    left: isInner.value ? 'calc(50% - 14px)' : 'calc(50% - 16px)'
  }
})
</script>
