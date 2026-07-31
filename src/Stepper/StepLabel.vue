<template>
  <span :class="['mu-step-label', { active: stepActive, completed: stepCompleted, disabled: stepDisabled }]">
    <span v-if="stepNum || hasIconSlot" class="mu-step-label-icon-container">
      <slot v-if="hasIconSlot" name="icon" />
      <svg v-else-if="stepCompleted" class="mu-step-label-icon" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
      <div v-else class="mu-step-label-circle">{{ stepNum }}</div>
    </span>
    <slot />
  </span>
</template>

<script setup>
import { inject, computed, useSlots, defineOptions } from 'vue'

defineOptions({ name: 'mu-step-label' })

const props = defineProps({
  active: Boolean, completed: Boolean, disabled: Boolean, num: [String, Number]
})

const slots = useSlots()
const stepContext = inject('stepContext', {})
const hasIconSlot = computed(() => slots.icon && slots.icon().length > 0)

const stepActive = computed(() => stepContext.active !== undefined ? stepContext.active : props.active)
const stepCompleted = computed(() => stepContext.completed !== undefined ? stepContext.completed : props.completed)
const stepDisabled = computed(() => stepContext.disabled !== undefined ? stepContext.disabled : props.disabled)
const stepNum = computed(() => stepContext.num !== undefined ? stepContext.num : props.num)
</script>
