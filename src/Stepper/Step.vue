<template>
  <div class="mu-step">
    <slot />
  </div>
</template>

<script setup>
import { inject, computed, provide, defineOptions } from 'vue'

defineOptions({ name: 'mu-step' })

const props = defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  index: { type: Number },
  last: { type: Boolean, default: false }
})

const stepperState = inject('stepperState', {})
const registerStep = inject('registerStep', () => 0)

const hasStepper = !!inject('stepperState', null)
const stepIndex = hasStepper ? registerStep() : (props.index || 0)

const isActive = computed(() => hasStepper ? stepperState.activeStep === stepIndex : props.active)
const isCompleted = computed(() => hasStepper ? (stepperState.linear && stepperState.activeStep > stepIndex) : props.completed)
const isDisabled = computed(() => hasStepper ? (stepperState.linear && stepperState.activeStep < stepIndex) : props.disabled)
const isLast = computed(() => hasStepper ? false : props.last)

provide('stepContext', {
  get active() { return isActive.value },
  get completed() { return isCompleted.value },
  get disabled() { return isDisabled.value },
  get last() { return isLast.value },
  get num() { return stepIndex + 1 }
})
</script>
