<template>
  <div class="mu-badge-container">
    <slot />
    <em
      class="mu-badge"
      :class="[convertClass(badgeClass), getColorClass(), {
        'mu-badge-circle': circle,
        'mu-badge-float': $slots.default
      }]"
      :style="{ 'background-color': getColor(color) }"
    >
      <slot name="content">{{ content }}</slot>
    </em>
  </div>
</template>

<script setup>
import { defineOptions } from 'vue';
import { convertClass } from '../utils'
import { useColor } from '../composables/useColor'

defineOptions({ name: 'mu-badge' })

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  circle: Boolean,
  badgeClass: [String, Object, Array],
  color: String
})

const { getColorClass, getColor } = useColor(props)
</script>
