<template>
  <div
    class="mu-circular-progress"
    :class="[getColorClass()]"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <Circular
      v-if="mode === 'indeterminate'"
      :size="size"
      :color="color"
      :border-width="strokeWidth"
    />
    <svg
      v-if="mode === 'determinate'"
      class="mu-circular-progress-determinate"
      :style="circularSvgStyle"
      :viewBox="'0 0 ' + size + ' ' + size"
    >
      <circle
        class="mu-circular-progress-determinate-path"
        :style="circularPathStyle"
        :r="radius"
        :cx="size / 2"
        :cy="size / 2"
        fill="none"
        stroke-miterlimit="20"
        :stroke-width="strokeWidth"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed, defineOptions } from 'vue'

defineOptions({ name: 'mu-circular-progress' })
import Circular from './Circular.vue'
import { useColor } from '../composables/useColor'

const props = defineProps({
  max: {
    type: Number,
    default: 100
  },
  min: {
    type: Number,
    default: 0
  },
  mode: {
    type: String,
    default: 'indeterminate',
    validator(val) {
      return ['indeterminate', 'determinate'].indexOf(val) !== -1
    }
  },
  value: {
    type: Number,
    default: 0
  },
  size: {
    type: Number,
    default: 24
  },
  strokeWidth: {
    type: Number,
    default: 3
  },
  color: {
    type: String,
    default: ''
  }
})

const { getColorClass, getColor } = useColor(props)

const radius = computed(() => (props.size - props.strokeWidth) / 2)

const circularSvgStyle = computed(() => ({
  width: props.size,
  height: props.size
}))

function getArcLength(fraction) {
  return fraction * Math.PI * (props.size - props.strokeWidth)
}

function getRelativeValue() {
  const { value, min, max } = props
  const clampedValue = Math.min(Math.max(min, value), max)
  return clampedValue / (max - min)
}

const circularPathStyle = computed(() => {
  const relVal = getRelativeValue()
  return {
    stroke: getColor(props.color),
    'stroke-dasharray': `${getArcLength(relVal)}, ${getArcLength(1)}`
  }
})
</script>
