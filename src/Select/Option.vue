<template>
  <ListItem
    v-show="visible"
    :class="['mu-option', { 'is-selected': selected, 'is-disabled': disabled, 'is-focused': focused }]"
    :ripple="ripple"
    :open="open"
    :avatar="avatar"
    :button="!disabled"
    tabIndex="-1"
    @click="handleClick"
  >
    <slot>
      <ListAction v-if="isMultiple()">
        <Checkbox :input-value="selected" color="secondary" :disabled="disabled" :tab-index="-1" />
      </ListAction>
      <ListItemContent>
        <ListItemTitle>{{ label }}</ListItemTitle>
      </ListItemContent>
    </slot>
  </ListItem>
</template>

<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { ListItem, ListItemContent, ListItemTitle, ListAction } from '../List'
import Checkbox from '../Checkbox'

defineOptions({ name: 'mu-option', inheritAttrs: false })

const props = defineProps({
  label: { required: true, type: String },
  value: { required: true },
  disabled: Boolean,
  ripple: { type: Boolean, default: true },
  searchText: String,
  avatar: Boolean,
  open: Boolean
})

const addOption = inject('addOption')
const removeOption = inject('removeOption')
const optionClick = inject('optionClick')
const isOptionSelected = inject('isOptionSelected')
const isMultiple = inject('isMultiple')

const visible = ref(true)
const focused = ref(false)

const selected = computed(() => isOptionSelected(props.value))

const instance = getCurrentInstance()
defineExpose({ get root() { return instance.proxy.$el } })

const option = {
  get visible() { return visible.value },
  set visible(v) { visible.value = v },
  get focused() { return focused.value },
  set focused(v) { focused.value = v },
  get selected() { return selected.value },
  get root() { return instance.proxy.$el },
  label: props.label,
  value: props.value,
  disabled: props.disabled,
  searchText: props.searchText
}

onMounted(() => addOption(option))
onBeforeUnmount(() => removeOption(option))

function handleClick() {
  optionClick(props.value)
}
</script>
