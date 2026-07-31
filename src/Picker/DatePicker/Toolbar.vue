<template>
  <div class="mu-datepicker-toolbar">
    <Button icon class="mu-datepicker-tool-btn" :disabled="!prevMonth" @click="$emit('change', -1)">
      <svg class="mu-datepicker-svg-icon" viewBox="0 0 24 24">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </Button>
    <div class="mu-datepicker-toolbar-title-wrapper" @click="$emit('changeView', 'month')">
      <Transition
        v-for="(displayDate, index) in displayDates"
        :key="index"
        :name="'mu-datepicker-slide-' + slideType"
      >
        <div
          :class="['mu-datepicker-toolbar-title', { clickable: true }]"
          :key="type === 'month' ? dateTimeFormat.formatMonth(displayDate) : displayDate.getFullYear()"
          @click="$emit('click', $event)"
        >{{ type === 'month' ? dateTimeFormat.formatMonth(displayDate) : displayDate.getFullYear() }}</div>
      </Transition>
    </div>
    <Button icon class="mu-datepicker-tool-btn" :disabled="!nextMonth" @click="$emit('change', 1)">
      <svg class="mu-datepicker-svg-icon" viewBox="0 0 24 24">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
    </Button>
  </div>
</template>

<script setup>
import Button from '../../Button'

defineProps({
  dateTimeFormat: Object,
  displayDates: Array,
  type: { type: String, default: 'month' },
  nextMonth: { type: Boolean, default: true },
  prevMonth: { type: Boolean, default: true },
  slideType: String
})

defineEmits(['change', 'changeView', 'click'])
</script>
