<template>
  <div
    class="mu-circle-wrapper active"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <div
      class="mu-circle-spinner active"
      :class="[getColorClass()]"
      :style="{ 'border-color': getColor(color) }"
    >
      <div class="mu-circle-clipper left">
        <div class="mu-circle" :style="{ 'border-width': borderWidth + 'px' }" />
      </div>
      <div class="mu-circle-gap-patch">
        <div class="mu-circle" />
      </div>
      <div class="mu-circle-clipper right">
        <div class="mu-circle" :style="{ 'border-width': borderWidth + 'px' }" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineOptions } from 'vue'
import { useColor } from '../composables/useColor'

defineOptions({ name: 'mu-circular-progress' })

const props = defineProps({
  size: {
    type: Number,
    default: 24
  },
  color: {
    type: String,
    default: ''
  },
  borderWidth: {
    type: Number,
    default: 3
  }
})

const { getColorClass, getColor } = useColor(props)
</script>
