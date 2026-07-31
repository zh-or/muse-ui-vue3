<template>
  <div class="mu-datepicker-month-container">
    <Toolbar
      :slideType="slideType"
      type="year"
      :displayDates="displayDates"
      :dateTimeFormat="dateTimeFormat"
      @click="$emit('changeView', 'year')"
      @change="handleChange"
    />
    <div class="mu-datepicker-month">
      <Transition
        v-for="(displayDate, index) in displayDates"
        :key="index"
        :name="'mu-datepicker-slide-' + slideType"
      >
        <div class="mu-datepicker-month-slide" :key="displayDate.getTime()">
          <div class="mu-datepicker-month-content">
            <div v-for="(month, i) in getMonthArray(displayDate)" :key="i" class="mu-datepicker-month-row">
              <button
                v-for="date in month"
                :key="date.getTime()"
                :class="['mu-month-button', { selected: date.getFullYear() === displayDate.getFullYear() && date.getMonth() === displayDate.getMonth() }]"
                :disabled="isMonthButtonDisabled(date)"
                @click="handleMonthClick(date)"
              >
                <div class="mu-month-button-bg"></div>
                <span class="mu-month-button-text">{{ dateTimeFormat.getMonthList()[date.getMonth()] }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, Transition } from 'vue'
import Toolbar from './Toolbar'
import * as dateUtils from './dateUtils'

const props = defineProps({
  dateTimeFormat: Object,
  maxDate: Date,
  minDate: Date,
  displayDate: Date
})

const emit = defineEmits(['changeView', 'change'])

const initDate = dateUtils.cloneDate(props.displayDate)
initDate.setDate(1)
const displayDates = ref([initDate])
const slideType = ref('next')

function changeDisplayDate(date) {
  const oldDate = displayDates.value[0]
  if (date.getFullYear() === oldDate.getFullYear() && date.getMonth() === oldDate.getMonth()) return
  slideType.value = date.getTime() > oldDate.getTime() ? 'next' : 'prev'
  const displayDate = dateUtils.cloneDate(date)
  displayDate.setDate(1)
  displayDates.value.push(displayDate)
  displayDates.value.splice(0, 1)
}

function handleChange(val) {
  const displayDate = dateUtils.cloneDate(displayDates.value[0])
  displayDate.setFullYear(displayDate.getFullYear() + val)
  changeDisplayDate(displayDate)
}

function getMonthArray(displayDate) {
  return dateUtils.getMonthArray(displayDate)
}

function isMonthButtonDisabled(date) {
  const maxDate = new Date(props.maxDate.getFullYear(), props.maxDate.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
  const minDate = new Date(props.minDate.getFullYear(), props.minDate.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
  return date.getTime() > maxDate.getTime() || date.getTime() < minDate.getTime()
}

function handleMonthClick(date) {
  if (!isMonthButtonDisabled(date)) emit('change', date)
}

watch(() => props.displayDate, (val) => {
  changeDisplayDate(val)
})
</script>
