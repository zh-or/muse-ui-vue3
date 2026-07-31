<template>
  <div
    class="mu-avatar"
    :class="[getColorClass(), getTextColorClass()]"
    :style="{
      width: sizeWidth,
      height: sizeWidth,
      'font-size': fontSize,
      'background-color': getColor(color),
      color: getColor(textColor)
    }"
  >
    <div class="mu-avatar-inner">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed, defineOptions } from 'vue'
defineOptions({ name: 'mu-avatar' })
import { getWidth } from '../utils'
import { useColor } from '../composables/useColor'

const props = defineProps({
  textColor: String,
  size: {
    type: [Number, String],
    default: 40
  },
  color: String
})

const { getColorClass, getTextColorClass, getColor } = useColor(props)

const sizeWidth = computed(() => getWidth(props.size))
const fontSize = computed(() => props.size / 2 + 'px')
</script>
