<template>
  <component :is="tag || 'div'" :class="['row', gutterClass, flexClass].join(' ')">
    <slot />
  </component>
</template>
<script setup>
import { computed, defineOptions } from 'vue'

defineOptions({ name: 'mu-row' })
import { props as flexProps, generatePropsClass } from './utils'
const props = defineProps({ ...flexProps, tag: String, gutter: Boolean })
const gutterClass = computed(() => !props.gutter ? 'no-gutters' : '')
const flexClass = computed(() => generatePropsClass(props))
</script>
