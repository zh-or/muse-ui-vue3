<template>
  <button ref="el" :class="['mu-year-button', { selected }]">
    <span class="mu-year-button-text">{{ year }}</span>
  </button>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, watch } from 'vue'

const props = defineProps({
  year: [String, Number],
  selected: Boolean
})

const el = ref(null)
const instance = getCurrentInstance()

function scrollParent() {
  instance.proxy.$parent.scrollToSelectedYear(el.value)
}

onMounted(() => {
  if (props.selected) scrollParent()
})

watch(() => props.selected, (val) => {
  if (val) scrollParent()
})
</script>
