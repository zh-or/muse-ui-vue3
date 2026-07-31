<template>
  <div class="mu-picker mu-datetime-picker" :class="colorClass" :style="{ color: resolvedColor }">
    <DateTimeDisplay
      v-if="!noDisplay"
      :affix="getAffix()"
      :dateTimeFormat="dateTimeFormat"
      :view="view"
      :format="format"
      :viewType="viewType"
      :color="displayColor"
      :displayDate="displayDate"
      @changeView="changeView"
      @selectAffix="handleSelectAffix"
    />
    <div class="mu-picker-container">
      <Tabs v-model="type" :color="displayColor || color" fullWidth @change="changeType">
        <Tab value="date">
          <svg class="mu-datetime-picker-svg" viewBox="0 0 24 24">
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </Tab>
        <Tab value="time">
          <svg class="mu-datetime-picker-svg" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
        </Tab>
      </Tabs>
      <FadeTransition>
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
          v-else-if="view === 'year'"
          :displayDate="displayDate"
          :maxDate="maxDate"
          :minDate="minDate"
          @change="handleYearChange"
        />
        <div v-else-if="viewType === 'clock'" class="mu-timepicker-clock">
          <div class="mu-timepicker-circle"></div>
          <ClockHours
            v-if="view === 'hour'"
            :format="format"
            :initialHours="modelValue.getHours()"
            @change="handleChangeHours"
          />
          <ClockMinutes
            v-if="view === 'minute'"
            :initialMinutes="modelValue.getMinutes()"
            @change="handleChangeMinutes"
          />
        </div>
        <ListView
          v-else
          :format="format"
          :time="modelValue"
          @changeHours="(val) => handleChangeHours(val, true)"
          @changeMinutes="(val) => handleChangeMinutes(val, true)"
        />
      </FadeTransition>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, provide, computed, useSlots, defineOptions } from 'vue'
import { useColor } from '../../composables/useColor'
import DateTimeDisplay from './DateTimeDisplay'
import MonthDayView from '../DatePicker/MonthDayView'
import YearView from '../DatePicker/YearView'
import MonthView from '../DatePicker/MonthView'
import ClockHours from '../TimePicker/Hours'
import ClockMinutes from '../TimePicker/Minutes'
import ListView from '../TimePicker/ListView'
import { Tabs, Tab } from '../../Tabs'
import { FadeTransition } from '../../internal/transitions'
import * as dateUtils from '../DatePicker/dateUtils'

defineOptions({ name: 'mu-date-time-picker' })

const props = defineProps({
  dateTimeFormat: {
    type: Object,
    default() { return dateUtils.dateTimeFormat }
  },
  firstDayOfWeek: {
    type: Number,
    default: 0
  },
  modelValue: {
    type: Date,
    default() { return new Date() }
  },
  maxDate: {
    type: Date,
    default() { return dateUtils.addYears(new Date(), 100) }
  },
  minDate: {
    type: Date,
    default() { return dateUtils.addYears(new Date(), -100) }
  },
  shouldDisableDate: Function,
  viewType: {
    type: String,
    default: 'clock',
    validator(val) { return ['clock', 'list'].indexOf(val) !== -1 }
  },
  format: {
    type: String,
    default: 'ampm',
    validator(val) { return ['ampm', '24hr'].indexOf(val) !== -1 }
  },
  landscape: Boolean,
  noDisplay: Boolean,
  displayColor: String,
  color: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change', 'update:modelValue'])

const { getNormalColorClass, getColor } = useColor(props)

const resolvedColor = computed(() => getColor(props.color))
const colorClass = computed(() => getNormalColorClass(props.color, true))

const displayDate = ref(props.modelValue)
const view = ref('monthDay')
const type = ref('date')

provide('getColorObject', () => ({
  color: getColor(props.color),
  colorClass: getNormalColorClass(props.color, true),
  bgColorClass: getNormalColorClass(props.color)
}))

const slots = useSlots()

provide('getDayButtonSlots', () => slots.day)
provide('getMonthButtonSlots', () => slots.month)
provide('getYearButtonSlots', () => slots.year)

watch(() => props.modelValue, (val) => {
  displayDate.value = val
})

function getAffix() {
  if (props.format !== 'ampm') return ''
  const hours = props.modelValue.getHours()
  return hours < 12 ? 'am' : 'pm'
}

function handleYearChange(year) {
  const date = dateUtils.cloneAsDate(displayDate.value)
  date.setDate(1)
  date.setFullYear(year)
  changeDisplayDate(date)
  changeView('monthDay')
}

function handleMonthChange(date) {
  changeDisplayDate(date)
  changeView('monthDay')
}

function handleSelect(date) {
  if (date.getTime() > props.maxDate.getTime()) date = new Date(props.maxDate.getTime())
  if (date.getTime() < props.minDate.getTime()) date = new Date(props.minDate.getTime())
  changeDisplayDate(date)
  changeTime(date, 'monthDay', false)
  changeType('time')
}function changeDisplayDate(date) {
  displayDate.value = date
}

function changeType(val) {
  type.value = val
  if (val === 'date' && ['hour', 'minute'].indexOf(view.value) !== -1) {
    changeView('monthDay')
  } else if (val === 'time' && ['monthDay', 'month', 'year'].indexOf(view.value) !== -1) {
    changeView('hour')
  }
}

function changeView(val) {
  view.value = val
  if (['hour', 'minute'].indexOf(val) !== -1 && type.value === 'date') {
    changeType('time')
  } else if (['monthDay', 'month', 'year'].indexOf(val) !== -1 && type.value === 'time') {
    changeType('date')
  }
}

function handleSelectAffix(affix) {
  if (affix === getAffix()) return
  const hours = props.modelValue.getHours()
  if (affix === 'am') {
    handleChangeHours(hours - 12, affix)
    return
  }
  handleChangeHours(hours + 12, affix)
}

function handleChangeHours(hours, finished) {
  const time = new Date(props.modelValue)
  let affix
  if (typeof finished === 'string') {
    affix = finished
    finished = undefined
  }
  if (!affix) affix = getAffix()
  if (affix === 'pm' && hours < 12) hours += 12
  time.setHours(hours)
  changeTime(time, 'hour', finished)
  if (finished) view.value = 'minute'
}

function handleChangeMinutes(minutes, finished) {
  const time = new Date(props.modelValue)
  time.setMinutes(minutes)
  changeTime(time, 'minute', finished)
}

function changeTime(time, mode, finished) {
  emit('change', time, mode, finished)
  emit('update:modelValue', time)
}
</script>
