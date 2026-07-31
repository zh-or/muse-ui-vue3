<template>
  <div
    :class="['mu-picker-display mu-date-display ' + getColorClass(false), { 'selected-year': !monthDaySelected }]"
    :style="{ 'background-color': getColor(color) }"
  >
    <div class="mu-date-display-year" @click="$emit('changeView', 'year')">
      <Transition
        v-for="(displayDate, index) in displayDates"
        :key="index"
        :name="'mu-date-display-' + slideType"
      >
        <div class="mu-date-display-slideIn-wrapper" :key="displayDate.getFullYear()">
          <div class="mu-date-display-year-title">{{ displayDate.getFullYear() }}</div>
        </div>
      </Transition>
    </div>
    <div
      v-if="type !== 'year'"
      class="mu-date-display-monthday"
      @click="$emit('changeView', type === 'date' ? 'monthDay' : 'month')"
    >
      <Transition
        v-for="(displayDate, index) in displayDates"
        :key="index"
        :name="'mu-date-display-' + slideType"
      >
        <div
          class="mu-date-display-slideIn-wrapper"
          :key="type === 'date' ? dateTimeFormat.formatDisplay(displayDate) : dateTimeFormat.getMonthList()[displayDate.getMonth()]"
        >
          <div class="mu-date-display-monthday-title">{{ type === 'date' ? dateTimeFormat.formatDisplay(displayDate) : dateTimeFormat.getMonthList()[displayDate.getMonth()] }}</div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, Transition } from 'vue'
import { useColor } from '../../composables/useColor'

const props = defineProps({
  type: String,
  dateTimeFormat: Object,
  monthDaySelected: {
    type: Boolean,
    default: true
  },
  displayDate: Date,
  color: {
    type: String,
    default: ''
  }
})

defineEmits(['changeView'])

const { getColorClass, getColor } = useColor(props)

const displayDates = ref([props.displayDate])
const slideType = ref('next')

watch(() => props.displayDate, (val) => {
  const oldDate = displayDates.value[0]
  slideType.value = val.getTime() > oldDate.getTime() ? 'next' : 'prev'
  displayDates.value.push(val)
  displayDates.value.splice(0, 1)
})
</script>
