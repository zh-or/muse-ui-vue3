<template>
  <div class="mu-datepicker-monthday-container">
    <Toolbar
      :slideType="slideType"
      :nextMonth="nextMonth"
      :prevMonth="prevMonth"
      :displayDates="displayDates"
      :dateTimeFormat="dateTimeFormat"
      @click="$emit('changeView', 'month')"
      @change="handleChange"
    />
    <div class="mu-datepicker-week">
      <span v-for="(weekText, index) in weekTexts" :key="index" class="mu-datepicker-week-day">{{ weekText }}</span>
    </div>
    <div class="mu-datepicker-monthday">
      <Transition
        v-for="(displayDate, index) in displayDates"
        :key="index"
        :name="'mu-datepicker-slide-' + slideType"
      >
        <div class="mu-datepicker-monthday-slide" :key="displayDate.getTime()">
          <div class="mu-datepicker-monthday-content">
            <div v-for="(week, i) in getWeekArray(displayDate)" :key="i" class="mu-datepicker-monthday-row">
              <DayButton
                v-for="(date, j) in week"
                :key="'dayButton' + i + j"
                :disabled="isDisableDate(date)"
                :selected="equalsDate(date)"
                :date="date"
                @click="handleClick(date)"
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, Transition } from 'vue'
import DayButton from './DayButton'
import Toolbar from './Toolbar'
import * as dateUtils from './dateUtils'

const props = defineProps({
  dateTimeFormat: Object,
  firstDayOfWeek: {
    type: Number,
    default: 1
  },
  maxDate: Date,
  minDate: Date,
  displayDate: Date,
  selectedDate: Date,
  shouldDisableDate: Function
})

const emit = defineEmits(['select', 'changeView'])

const initDate = dateUtils.cloneDate(props.displayDate)
initDate.setDate(1)
const weekTexts = ref(props.dateTimeFormat.getWeekDayArray(props.firstDayOfWeek))
const displayDates = ref([initDate])
const slideType = ref('next')

const prevMonth = computed(() => {
  return displayDates.value && dateUtils.monthDiff(displayDates.value[0], props.minDate) > 0
})

const nextMonth = computed(() => {
  return displayDates.value && dateUtils.monthDiff(displayDates.value[0], props.maxDate) < 0
})

function equalsDate(date) {
  return dateUtils.isEqualDate(date, props.selectedDate)
}

function isDisableDate(day) {
  if (day === null) return false
  let disabled = false
  if (props.maxDate && props.minDate) disabled = !dateUtils.isBetweenDates(day, props.minDate, props.maxDate)
  if (!disabled && props.shouldDisableDate) disabled = props.shouldDisableDate(day)
  return disabled
}

function handleClick(date) {
  if (date) emit('select', date)
}

function handleChange(val) {
  const displayDate = dateUtils.addMonths(displayDates.value[0], val)
  changeDisplayDate(displayDate)
}

function changeDisplayDate(date) {
  const oldDate = displayDates.value[0]
  if (date.getFullYear() === oldDate.getFullYear() && date.getMonth() === oldDate.getMonth()) return
  slideType.value = date.getTime() > oldDate.getTime() ? 'next' : 'prev'
  const displayDate = dateUtils.cloneDate(date)
  displayDate.setDate(1)
  displayDates.value.push(displayDate)
  displayDates.value.splice(0, 1)
}

function getWeekArray(displayDate) {
  return dateUtils.getWeekArray(displayDate || new Date(), props.firstDayOfWeek)
}

watch(() => props.displayDate, (val) => {
  changeDisplayDate(val)
})
</script>
