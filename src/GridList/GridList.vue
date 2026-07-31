<template>
  <div class="mu-grid-list" :style="{ margin: -padding / cols + 'px' }">
    <slot />
  </div>
</template>
<script setup>
import { provide, defineOptions } from 'vue'

defineOptions({ name: 'mu-grid-list' })
const props = defineProps({ cellHeight: { type: Number, default: 180 }, cols: { type: Number, default: 2 }, padding: { type: Number, default: 4 } })
provide('getGridListCellHeight', () => props.cellHeight)
provide('getGridListCols', () => props.cols)
provide('getGridListPadding', () => props.padding)
</script>
