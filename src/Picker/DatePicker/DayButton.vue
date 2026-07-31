<template>
  <button
    v-if="date"
    :class="['mu-day-button', dayButtonClass]"
    :disabled="disabled"
  >
    <div class="mu-day-button-bg"></div>
    <span class="mu-day-button-text" v-html="date.getDate()"></span>
  </button>
  <span v-else class="mu-day-empty"></span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selected: Boolean,
  date: Date,
  disabled: Boolean
})

const isNow = computed(() => {
  if (!props.date) return false
  const now = new Date()
  return props.date.getYear() === now.getYear() && props.date.getMonth() === now.getMonth() && props.date.getDate() === now.getDate()
})

const dayButtonClass = computed(() => ({
  selected: props.selected,
  disabled: props.disabled,
  now: isNow.value
}))
</script>
