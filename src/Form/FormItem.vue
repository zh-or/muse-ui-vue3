<template>
  <div
    :class="itemClass"
  >
    <div
      v-if="label || hasLabelSlot"
      class="mu-form-item-label"
      :class="{ 'is-float': labelFloat && !focus && !fieldValue && fieldValue !== 0 }"
      :style="{ width: labelWidthStyle }"
      @click="onLabelClick"
    >
      <slot name="label">{{ label }}</slot>
    </div>
    <Icon v-if="icon && effectiveLabelPosition === 'top'" class="mu-form-item-icon" :value="icon" />
    <SlideTopTransition>
      <div v-if="helpText || errorMessage" class="mu-form-item-help" ref="help">{{ errorMessage || helpText }}</div>
    </SlideTopTransition>
    <div class="mu-form-item-content" ref="content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, provide, onMounted, onBeforeUnmount, watch, nextTick, useSlots } from 'vue'
import Icon from '../Icon'
import { getWidth, isPromise, isObject } from '../utils'
import { SlideTopTransition } from '../internal/transitions'

defineOptions({
  name: 'mu-form-item',
  inheritAttrs: false
})

const props = defineProps({
  label: String,
  labelFloat: Boolean,
  icon: String,
  prop: String,
  labelWidth: [String, Number],
  rules: Array,
  helpText: String,
  errorText: String,
  labelPosition: String
})

const slots = useSlots()
const muForm = inject('muForm', null)
const focus = ref(false)
const errorMessage = ref(props.errorText || '')
const help = ref(null)
const content = ref(null)

const hasLabelSlot = computed(() => slots.label && slots.label().length > 0)
const labelWidthStyle = computed(() => getWidth(props.labelWidth || (muForm && muForm.labelWidth)))
const effectiveLabelPosition = computed(() => props.labelPosition || (muForm && muForm.labelPosition))
const fieldValue = computed(() => muForm && muForm.model && props.prop && muForm.model[props.prop])

const itemClass = computed(() => [
  'mu-form-item',
  {
    'mu-form-item__float-label': props.labelFloat,
    'mu-form-item__label-left': effectiveLabelPosition.value === 'left',
    'mu-form-item__label-right': effectiveLabelPosition.value === 'right',
    'mu-form-item__has-icon': !!props.icon && effectiveLabelPosition.value === 'top',
    'mu-form-item__has-label': !!props.label || hasLabelSlot.value,
    'mu-form-item__focus': focus.value,
    'mu-form-item__error': !!errorMessage.value
  }
])

function validate() {
  if (!props.rules || props.rules.length === 0) return true
  const promises = []
  const promiseMessages = []
  for (let i = 0; i < props.rules.length; i++) {
    const rule = props.rules[i]
    const result = rule.validate(muForm.getValue(props.prop), muForm.model)
    if (isPromise(result)) { promises.push(result); promiseMessages.push(rule.message); continue }
    if (!validateResult(result, rule.message)) return false
  }
  if (promises.length > 0 && typeof Promise !== 'undefined') {
    return Promise.all(promises).then((results) => {
      for (let i = 0; i < results.length; i++) {
        if (!validateResult(results[i], promiseMessages[i])) return Promise.reject(false)
      }
      errorMessage.value = ''
      return true
    })
  }
  errorMessage.value = ''
  return true
}

function validateResult(result, message) {
  switch (true) {
    case isObject(result) && !result.valid:
      errorMessage.value = result.message || message
      return false
    case !result:
      errorMessage.value = message
      return false
  }
  return true
}

function onFocus() { focus.value = true }

function onBlur() {
  focus.value = false
  if (muForm && muForm.autoValidate) validate()
}

function onLabelClick() {}

function setHelpLeft() {
  if (!help.value || !content.value) return
  help.value.style.left = content.value.offsetLeft + 'px'
}

const muFormItemInterface = {
  get errorMessage() { return errorMessage.value },
  set errorMessage(val) { errorMessage.value = val },
  onFocus, onBlur, validate
}
provide('muFormItem', muFormItemInterface)

const thisRef = muFormItemInterface

onMounted(() => { setHelpLeft(); muForm && muForm.addItem(thisRef) })
onBeforeUnmount(() => muForm && muForm.removeItem(thisRef))

watch(() => props.errorText, (val) => { errorMessage.value = val })
watch(() => props.rules, () => { if (errorMessage.value) validate() })
watch([help, content], () => { nextTick(() => setHelpLeft()) })
</script>
