<template>
  <div :class="['mu-stepper', { 'mu-stepper-vertical': orientation === 'vertical' }]">
    <slot />
  </div>
</template>

<script setup>
import { provide, ref, onUpdated, defineOptions } from 'vue'

defineOptions({ name: 'mu-stepper' })

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  linear: { type: Boolean, default: true },
  orientation: { type: String, default: 'horizontal', validator: (val) => ['horizontal', 'vertical'].indexOf(val) !== -1 }
})

const stepIndex = ref(0)
provide('registerStep', () => stepIndex.value++)

provide('stepperState', {
  get activeStep() { return props.modelValue },
  get linear() { return props.linear },
  get orientation() { return props.orientation }
})

onUpdated(() => { stepIndex.value = 0 })
</script>
