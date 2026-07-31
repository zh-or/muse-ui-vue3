<template>
  <div v-click-outside="handleClickOutside" :class="['mu-input', colorClass, inputClass]" :style="{ color: computedColor }">
    <Icon v-if="icon" class="mu-input-icon" :value="icon" />
    <div v-if="!solo && label" :class="['mu-input-label', { float }]">{{ label }}</div>
    <div class="mu-input-content mu-text-field">
      <slot name="prepend" />
      <span v-if="prefix && !float" class="mu-input-prefix-text">{{ prefix }}</span>

      <input
        ref="inputRef"
        class="mu-text-field-input"
        tabindex="0"
        v-bind="attrs"
        :disabled="disabled"
        :placeholder="!labelFloat ? attrs.placeholder : ''"
        :value="modelValue"
        @input="onInput"
        @change="(e) => emit('change', e.target.value, e)"
        @keydown="onKeydown"
        @focus="focus"
      />

      <slot />

      <span v-if="suffix && !float" class="mu-input-suffix-text">{{ suffix }}</span>
      <Icon v-if="actionIcon" class="mu-input-action-icon" :value="actionIcon" @click="!disabled && actionClick && actionClick()" />
      <slot name="append" />

      <Popover
        ref="popoverRef"
        :class="popoverClass"
        :style="popoverStyle"
        :trigger="inputRef"
        :placement="placement"
        :space="space"
        :open="open"
        @close="open = false"
      >
        <List ref="listRef" class="mu-option-list" :dense="dense" :textline="textline" :style="{ maxHeight: maxHeight + 'px' }">
          <ListItem
            v-for="(item, index) in enableData"
            :key="index"
            :class="['mu-option', { 'is-focused': focusIndex === index }]"
            button
            :avatar="avatar"
            @click="setValue(item.value, item.item, $event)"
          >
            <slot v-bind="{ ...item, index }">
              <span v-html="item.highlight"></span>
            </slot>
          </ListItem>
        </List>
        <slot name="popover" />
      </Popover>

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

<script>
import clickOutSide from '../internal/directives/click-outside'
export default { directives: { clickOutside: clickOutSide } }
</script>

<script setup>
import { ref, computed, inject, watch, useAttrs } from 'vue'
import { useColor } from '../composables/useColor'
import keycode from 'keycode'
import Popover from '../Popover'
import { List, ListItem } from '../List'
import caseSensitiveFilter from './filter'
import { isPromise } from '../utils'
import Icon from '../Icon'

defineOptions({ name: 'mu-auto-complete', inheritAttrs: false })

const props = defineProps({
  color: String, icon: String, label: String, labelFloat: Boolean,
  actionIcon: String, actionClick: Function, suffix: String, prefix: String,
  errorText: String, helpText: String, fullWidth: Boolean, disabled: Boolean,
  solo: Boolean, underlineColor: String, modelValue: {},
  data: { type: Array, default: () => [] },
  maxHeight: { type: [String, Number], default: 300 },
  debounce: { type: Number, default: 200 },
  filter: { type: Function, default: caseSensitiveFilter },
  maxSearchResults: { type: Number, default: 0 },
  openOnFocus: Boolean,
  dense: { type: Boolean, default: true },
  textline: { type: String, default: '' },
  popoverClass: String,
  placement: { type: String, default: 'bottom-start' },
  space: Number,
  avatar: Boolean,
  multiLine: Boolean,
  maxLength: [String, Number]
})

const emit = defineEmits(['update:modelValue', 'select', 'change', 'keydown', 'focus', 'blur'])
const attrs = useAttrs()
const { getNormalColorClass, getColor } = useColor(props)

const muFormItem = inject('muFormItem', null)
const isFocused = ref(false)
const open = ref(false)
const enableData = ref([])
const focusIndex = ref(-1)
const timer = ref(null)

const inputRef = ref(null)
const listRef = ref(null)
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

const underlineColorClass = computed(() => isFocused.value ? getNormalColorClass(props.underlineColor, false, false) : '')

const underlineColorStyle = computed(() => isFocused.value ? getColor(props.underlineColor) : '')

const inputLength = computed(() => props.modelValue ? String(props.modelValue).length : 0)

const popoverStyle = computed(() => ({
  visibility: enableData.value.length === 0 ? 'hidden' : '',
  minWidth: inputRef.value ? inputRef.value.offsetWidth + 'px' : ''
}))

watch(isFocused, (val) => {
  if (!muFormItem) return
  val ? muFormItem.onFocus() : muFormItem.onBlur()
})

watch(focusIndex, () => {
  setScrollPosition()
})

function setValue(value, item, e) {
  open.value = false
  focusIndex.value = -1
  if (!item) return
  emit('update:modelValue', value, e)
  emit('select', value, item, e)
  emit('change', value, e)
}

function onKeydown(e) {
  if (props.disabled || attrs.readonly) return
  const code = keycode(e)
  const maxIdx = enableData.value.length - 1
  const minIdx = 0
  switch (code) {
    case 'enter': {
      if (focusIndex.value === -1) return
      const { value, item } = enableData.value[focusIndex.value]
      setValue(value, item, e)
      break
    }
    case 'up':
      e.preventDefault()
      if (!open.value) return
      focusIndex.value--
      if (focusIndex.value < minIdx) focusIndex.value = maxIdx
      break
    case 'down':
      e.preventDefault()
      if (!open.value) return
      focusIndex.value++
      if (focusIndex.value > maxIdx) focusIndex.value = minIdx
      break
    case 'tab':
      blur(e)
      break
    default:
      focusIndex.value = -1
      break
  }
  emit('keydown', e)
}

function onInput(e) {
  const value = e.target.value
  if (timer.value) clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    filterData(value)
  }, props.debounce)
  emit('update:modelValue', value, e)
}

function focus(e) {
  isFocused.value = true
  if (props.openOnFocus) filterData(props.modelValue)
  emit('focus', e)
}

function filterData(val) {
  open.value = true
  const results = props.filter(val, props.data, props.maxSearchResults)
  switch (true) {
    case Array.isArray(results):
      enableData.value = results
      return
    case isPromise(results):
      results.then((res) => {
        enableData.value = Array.isArray(res) ? res : []
      })
      return
  }
  enableData.value = []
}

function blur(e) {
  isFocused.value = false
  focusIndex.value = -1
  open.value = false
  emit('blur', e)
}

function setScrollPosition() {
  if (!open.value) return
  Promise.resolve().then(() => {
    const popoverEl = listRef.value?.root
    if (!popoverEl) return
    const optionEl = popoverEl.querySelector('.is-focused')
    if (!optionEl) return
    const optionHeight = optionEl.offsetHeight
    let scrollTop = optionEl.offsetTop - optionHeight
    if (scrollTop < optionHeight) scrollTop = 0
    popoverEl.scrollTop = scrollTop
  })
}

function handleClickOutside(e) {
  if (popoverRef.value?.root?.contains(e.target)) return
  blur(e)
}
</script>
