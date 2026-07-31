<template>
  <Paper :class="['mu-expansion-panel', { 'mu-expansion-panel__expand': modelValue }]" :z-depth="zDepth" :rounded="false">
    <div class="mu-expansion-panel-header" @click="toggle">
      <slot name="header" />
      <Button class="mu-expansion-toggle-btn" icon :tabindex="-1">
        <svg viewBox="0 0 24 24">
          <g>
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
          </g>
        </svg>
      </Button>
    </div>
    <ExpandTransition>
      <div v-show="modelValue" class="mu-expansion-panel-container">
        <div class="mu-expansion-panel-content">
          <slot />
        </div>
        <div v-if="hasActionSlot" class="mu-expansion-panel-actions">
          <slot name="action" />
        </div>
      </div>
    </ExpandTransition>
  </Paper>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import Paper from '../Paper'
import Button from '../Button'
import { ExpandTransition } from '../internal/transitions'

defineOptions({ name: 'mu-expansion-panel' })

const props = defineProps({ modelValue: Boolean, zDepth: { type: Number, default: 2 } })
const emit = defineEmits(['update:modelValue', 'change'])
const slots = useSlots()
const hasActionSlot = computed(() => slots.action && slots.action().length > 0)

function toggle() {
  const val = !props.modelValue
  emit('update:modelValue', val)
  emit('change', val)
}
</script>
