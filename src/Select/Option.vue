<template>
  <ListItem
    ref="listItemRef"
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
        <Checkbox :model-value="selected" color="secondary" :disabled="disabled" :tab-index="-1" />
      </ListAction>
      <ListItemContent>
        <ListItemTitle>{{ label }}</ListItemTitle>
      </ListItemContent>
    </slot>
  </ListItem>
</template>

<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount } from 'vue'
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

const listItemRef = ref(null)
const getRoot = () => listItemRef.value?.$el
defineExpose({ get root() { return getRoot() } })

const option = {
  get visible() { return visible.value },
  set visible(v) { visible.value = v },
  get focused() { return focused.value },
  set focused(v) { focused.value = v },
  get selected() { return selected.value },
  get root() { return getRoot() },
  get label() { return props.label },
  get value() { return props.value },
  get disabled() { return props.disabled },
  get searchText() { return props.searchText }
}

onMounted(() => addOption(option))
onBeforeUnmount(() => removeOption(option))

function handleClick() {
  optionClick(props.value)
}
</script>
