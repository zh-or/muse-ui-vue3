<template>
  <div class="mu-step">
    <slot />
  </div>
</template>

<script setup>
import { inject, computed, provide, onMounted, onBeforeUnmount, defineOptions } from 'vue'

defineOptions({ name: 'mu-step' })

const props = defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  index: { type: Number },
  last: { type: Boolean, default: false }
})

const stepperState = inject('stepperState', null)
const registerStep = inject('registerStep', null)
const hasStepper = !!stepperState

const stepInstance = {}
let unregisterStep = null

const stepIndex = computed(() => {
  if (!hasStepper) return props.index || 0
  return Math.max(stepperState.steps.indexOf(stepInstance), 0)
})

const isActive = computed(() => hasStepper ? stepperState.activeStep === stepIndex.value : props.active)
const isCompleted = computed(() => hasStepper ? (stepperState.linear && stepperState.activeStep > stepIndex.value) : props.completed)
const isDisabled = computed(() => hasStepper ? (stepperState.linear && stepperState.activeStep < stepIndex.value) : props.disabled)
const isLast = computed(() => hasStepper ? false : props.last)

provide('stepContext', {
  get active() { return isActive.value },
  get completed() { return isCompleted.value },
  get disabled() { return isDisabled.value },
  get last() { return isLast.value },
  get num() { return stepIndex.value + 1 }
})

onMounted(() => {
  if (registerStep) unregisterStep = registerStep(stepInstance)
})

onBeforeUnmount(() => {
  if (unregisterStep) unregisterStep()
})
</script>