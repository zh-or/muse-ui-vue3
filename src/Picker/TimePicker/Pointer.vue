<template>
  <span v-if="value === undefined || value === null"></span>
  <div v-else class="mu-timepicker-pointer" :class="{ inner: isInnerVal }" :style="pointerStyle">
    <div class="mu-timepicker-pointer-mark" :class="{ 'has-selected': hasSelected }"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isInner as isInnerFunc } from './timeUtils'

const props = defineProps({
  hasSelected: { type: Boolean, default: false },
  type: { type: String, default: 'minute', validator: (val) => ['hour', 'minute'].includes(val) },
  value: { type: Number }
})

function calcAngle(value, base) {
  value %= base
  return 360 / base * value
}

const isInnerVal = computed(() => isInnerFunc(props))

const pointerStyle = computed(() => {
  const { type, value } = props
  const angle = type === 'hour' ? calcAngle(value, 12) : calcAngle(value, 60)
  return { transform: `rotateZ(${angle}deg)` }
})
</script>
