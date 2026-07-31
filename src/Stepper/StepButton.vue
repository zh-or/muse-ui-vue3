<template>
  <AbstractButton class="mu-step-button" :disabled="stepDisabled" :ripple="ripple">
    <StepLabel v-if="childrenInLabel" :active="stepActive" :completed="stepCompleted" :num="stepNum" :disabled="stepDisabled">
      <slot />
      <template #icon><slot name="icon" /></template>
    </StepLabel>
    <slot v-else />
  </AbstractButton>
</template>

<script setup>
import { inject, computed, defineOptions } from 'vue'

defineOptions({ name: 'mu-step-button' })
import AbstractButton from '../internal/AbstractButton.vue'
import StepLabel from './StepLabel.vue'

const props = defineProps({
  active: Boolean, completed: Boolean, disabled: Boolean,
  ripple: { type: Boolean, default: true },
  num: [String, Number], last: Boolean,
  childrenInLabel: { type: Boolean, default: true }
})

const stepContext = inject('stepContext', {})

const stepActive = computed(() => stepContext.active !== undefined ? stepContext.active : props.active)
const stepCompleted = computed(() => stepContext.completed !== undefined ? stepContext.completed : props.completed)
const stepDisabled = computed(() => stepContext.disabled !== undefined ? stepContext.disabled : props.disabled)
const stepNum = computed(() => stepContext.num !== undefined ? stepContext.num : props.num)
</script>
