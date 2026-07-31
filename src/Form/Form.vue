<template>
  <form :class="['mu-form', { 'mu-form__inline': inline }]">
    <slot />
  </form>
</template>

<script setup>
import { provide, ref, defineOptions } from 'vue'
import { isPromise, getObjAttr } from '../utils'

defineOptions({ name: 'mu-form' })

const props = defineProps({
  model: { type: Object, required: true },
  inline: Boolean,
  labelWidth: [String, Number],
  labelPosition: {
    type: String,
    default: 'top',
    validator: (val) => ['left', 'right', 'top'].indexOf(val) !== -1
  },
  autoValidate: { type: Boolean, default: true }
})

const items = ref([])

function getValue(prop) {
  return getObjAttr(props.model, prop)
}

function addItem(item) {
  items.value.push(item)
}

function removeItem(item) {
  const index = items.value.indexOf(item)
  if (index === -1) return
  items.value.splice(index, 1)
}

function validate() {
  let valid = true
  const promises = []
  for (let i = 0; i < items.value.length; i++) {
    const item = items.value[i]
    const result = item.validate()
    if (isPromise(result)) { promises.push(result); continue }
    if (!result) valid = false
  }
  if (promises.length > 0 && typeof Promise !== 'undefined') {
    return Promise.all([valid ? Promise.resolve(valid) : Promise.reject(valid), ...promises])
      .then(() => true, () => false)
  }
  return typeof Promise !== 'undefined' ? Promise.resolve(valid) : valid
}

function clear() {
  items.value.forEach((item) => (item.errorMessage = ''))
}

provide('muForm', { items, getValue, addItem, removeItem, autoValidate: props.autoValidate, validate, clear })
</script>
