<template>
  <div
    class="mu-picker-display mu-time-display"
    :class="getColorClass(false)"
    :style="{ 'background-color': getColor(color) }"
  >
    <div class="mu-time-display-text">
      <div v-if="format === 'ampm'" class="mu-time-display-affix"></div>
      <div class="mu-time-display-time">
        <span
          :class="['mu-time-display-clickable', { inactive: viewType === 'clock' && mode === 'minute' }]"
          @click="viewType === 'list' ? () => {} : $emit('changeView', 'hour')"
        >{{ sanitizeTime[0] }}</span>
        <span>:</span>
        <span
          :class="['mu-time-display-clickable', { inactive: viewType === 'clock' && mode === 'hour' }]"
          @click="viewType === 'list' ? () => {} : $emit('changeView', 'minute')"
        >{{ sanitizeTime[1] }}</span>
      </div>
      <div v-if="format === 'ampm'" class="mu-time-display-affix">
        <div
          :class="['mu-time-display-clickable', { inactive: affix === 'am' }]"
          @click="handleSelectAffix('pm')"
        >PM</div>
        <div
          :class="['mu-time-display-clickable', { inactive: affix === 'pm' }]"
          @click="handleSelectAffix('am')"
        >AM</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useColor } from '../../composables/useColor'

const props = defineProps({
  affix: {
    type: String,
    default: '',
    validator(val) {
      return ['', 'pm', 'am'].indexOf(val) !== -1
    }
  },
  format: {
    type: String,
    validator(val) {
      return val && ['ampm', '24hr'].indexOf(val) !== -1
    }
  },
  mode: {
    type: String,
    default: 'hour',
    validator(val) {
      return ['hour', 'minute'].indexOf(val) !== -1
    }
  },
  selectedTime: {
    type: Date,
    default() { return new Date() },
    required: true
  },
  viewType: String,
  color: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['changeView', 'selectAffix'])

const { getColorClass, getColor } = useColor(props)

const sanitizeTime = computed(() => {
  let hour = props.selectedTime.getHours()
  let min = props.selectedTime.getMinutes().toString()
  if (props.format === 'ampm') {
    hour %= 12
    hour = hour || 12
  }
  hour = hour.toString()
  if (hour.length < 2) hour = `0${hour}`
  if (min.length < 2) min = `0${min}`
  return [hour, min]
})

function handleSelectAffix(affix) {
  emit('selectAffix', affix)
}
</script>
