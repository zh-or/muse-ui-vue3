<template>
  <ul ref="rootRef" :class="['mu-list', textlineClass, { 'mu-list-dense': dense }]">
    <slot />
  </ul>
</template>

<script setup>
import { ref, computed, provide, defineOptions } from 'vue'

defineOptions({ name: 'mu-list' })

const props = defineProps({
  nestedLevel: { type: Number, default: 0 },
  textline: { type: String, default: '', validator: (v) => ['', 'two-line', 'three-line'].indexOf(v) !== -1 },
  nestedIndent: { type: Boolean, default: true },
  toggleNested: Boolean,
  toggleNestedType: { type: String, default: 'expand' },
  dense: Boolean,
  value: {}
})

const emit = defineEmits(['change', 'item-click'])

const rootRef = ref(null)
defineExpose({ root: rootRef })

function listItemClick(item) { emit('change', item.value); emit('item-click', item) }

provide('listItemClick', listItemClick)
provide('getNestedLevel', () => props.nestedLevel)
provide('getToggleNested', () => props.toggleNested)
provide('getToggleNestedType', () => props.toggleNestedType)
provide('getListValue', () => props.value)
provide('getNestedIndent', () => props.nestedIndent)
provide('textline', props.textline)

const textlineClass = computed(() => props.textline ? 'mu-list-' + props.textline : '')
</script>
