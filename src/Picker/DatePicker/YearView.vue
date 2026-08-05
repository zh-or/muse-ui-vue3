<template>
  <div class="mu-datepicker-year-container">
    <div ref="container" class="mu-datepicker-year">
      <div class="mu-datepicker-year-list">
        <YearButton
          v-for="year in years"
          :key="year"
          :year="year"
          :selected="year === displayDate.getFullYear()"
          @click="$emit('change', year)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, provide } from 'vue'
import YearButton from './YearButton'

const props = defineProps({
  maxDate: Date,
  minDate: Date,
  displayDate: Date
})

defineEmits(['change'])

const container = ref(null)

const years = computed(() => {
  const minYear = props.minDate.getFullYear()
  const maxYear = props.maxDate.getFullYear()
  const years = []
  for (let year = minYear; year <= maxYear; year++) {
    years.push(year)
  }
  return years
})

function scrollToSelectedYear(yearButtonNode) {
  const containerEl = container.value
  const containerHeight = containerEl.clientHeight
  const yearButtonNodeHeight = yearButtonNode.clientHeight || 32
  const scrollYOffset = (yearButtonNode.offsetTop + yearButtonNodeHeight / 2) - containerHeight / 2
  setTimeout(() => (containerEl.scrollTop = scrollYOffset), 0)
}

provide('scrollToSelectedYear', scrollToSelectedYear)

defineExpose({ scrollToSelectedYear })
</script>
