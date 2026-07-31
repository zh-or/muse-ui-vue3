<template>
  <div class="mu-picker-display mu-date-time-display" :class="getColorClass(false)" :style="{ 'background-color': getColor(color) }">
    <div class="mu-date-display">
      <div :class="['mu-date-display-year', { active: view === 'year' }]" @click="$emit('changeView', 'year')">
        <div class="mu-date-display-year-title">{{ displayDate.getFullYear() }}</div>
      </div>
      <div :class="['mu-date-display-monthday', { active: view === 'monthDay' || view === 'month' }]" @click="$emit('changeView', 'monthDay')">
        <div class="mu-date-display-monthday-title">{{ dateTimeFormat.formatDateDisplay(displayDate) }}</div>
      </div>
    </div>
    <div class="mu-time-display">
      <div class="mu-time-display-text">
        <div v-if="format === 'ampm'" class="mu-time-display-affix"></div>
        <div class="mu-time-display-time">
          <span
            :class="['mu-time-display-clickable', { active: view === 'hour' || (view === 'minute' && viewType === 'list') }]"
            @click="viewType === 'list' ? () => {} : $emit('changeView', 'hour')"
          >{{ sanitizeTime[0] }}</span>
          <span>:</span>
          <span
            :class="['mu-time-display-clickable', { active: view === 'minute' || (view === 'hour' && viewType === 'list') }]"
            @click="viewType === 'list' ? () => {} : $emit('changeView', 'minute')"
          >{{ sanitizeTime[1] }}</span>
        </div>
        <div v-if="format === 'ampm'" class="mu-time-display-affix">
          <div :class="['mu-time-display-clickable', { active: affix === 'pm' }]" @click="$emit('selectAffix', 'pm')">PM</div>
          <div :class="['mu-time-display-clickable', { active: affix === 'am' }]" @click="$emit('selectAffix', 'am')">AM</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useColor } from '../../composables/useColor'

const props = defineProps({
  affix: String,
  dateTimeFormat: Object,
  view: String,
  format: String,
  viewType: String,
  displayDate: Date,
  color: {
    type: String,
    default: ''
  }
})

defineEmits(['changeView', 'selectAffix'])

const { getColorClass, getColor } = useColor(props)

const sanitizeTime = computed(() => {
  let hour = props.displayDate.getHours()
  let min = props.displayDate.getMinutes().toString()
  if (props.format === 'ampm') {
    hour %= 12
    hour = hour || 12
  }
  hour = hour.toString()
  if (hour.length < 2) hour = `0${hour}`
  if (min.length < 2) min = `0${min}`
  return [hour, min]
})
</script>
