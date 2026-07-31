<template>
  <div ref="rootEl" :class="['mu-input', colorClass, inputClass]" :style="{ color: computedColor }">
    <Icon v-if="icon" class="mu-input-icon" :value="icon" />
    <div v-if="!solo && label" :class="['mu-input-label', { float }]">{{ label }}</div>
    <div class="mu-input-content mu-text-field" ref="contentRef">
      <slot name="prepend" />
      <span v-if="prefix && !float" class="mu-input-prefix-text">{{ prefix }}</span>

      <input
        ref="inputRef"
        class="mu-text-field-input"
        tabindex="0"
        v-bind="attrs"
        :disabled="disabled"
        :placeholder="!labelFloat ? attrs.placeholder : ''"
        :value="dateStr"
        readonly
        @click="open = true"
        @focus="focus"
        @blur="blur"
        @keydown="handleInputKeydown"
      />

      <slot />

      <Container
        ref="popoverRef"
        :container="container"
        :open="open"
        :trigger="triggerEl"
        @close="closePicker"
      >
        <DatePicker
          v-if="type === 'date' || type === 'year' || type === 'month'"
          v-bind="datePickerProps"
          :type="type === 'month' ? 'month' : type === 'year' ? 'year' : 'date'"
          :modelValue="date"
          :style="{ width: container === 'bottomSheet' ? 'auto' : '' }"
          @change="handleDateChange"
        >
          <template #default>
            <div v-if="actions" class="mu-picker-actions">
              <Button flat color="primary" @click="closePicker">{{ cancelLabel }}</Button>
              <Button flat color="primary" @click="changeValue">{{ okLabel }}</Button>
            </div>
          </template>
          <template v-if="$slots.day" #day>
            <slot name="day" />
          </template>
        </DatePicker>
        <DateTimePicker
          v-else-if="type === 'dateTime'"
          v-bind="dateTimePickerProps"
          :format="clockType"
          :modelValue="date"
          :style="{ width: container === 'bottomSheet' ? 'auto' : '' }"
          @change="handleTimeChange"
        >
          <template #default>
            <div v-if="actions" class="mu-picker-actions">
              <Button flat color="primary" @click="closePicker">{{ cancelLabel }}</Button>
              <Button flat color="primary" @click="changeValue">{{ okLabel }}</Button>
            </div>
          </template>
          <template v-if="$slots.day" #day>
            <slot name="day" />
          </template>
        </DateTimePicker>
        <TimePicker
          v-else-if="type === 'time'"
          v-bind="timePickerProps"
          :modelValue="date"
          :format="clockType"
          :style="{ width: container === 'bottomSheet' ? 'auto' : '' }"
          @change="handleTimeChange"
        >
          <template #default>
            <div v-if="actions" class="mu-picker-actions">
              <Button flat color="primary" @click="closePicker">{{ cancelLabel }}</Button>
              <Button flat color="primary" @click="changeValue">{{ okLabel }}</Button>
            </div>
          </template>
        </TimePicker>
      </Container>

      <span v-if="suffix && !float" class="mu-input-suffix-text">{{ suffix }}</span>
      <Icon v-if="actionIcon" class="mu-input-action-icon" :value="actionIcon" @click="!disabled && actionClick && actionClick()" />
      <slot name="append" />

      <div v-if="!solo">
        <div :class="['mu-input-line', { disabled }]"></div>
        <div v-if="!disabled" :class="['mu-input-focus-line', underlineColorClass, { focus: isFocused }]" :style="{ 'background-color': underlineColorStyle }"></div>
      </div>

      <div v-if="errorText || helpText || maxLength" class="mu-input-help">
        <div>{{ errorText || helpText || '' }}</div>
        <div v-if="maxLength">{{ inputLength }} / {{ maxLength }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, useAttrs } from 'vue'
import { useColor } from '../composables/useColor'
import keycode from 'keycode'
import { DatePicker, TimePicker, DateTimePicker } from '../Picker'
import PickerMixin from '../Picker/mixins/props'
import Container from './Container'
import dayjs from 'dayjs'
import Button from '../Button/Button'
import Icon from '../Icon'

const DEFAULT_FORMAT = {
  date: 'YYYY-MM-DD',
  time: 'HH:mm',
  year: 'YYYY',
  month: 'YYYY-MM',
  dateTime: 'YYYY-MM-DD HH:mm'
}

defineOptions({ name: 'mu-date-input', inheritAttrs: false })

const props = defineProps({
  color: String, icon: String, label: String, labelFloat: Boolean,
  actionIcon: String, actionClick: Function, suffix: String, prefix: String,
  errorText: String, helpText: String, fullWidth: Boolean, disabled: Boolean,
  solo: Boolean, underlineColor: String, modelValue: {},
  container: { type: String, default: 'popover' },
  type: { type: String, default: 'date' },
  format: { type: String },
  rangeSeparator: { type: String, default: '~' },
  actions: Boolean,
  clockType: { type: String },
  okLabel: { type: String, default: '确定' },
  cancelLabel: { type: String, default: '取消' },
  valueFormat: String,
  multiLine: Boolean,
  maxLength: [String, Number],
  landscape: Boolean,
  noDisplay: Boolean,
  displayColor: String,
  dateTimeFormat: { type: Object },
  firstDayOfWeek: { type: Number, default: 0 },
  maxDate: { type: Date },
  minDate: { type: Date },
  shouldDisableDate: Function,
  viewType: { type: String, default: 'clock' },
  ampm: Boolean
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])
const attrs = useAttrs()
const { getNormalColorClass, getColor } = useColor(props)
const muFormItem = inject('muFormItem', null)

const isFocused = ref(false)
const open = ref(false)
const date = ref(props.modelValue ? dayjs(props.modelValue).toDate() : new Date())

const rootEl = ref(null)
const inputRef = ref(null)
const contentRef = ref(null)
const popoverRef = ref(null)

const error = computed(() => !!props.errorText || (muFormItem && muFormItem.errorMessage))

const inputClass = computed(() => ({
  'mu-input__focus': isFocused.value, 'has-label': props.label,
  'no-empty-state': props.modelValue, 'has-icon': props.icon,
  'mu-input__error': error.value, 'multi-line': props.multiLine,
  'disabled': props.disabled, 'full-width': props.fullWidth,
  'is-solo': props.solo
}))

const float = computed(() => props.labelFloat && !isFocused.value && !props.modelValue && props.modelValue !== 0)

const colorClass = computed(() => {
  const isFocus = !props.disabled && !props.errorText && isFocused.value
  return isFocus ? getNormalColorClass(props.color, true) : ''
})

const computedColor = computed(() => {
  const isFocus = !props.disabled && !props.errorText && isFocused.value
  return isFocus ? getColor(props.color) : ''
})

const underlineColorClass = computed(() => {
  return isFocused.value ? getNormalColorClass(props.underlineColor, false, false) : ''
})

const underlineColorStyle = computed(() => isFocused.value ? getColor(props.underlineColor) : '')

const inputLength = computed(() => props.modelValue ? String(props.modelValue).length : 0)

const dateStr = computed(() => {
  return props.modelValue ? dayjs(props.modelValue).format(props.format || DEFAULT_FORMAT[props.type]) : ''
})

const triggerEl = computed(() => {
  return rootEl.value ? rootEl.value.querySelector('.mu-text-field') : undefined
})

function generateProps(propDefs) {
  const obj = {}
  Object.keys(propDefs).forEach(key => {
    obj[key] = props[key]
  })
  return obj
}

const datePickerProps = computed(() => ({
  ...generateProps({
    landscape: {},
    noDisplay: {},
    displayColor: {},
    dateTimeFormat: {},
    firstDayOfWeek: {},
    maxDate: {},
    minDate: {},
    shouldDisableDate: {},
    color: {}
  }),
  ...generateProps(PickerMixin.props)
}))

const timePickerProps = computed(() => ({
  ...generateProps({
    viewType: {},
    format: {},
    color: {}
  }),
  ...generateProps(PickerMixin.props)
}))

const dateTimePickerProps = computed(() => ({
  ...datePickerProps.value,
  ...timePickerProps.value
}))

watch(isFocused, (val) => {
  if (!muFormItem) return
  val ? muFormItem.onFocus() : muFormItem.onBlur()
})

watch(() => props.modelValue, (val) => {
  date.value = val ? dayjs(val).toDate() : undefined
})

function changeValue() {
  closePicker()
  const value = props.valueFormat ? dayjs(date.value).format(props.valueFormat) : date.value
  emit('update:modelValue', value)
  emit('change', value)
  if (muFormItem) muFormItem.onBlur()
}

function focus(e) {
  isFocused.value = true
  emit('focus', e)
}

function blur(e) {
  isFocused.value = false
  emit('blur', e)
}

function closePicker() {
  open.value = false
}

function handleDateChange(val) {
  date.value = val
  if (!props.actions) changeValue()
}

function handleTimeChange(val, mode, finished) {
  date.value = val
  if (!finished || mode !== 'minute') return
  if (!props.actions) changeValue()
}

function handleInputKeydown(e) {
  if (keycode(e) === 'tab') {
    blur(e)
    open.value = false
  }
}
</script>
