<template>
  <component :is="tag || 'div'" :class="['col', colClass, flexClass].join(' ')">
    <slot />
  </component>
</template>
<script setup>
import { computed, defineOptions } from 'vue'

defineOptions({ name: 'mu-col' })
import { props as flexProps, generatePropsClass } from './utils'

const props = defineProps({
  tag: String,
  ...flexProps,
  fill: Boolean,
  span: [String, Number], sm: [String, Number], md: [String, Number], lg: [String, Number], xl: [String, Number],
  order: [String, Number], offset: [String, Number]
})

const colClass = computed(() => {
  const c = []
  if (props.span) c.push('col-' + props.span)
  if (props.sm) c.push('col-sm-' + props.sm)
  if (props.md) c.push('col-md-' + props.md)
  if (props.lg) c.push('col-lg-' + props.lg)
  if (props.xl) c.push('col-xl-' + props.xl)
  if (props.order) c.push('order-' + props.order)
  if (props.offset) c.push('offset-' + props.offset)
  return c.join(' ')
})

const flexClass = computed(() => generatePropsClass(props))
</script>
