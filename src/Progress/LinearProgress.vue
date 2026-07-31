<template>
  <div
    class="mu-linear-progress"
    :class="[getColorClass()]"
    :style="{ height: size + 'px' }"
  >
    <div
      class="mu-linear-progress-background"
      :style="{ 'background-color': getColor(color) }"
    />
    <div
      :style="linearStyle"
      :class="linearClass"
    />
  </div>
</template>

<script setup>
import { computed, defineOptions } from 'vue'

defineOptions({ name: 'mu-linear-progress' })
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
  size: [Number, String],
  color: {
    type: String,
    default: ''
  }
})

const { getColorClass, getColor } = useColor(props)

const percent = computed(() => (props.value - props.min) / (props.max - props.min) * 100)

const linearStyle = computed(() => ({
  'background-color': getColor(props.color),
  width: props.mode === 'determinate' ? percent.value + '%' : ''
}))

const linearClass = computed(() => 'mu-linear-progress-' + props.mode)
</script>
