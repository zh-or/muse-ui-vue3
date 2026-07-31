<template>
  <div
    :class="['mu-picker mu-timepicker ' + colorClass, { 'mu-picker-landspace': landscape }]"
    :style="{ color: colorValue }"
  >
    <TimeDisplay
      v-if="!noDisplay"
      :selectedTime="modelValue"
      :format="format"
      :mode="view"
      :color="displayColor"
      :viewType="viewType"
      :affix="getAffix()"
      @changeView="(v) => view = v"
      @selectAffix="handleSelectAffix"
    />
    <div class="mu-picker-container">
      <ListView
        v-if="viewType === 'list'"
        :format="format"
        :time="modelValue"
        @changeHours="(val) => handleChangeHours(val, true)"
        @changeMinutes="(val) => handleChangeMinutes(val, true)"
      />
      <div v-else class="mu-timepicker-clock">
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
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, provide, computed, defineOptions } from 'vue'
import TimeDisplay from './TimeDisplay'
import ClockHours from './Hours'
import ClockMinutes from './Minutes'
import ListView from './ListView'
import { useColor } from '../../composables/useColor'
import pickerProps from '../mixins/props'

defineOptions({ name: 'mu-time-picker' })

const props = defineProps({
  ...pickerProps.props,
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
  modelValue: {
    type: Date,
    default() { return new Date() }
  },
  color: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change', 'update:modelValue'])

const { getNormalColorClass, getColor } = useColor(props)

const colorClass = computed(() => getNormalColorClass(props.color, true))
const colorValue = computed(() => getColor(props.color))
const view = ref('hour')

provide('getColorObject', () => ({
  color: getColor(props.color),
  colorClass: getNormalColorClass(props.color, true),
  bgColorClass: getNormalColorClass(props.color)
}))

function getAffix() {
  if (props.format !== 'ampm') return ''
  const hours = props.modelValue.getHours()
  return hours < 12 ? 'am' : 'pm'
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
  if (finished) view.value = 'hour'
}

function changeTime(time, mode, finished) {
  emit('change', time, mode, finished)
  emit('update:modelValue', time)
}
</script>
