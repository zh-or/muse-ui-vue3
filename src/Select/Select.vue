<template>
  <div v-click-outside="handleClickOutside" :class="['mu-input', colorClass, inputClass]" :style="{ color }">
    <Icon v-if="icon" class="mu-input-icon" :value="icon" />
    <div v-if="!solo && label" :class="['mu-input-label', { float }]">{{ label }}</div>
    <div :class="['mu-input-content', 'mu-select', selectClass]" ref="selectRef" @click="handleSelectClick">
      <slot name="prepend" />
      <span v-if="prefix && !float" class="mu-input-prefix-text">{{ prefix }}</span>

      <div class="mu-select-content">
        <template v-if="multiple">
          <template v-for="(item, index) in selects" :key="item.value">
            <slot v-if="$slots.selection" name="selection" v-bind="{ ...item, selected: selectedIndex === index, disabled: disabled || readonly }" />
            <Chip v-else-if="chips" tabindex="-1" delete :selected="selectedIndex === index" @delete="handleDelete(index)">
              {{ item.label }}
            </Chip>
            <span v-else :class="['mu-selection-text', { 'is-active': selectedIndex === index }]">
              {{ item.label }}{{ index !== selects.length - 1 ? separator : '' }}
            </span>
          </template>
        </template>

        <input
          ref="inputRef"
          :class="['mu-select-input', { 'is-enable': enableInput, 'is-break': shouldBreak }]"
          tabindex="0"
          :readonly="!enableInput"
          :disabled="disabled"
          :placeholder="!modelValue && modelValue !== 0 ? placeholder : ''"
          :value="searchValue"
          @click="handleInputClick"
          @focus="handleInputFocus"
          @keydown="onKeydown"
          @input="onInput"
        />
        <input type="hidden" v-bind="attrs" :value="modelValue" />
      </div>

      <Popover
        ref="popoverRef"
        :class="['mu-option-list', popoverClass]"
        :style="menuStyle"
        :trigger="selectRef"
        :open="open"
        :space="space"
        :cover="!autoComplete"
        :placement="placement"
        @close="closeMenu"
      >
        <List :textline="textline" :dense="dense">
          <div v-if="!tags && filterable && enableOptions.length === 0" class="mu-select-no-data">{{ noDataText }}</div>
          <slot />
        </List>
      </Popover>

      <span v-if="suffix && !float" class="mu-input-suffix-text">{{ suffix }}</span>
      <div class="mu-select-action">
        <svg class="mu-select-icon" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
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

<script>
import clickOutSide from '../internal/directives/click-outside'
export default { directives: { clickOutside: clickOutSide } }
</script>

<script setup>
import { ref, computed, inject, watch, useAttrs, provide } from 'vue'
import { useColor } from '../composables/useColor'
import keycode from 'keycode'
import List from '../List'
import Popover from '../Popover'
import Chip from '../Chip'
import Icon from '../Icon'

defineOptions({ name: 'mu-select', inheritAttrs: false })

const props = defineProps({
  color: String, icon: String, label: String, labelFloat: Boolean,
  actionIcon: String, actionClick: Function, suffix: String, prefix: String,
  errorText: String, helpText: String, fullWidth: Boolean, disabled: Boolean,
  solo: Boolean, underlineColor: String, modelValue: {},
  popoverClass: [String, Object, Array], multiple: Boolean,
  maxHeight: { type: [String, Number], default: 300 },
  readonly: Boolean, chips: Boolean, tags: Boolean,
  placeholder: String, separator: { type: String, default: ',' },
  filterable: Boolean,
  textline: { type: String, default: '' },
  space: { type: Number, default: 0 },
  placement: { type: String, default: 'bottom-start' },
  dense: { default: true },
  noDataText: { type: String, default: '暂无数据显示' },
  multiLine: Boolean, maxLength: [String, Number]
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])
const attrs = useAttrs()
const { getNormalColorClass, getColor } = useColor(props)
const muFormItem = inject('muFormItem', null)

const isFocused = ref(false)
const open = ref(false)
const options = ref([])
const searchValue = ref('')
const shouldBreak = ref(false)
const selectedIndex = ref(-1)
const focusIndex = ref(-1)

const inputRef = ref(null)
const selectRef = ref(null)
const popoverRef = ref(null)

const error = computed(() => !!props.errorText || (muFormItem && muFormItem.errorMessage))

const inputClass = computed(() => ({
  'mu-input__focus': isFocused.value, 'has-label': props.label,
  'no-empty-state': props.modelValue, 'has-icon': props.icon,
  'mu-input__error': error.value, 'disabled': props.disabled,
  'full-width': props.fullWidth, 'is-solo': props.solo
}))

const float = computed(() => props.labelFloat && !isFocused.value && !props.modelValue && props.modelValue !== 0)

const autoComplete = computed(() => props.filterable || props.tags)

const enableOptions = computed(() => options.value.filter((option) => option.visible && !option.disabled))

const selects = computed(() => {
  if (!props.multiple) {
    const option = getOption(props.modelValue)
    return option ? [{ label: option.label, value: props.modelValue, index: 0 }] : []
  }
  const vals = Array.isArray(props.modelValue) ? props.modelValue : []
  const items = []
  for (let i = 0; i < vals.length; i++) {
    const value = vals[i]
    const option = getOption(value)
    if (option) {
      items.push({ label: option.label, value: option.value, index: items.length })
      continue
    }
    if (props.tags) {
      items.push({ label: value, value, index: items.length })
    }
  }
  return items
})

const enableInput = computed(() => autoComplete.value && !props.readonly)

const selectClass = computed(() => ({
  'is-open': open.value, 'is-multi': props.multiple,
  'is-filterable': autoComplete.value, 'is-readonly': props.readonly,
  'is-disabled': props.disabled
}))

const underlineColorClass = computed(() => isFocused.value ? getNormalColorClass(props.underlineColor, false, false) : '')

const underlineColorStyle = computed(() => isFocused.value ? getColor(props.underlineColor) : '')

const colorClass = computed(() => {
  const isFocus = !props.disabled && !props.errorText && isFocused.value
  return isFocus ? getNormalColorClass(props.color, true) : ''
})

const color = computed(() => {
  const isFocus = !props.disabled && !props.errorText && isFocused.value
  return isFocus ? getColor(props.color) : ''
})

const menuStyle = computed(() => ({
  maxHeight: props.maxHeight + 'px',
  visibility: props.tags && enableOptions.value.length === 0 ? 'hidden' : '',
  minWidth: selectRef.value ? selectRef.value.offsetWidth + 'px' : ''
}))

const inputLength = computed(() => props.modelValue ? String(props.modelValue).length : 0)

watch(isFocused, (val) => {
  if (!muFormItem) return
  val ? muFormItem.onFocus() : muFormItem.onBlur()
})

watch(focusIndex, (val) => {
  enableOptions.value.forEach((option, index) => {
    option.focused = index === val
  })
  setScollPosition(val)
})

watch(searchValue, (val) => {
  if (inputRef.value) {
    if (inputRef.value.scrollWidth > inputRef.value.clientWidth) {
      shouldBreak.value = true
    } else if (val === '') {
      shouldBreak.value = false
    }
  }
  options.value.forEach(option => {
    const searchText = option.searchText || option.label
    option.visible = !autoComplete.value || !val || searchText.toLowerCase().indexOf(val.toLowerCase()) !== -1
  })
  resetFocusIndex()
  if (isFocused.value && !open.value) open.value = true
})

watch(selects, () => {
  setSeachValue()
})

provide('addOption', addOption)
provide('removeOption', removeOption)
provide('optionClick', optionClick)
provide('isOptionSelected', isOptionSelected)
provide('isMultiple', isMultiple)

function isMultiple() { return props.multiple }

function isOptionSelected(value) {
  return value === props.modelValue || (
    props.multiple && props.modelValue && props.modelValue.indexOf(value) !== -1
  )
}

function addOption(option) { options.value.push(option) }

function removeOption(option) {
  const index = options.value.indexOf(option)
  if (index !== -1) options.value.splice(index, 1)
}

function getOption(value) {
  const option = options.value.filter((o) => o.value === value)[0]
  return option || { label: value, value }
}

function insertValue(selectedValue, value) {
  let index = 0
  for (let i = 0; i < options.value.length; i++) {
    const item = options.value[i]
    if (item.selected) {
      index = selectedValue.indexOf(item.value) + 1
      continue
    }
    if (item.value === value) {
      return selectedValue.splice(index, 0, value)
    }
  }
  return selectedValue.push(value)
}

function optionClick(value, notRemove = false) {
  let selectedValue = props.multiple ? props.modelValue ? [...props.modelValue] : [] : props.modelValue
  if (props.multiple) {
    const index = selectedValue.indexOf(value)
    if (index === -1) {
      insertValue(selectedValue, value)
    } else {
      if (!notRemove) selectedValue.splice(index, 1)
    }
  } else {
    selectedValue = value
  }
  emit('update:modelValue', selectedValue)
  emit('change', selectedValue)
  if (props.multiple && autoComplete.value) searchValue.value = ''
  setTimeout(() => {
    focusInput()
    if (!props.multiple) closeMenu()
  }, 0)
}

function activateInput() { isFocused.value = true }

function deactivateInput() {
  isFocused.value = false
  selectedIndex.value = -1
  setSeachValue()
}

function openMenu() {
  open.value = true
  resetOptionVisable()
  const idx = getSelectedIndex()
  setFocusIndex(idx)
  setTimeout(() => setScollPosition(idx), 0)
  if (autoComplete.value) {
    setTimeout(() => inputRef.value?.select(), 0)
  }
}

function closeMenu() { open.value = false; resetFocusIndex() }

function toggleMenu() {
  if (open.value) return closeMenu()
  openMenu()
  focusInput()
}

function resetOptionVisable() {
  options.value.forEach((option) => (option.visible = true))
}

function setSeachValue() {
  if (!props.multiple) searchValue.value = selects.value.map(item => item.label).join(',')
}

function changeSelectedIndex(code) {
  const maxIndex = selects.value.length - 1
  if (code === 'left') {
    selectedIndex.value = selectedIndex.value === -1 ? maxIndex : selectedIndex.value - 1
  } else if (code === 'right') {
    selectedIndex.value = selectedIndex.value >= maxIndex ? -1 : selectedIndex.value + 1
  } else if (selectedIndex.value === -1) {
    selectedIndex.value = maxIndex
    return
  }
  if (['backspace', 'delete'].indexOf(code) !== -1) {
    const newIndex = selectedIndex.value === maxIndex
      ? selectedIndex.value - 1
      : selects.value[selectedIndex.value + 1] ? selectedIndex.value : -1
    if (selectedIndex.value !== -1) removeSelection(selectedIndex.value)
    selectedIndex.value = newIndex
  }
}

function resetSelectedIndex() { selectedIndex.value = -1 }

function removeSelection(index) {
  const value = [...props.modelValue]
  value.splice(index, 1)
  emit('update:modelValue', value)
  emit('change', value)
}

function handleDelete(index) {
  if (props.disabled || props.readonly) return
  removeSelection(index)
}

function onKeydown(e) {
  if (props.disabled || props.readonly) return
  const code = keycode(e)
  if (!open.value && ['enter', 'space', 'up', 'down'].indexOf(code) !== -1) {
    e.preventDefault()
    return openMenu()
  }
  const opts = enableOptions.value
  switch (code) {
    case 'enter': {
      const option = opts[focusIndex.value]
      if (option) {
        optionClick(option.value)
      } else if (props.tags && props.multiple && searchValue.value) {
        optionClick(searchValue.value, true)
      }
      break
    }
    case 'up':
    case 'down':
      e.preventDefault()
      resetSelectedIndex()
      code === 'up' ? decrementFocusIndex() : incrementFocusIndex()
      break
    case 'tab':
      blurEvents()
      if (props.multiple) searchValue.value = ''
      break
    case 'left':
    case 'right':
    case 'delete':
    case 'backspace':
      if (!searchValue.value && autoComplete.value && props.multiple) changeSelectedIndex(code)
      break
    default:
      resetFocusIndex()
      break
  }
}

function decrementFocusIndex() {
  let index = focusIndex.value
  const maxIndex = getOptionCount() - 1
  index--
  if (index < 0) index = maxIndex
  setFocusIndex(index)
}

function incrementFocusIndex() {
  let index = focusIndex.value
  const maxIndex = getOptionCount() - 1
  index++
  if (index > maxIndex) index = 0
  setFocusIndex(index)
}

function getOptionCount() { return enableOptions.value.length }

function resetFocusIndex() { focusIndex.value = -1 }

function setFocusIndex(index) { focusIndex.value = index }

function getSelectedIndex() {
  for (let i = 0; i < enableOptions.value.length; i++) {
    if (enableOptions.value[i].selected) return i
  }
  return -1
}

function setScollPosition(index) {
  if (index === -1 || !open.value) return
  setTimeout(() => {
    const option = enableOptions.value[index]
    if (!option) return
    const optionEl = option.root
    const optionHeight = optionEl.offsetHeight
    let scrollTop = optionEl.offsetTop - optionHeight
    if (scrollTop < optionHeight) scrollTop = 0
    popoverRef.value?.root?.scrollTo(0, scrollTop)
  }, 0)
}

function blurEvents() {
  deactivateInput()
  closeMenu()
  emit('blur')
}

function focusInput() { inputRef.value?.focus() }

function focus() {
  activateInput()
  openMenu()
  emit('focus')
  focusInput()
}

function handleSelectClick(e) {
  if (props.disabled || props.readonly || (autoComplete.value && e.target === inputRef.value)) return
  if (popoverRef.value?.root?.contains(e.target)) return
  toggleMenu()
}

function handleInputClick(e) {
  if (props.disabled || props.readonly || !autoComplete.value) return
  if (isFocused.value && !open.value) {
    openMenu()
    return
  }
  focus()
}

function handleInputFocus(e) {
  if (props.disabled || props.readonly || isFocused.value) return
  activateInput()
  setTimeout(focusInput, 0)
}

function onInput(e) { searchValue.value = e.target.value }

function handleClickOutside(e) {
  if (open.value && popoverRef.value?.root?.contains(e.target)) return
  blurEvents()
}

setSeachValue()
</script>
