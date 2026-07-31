<template>
  <component :is="tag || 'div'" :class="[inline ? 'd-inline-flex' : 'd-flex', flexClass].join(' ')">
    <slot />
  </component>
</template>
<script setup>
import { computed, defineOptions } from 'vue'

defineOptions({ name: 'mu-flex' })
import { props as flexProps, generatePropsClass } from './utils'
const props = defineProps({ tag: String, inline: Boolean, ...flexProps })
const flexClass = computed(() => generatePropsClass(props))
</script>
