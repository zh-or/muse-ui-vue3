<template>
  <div
    :class="['mu-picker mu-datepicker ' + colorClass, { 'mu-picker-landspace': landscape }]"
    :style="{ color }"
  >
    <DateDisplay
      v-if="!noDisplay"
      :type="type"
      :monthDaySelected="view !== 'year'"
      :color="displayColor"
      :displayDate="displayDate"
      :dateTimeFormat="dateTimeFormat"
      @changeView="changeView"
    />
    <div class="mu-picker-container">
      <MonthDayView
        v-if="view === 'monthDay'"
        :dateTimeFormat="dateTimeFormat"
        :firstDayOfWeek="firstDayOfWeek"
        :maxDate="maxDate"
        :minDate="minDate"
        :displayDate="displayDate"
        :selectedDate="modelValue"
        :shouldDisableDate="shouldDisableDate"
        @changeView="changeView"
        @select="handleSelect"
      />
      <MonthView
        v-else-if="view === 'month'"
        :dateTimeFormat="dateTimeFormat"
        :maxDate="maxDate"
        :minDate="minDate"
        :displayDate="displayDate"
        @changeView="changeView"
        @change="handleMonthChange"
      />
      <YearView
        v-else
        :displayDate="displayDate"
        :maxDate="maxDate"
        :minDate="minDate"
        @change="handleYearChange"
      />
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, provide, useSlots, computed, defineOptions } from 'vue'
import { useColor } from '../../composables/useColor'
import pickerProps from '../mixins/props'
import DateDisplay from './DateDisplay'
import MonthDayView from './MonthDayView'
import YearView from './YearView'
import MonthView from './MonthView'
import * as dateUtils from './dateUtils'

defineOptions({ name: 'mu-date-picker' })

const props = defineProps({
  ...pickerProps.props,
  dateTimeFormat: {
    type: Object,
    default() { return dateUtils.dateTimeFormat; }
  },
  firstDayOfWeek: {
    type: Number,
    default: 0
  },
  modelValue: {
    type: Date,
    default() { return new Date(); }
  },
  type: {
    type: String,
    default: 'date'
  },
  maxDate: {
    type: Date,
    default() { return dateUtils.addYears(new Date(), 100); }
  },
  minDate: {
    type: Date,
    default() { return dateUtils.addYears(new Date(), -100); }
  },
  shouldDisableDate: Function,
  color: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change', 'update:modelValue'])
const slots = useSlots()

const { getNormalColorClass, getColor } = useColor(props)

const colorClass = computed(() => getNormalColorClass(props.color, true))
const color = computed(() => getColor(props.color))

const displayDate = ref(props.modelValue)
const view = ref(props.type === 'date' ? 'monthDay' : props.type === 'year' ? 'year' : 'month')

provide('getDayButtonSlots', () => slots.day)
provide('getMonthButtonSlots', () => slots.month)
provide('getYearButtonSlots', () => slots.year)

watch(() => props.modelValue, (val) => {
  displayDate.value = val
})

function handleYearChange(year) {
  const date = dateUtils.cloneAsDate(displayDate.value)
  date.setDate(1)
  date.setFullYear(year)
  changeDisplayDate(date)
  if (props.type === 'year') return changeDate(date)
  changeView(props.type === 'month' ? 'month' : 'monthDay')
}

function handleMonthChange(date) {
  changeDisplayDate(date)
  if (props.type === 'month') return changeDate(date)
  changeView('monthDay')
}

function handleSelect(date) {
  if (date.getTime() > props.maxDate.getTime()) date = new Date(props.maxDate.getTime())
  if (date.getTime() < props.minDate.getTime()) date = new Date(props.minDate.getTime())
  changeDisplayDate(date)
  changeDate(date)
}

function changeDate(date) {
  emit('change', date)
  emit('update:modelValue', date)
}

function changeDisplayDate(date) {
  displayDate.value = date
}

function changeView(newView) {
  view.value = newView
}
</script>
