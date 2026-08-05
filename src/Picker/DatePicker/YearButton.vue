<template>
  <button ref="el" :class="['mu-year-button', { selected }]">
    <span class="mu-year-button-text">{{ year }}</span>
  </button>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue'

const props = defineProps({
  year: [String, Number],
  selected: Boolean
})

const el = ref(null)
const scrollToSelectedYear = inject('scrollToSelectedYear')

function scrollParent() {
  scrollToSelectedYear(el.value)
}

onMounted(() => {
  if (props.selected) scrollParent()
})

watch(() => props.selected, (val) => {
  if (val) scrollParent()
})
</script>
