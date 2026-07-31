<template>
  <header
    :class="`mu-appbar ${getColorClass()} ${getTextColorClass()} mu-elevation-${zDepth}`"
    :style="{ 'background-color': getColor(color), color: getColor(textColor) }"
  >
    <div v-if="$slots.left" class="mu-appbar-left">
      <slot name="left" />
    </div>
    <div class="mu-appbar-title">
      <slot />
      <template v-if="!$slots.default && title">{{ title }}</template>
    </div>
    <div v-if="$slots.right" class="mu-appbar-right">
      <slot name="right" />
    </div>
  </header>
</template>

<script setup>
import { useColor } from '../composables/useColor'

defineOptions({ name: 'mu-appbar' })

const props = defineProps({
  zDepth: {
    type: [Number, String],
    default: 4,
    validator: (val) => val >= 0 && val <= 24
  },
  title: {
    type: String,
    default: ''
  },
  textColor: String,
  color: String
})

const { getColorClass, getTextColorClass, getColor } = useColor(props)
</script>
