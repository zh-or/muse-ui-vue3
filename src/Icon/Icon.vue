<template>
  <i
    v-if="value"
    class="mu-icon"
    :class="[
      isMaterial ? 'material-icons' : value.substring(1),
      { 'mu-icon-left': left, 'mu-icon-right': right },
      colorClass
    ]"
    :style="{
      'user-select': 'none',
      'font-size': size + 'px',
      width: size + 'px',
      height: size + 'px',
      color: computedColor
    }"
  >{{ isMaterial ? value : '' }}</i>
</template>

<script setup>
import { computed, defineOptions } from 'vue'
defineOptions({ name: 'mu-icon' })
import { convertClass, getColor } from '../utils'

const props = defineProps({
  value: String,
  left: Boolean,
  right: Boolean,
  size: [Number, String],
  color: String
})

const isMaterial = computed(() => !props.value || props.value.indexOf(':') !== 0)

const themes = ['primary', 'secondary', 'success', 'warning', 'info', 'error']

const colorClass = computed(() => {
  const cls = themes.reduce((acc, t) => {
    acc[`mu-${t}-text-color`] = props.color === t
    return acc
  }, {})
  return convertClass(cls)
})

const computedColor = computed(() => getColor(props.color))
</script>
