<template>
  <div :class="['mu-stepper', { 'mu-stepper-vertical': orientation === 'vertical' }]">
    <slot />
  </div>
</template>

<script setup>
import { provide, ref, defineOptions } from 'vue'

defineOptions({ name: 'mu-stepper' })

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  linear: { type: Boolean, default: true },
  orientation: { type: String, default: 'horizontal', validator: (val) => ['horizontal', 'vertical'].indexOf(val) !== -1 }
})

const steps = ref([])
provide('registerStep', (step) => {
  steps.value.push(step)
  return () => {
    const index = steps.value.indexOf(step)
    if (index !== -1) steps.value.splice(index, 1)
  }
})

provide('stepperState', {
  get activeStep() { return props.modelValue },
  get linear() { return props.linear },
  get orientation() { return props.orientation },
  get steps() { return steps.value }
})
</script>