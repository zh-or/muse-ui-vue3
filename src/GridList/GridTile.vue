<template>
  <div class="mu-grid-tile-wrapper" :style="tileStyle">
    <div :class="['mu-grid-tile', tileClass]">
      <slot />
      <div class="mu-grid-tile-titlebar">
        <div class="mu-grid-tile-title-container">
          <div class="mu-grid-tile-title"><slot name="title">{{ title }}</slot></div>
          <div class="mu-grid-tile-subtitle"><slot name="subTitle">{{ subTitle }}</slot></div>
        </div>
        <div class="mu-grid-tile-action"><slot name="action" /></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject, defineOptions } from 'vue'

defineOptions({ name: 'mu-grid-tile' })
const props = defineProps({
  actionPosition: { type: String, default: 'right', validator: (v) => ['left', 'right'].indexOf(v) !== -1 },
  cols: { type: Number, default: 1 },
  rows: { type: Number, default: 1 },
  title: String, subTitle: String,
  titlePosition: { type: String, default: 'bottom', validator: (v) => ['top', 'bottom'].indexOf(v) !== -1 }
})
const getGridListCellHeight = inject('getGridListCellHeight')
const getGridListCols = inject('getGridListCols')
const getGridListPadding = inject('getGridListPadding')

const tileClass = computed(() => ({
  'is-top': props.titlePosition === 'top',
  'action-left': props.actionPosition === 'left'
}))
const tileStyle = computed(() => ({
  width: (props.cols / getGridListCols() * 100) + '%',
  padding: (getGridListPadding() / 2) + 'px',
  height: (getGridListCellHeight() * props.rows) + 'px'
}))
</script>
