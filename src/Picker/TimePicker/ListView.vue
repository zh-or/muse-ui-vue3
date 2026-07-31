<template>
  <div class="mu-timepicker-list">
    <div ref="hoursEl" class="mu-timepicker-list-hours">
      <button
        v-for="hour in hours"
        :key="hour"
        class="mu-timepicker-hour-button"
        :class="{ 'is-active': isHourActive(Number(hour)) }"
        @click="$emit('changeHours', Number(hour))"
      >{{ hour }}</button>
    </div>
    <div ref="minutesEl" class="mu-timepicker-list-minutes">
      <button
        v-for="minute in minutes"
        :key="minute"
        class="mu-timepicker-minute-button"
        :class="{ 'is-active': isMinuteActive(Number(minute)) }"
        @click="$emit('changeMinutes', Number(minute))"
      >{{ minute }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  format: { type: String, default: 'ampm', validator: (val) => ['ampm', '24hr'].includes(val) },
  time: { type: Date, default: () => new Date() }
})

defineEmits(['changeHours', 'changeMinutes'])

const hoursEl = ref(null)
const minutesEl = ref(null)

const hours = computed(() => {
  const hourSize = props.format === 'ampm' ? 12 : 24
  const result = []
  for (let i = 1; i <= hourSize; i++) {
    const num = i % 24
    num === 0 ? result.unshift('00') : result.push(num > 9 ? num : '0' + num)
  }
  return result
})

const minutes = computed(() => {
  const result = []
  for (let i = 1; i <= 60; i++) {
    const num = i % 60
    num === 0 ? result.unshift('00') : result.push(num > 9 ? num : '0' + num)
  }
  return result
})

function isHourActive(val) {
  let curHour = props.time.getHours()
  if (props.format === 'ampm') {
    curHour %= 12
    curHour = curHour || 12
  }
  return curHour === val
}

function isMinuteActive(val) {
  return props.time.getMinutes() === val
}

function scrollToSelected(container) {
  const buttonNode = container.querySelector('.is-active')
  const btnTop = buttonNode.offsetTop
  const btnHeight = buttonNode.offsetHeight
  const containerTop = container.offsetTop
  const containerHeight = container.offsetHeight
  const top = containerTop + containerHeight / 2
  const maxScrollTop = container.scrollHeight - containerHeight
  let scrollTop = btnTop + btnHeight / 2 - top
  scrollTop = Math.min(maxScrollTop, scrollTop)
  scrollTop = Math.max(0, scrollTop)
  setTimeout(() => (container.scrollTop = scrollTop), 0)
}

onMounted(() => {
  scrollToSelected(hoursEl.value)
  scrollToSelected(minutesEl.value)
})

watch(() => props.time, () => {
  if (typeof window === 'undefined') return
  nextTick(() => {
    scrollToSelected(hoursEl.value)
    scrollToSelected(minutesEl.value)
  })
})
</script>
