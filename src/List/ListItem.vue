<template>
  <li ref="rootEl">
    <AbstractButton
      class="mu-item-wrapper"
      ref="buttonRef"
      :tabindex="isButton ? tabIndex : -1"
      :container-element="isButton ? 'a' : 'div'"
      :disabled="disabled"
      :ripple="isButton && ripple"
      :ripple-color="rippleColor"
      :ripple-opacity="rippleOpacity"
      :center-ripple="false"
      :wrapper-class="itemClass"
      :wrapper-style="{ 'margin-left': nestedPadding }"
      :to="to"
      :href="href"
      :target="target"
      :tag="tag"
      :active-class="activeClass"
      :event="event"
      :exact="exact"
      :exact-active-class="exactActiveClass"
      :append="append"
      :replace="replace"
      @click="handleClick"
      @keyboard-focus="handleKeyboardFocus"
      @hover="handleHover"
      @hover-exit="handleHoverExit"
    >
      <slot />
      <slot name="prepend" />
      <div v-if="title" class="mu-item-title">{{ title }}</div>
      <div v-if="subTitle" class="mu-item-subtitle">{{ subTitle }}</div>
      <div v-if="describe" class="mu-item-describe">{{ describe }}</div>
      <slot name="append" />
    </AbstractButton>
    <ExpandTransition v-if="nested && toggleNestedType === 'expand'">
      <List v-if="nestedOpen" :class="nestedListClass" :nested-indent="nestedIndent" :toggle-nested="toggleNested" :toggle-nested-type="toggleNestedType" :nested-level="nestedLevel + 1" :value="getListValue()" @item-click="handleNestedClick">
        <slot name="nested" />
      </List>
    </ExpandTransition>
    <Popover v-if="nested && toggleNestedType === 'popover'" :open="nestedOpen" :trigger="rootEl" :append-body="false" placement="right-start" @close="handleToggleNested">
      <List :class="nestedListClass" :nested-indent="nestedIndent" :toggle-nested="toggleNested" :toggle-nested-type="toggleNestedType" :nested-level="nestedLevel + 1" :value="getListValue()" @item-click="handleNestedClick">
        <slot name="nested" />
      </List>
    </Popover>
  </li>
</template>

<script setup>
import { ref, computed, inject, getCurrentInstance } from 'vue'
import AbstractButton from '../internal/AbstractButton'
import { useRoute, routeProps } from '../composables/useRoute'
import { useRipple, rippleProps } from '../composables/useRipple'
import ExpandTransition from '../internal/ExpandTransition'
import List from './List'
import Popover from '../Popover'
import { isNotNull } from '../utils'

defineOptions({ name: 'mu-list-item', inheritAttrs: false })

const emit = defineEmits(['click', 'keyboard-focus', 'hover', 'hover-exit', 'toggle-nested'])
const props = defineProps({
  ...routeProps, ...rippleProps,
  button: Boolean, nestedListClass: [String, Object, Array],
  open: { type: Boolean, default: true },
  avatar: Boolean, nested: Boolean, tabIndex: [String, Number],
  value: {}, title: String, subTitle: String, describe: String, disabled: Boolean
})

const instance = getCurrentInstance()
const { generateRouteProps } = useRoute(props)
useRipple()

const isButton = computed(() => {
  if (props.button) return true
  const raw = instance.vnode?.props || {}
  return !!(raw.onClick || raw['onClick'])
})

const listItemClick = inject('listItemClick', () => {})
const getNestedLevel = inject('getNestedLevel', () => 0)
const getNestedIndent = inject('getNestedIndent', () => true)
const getListValue = inject('getListValue', () => undefined)
const getToggleNested = inject('getToggleNested', () => false)
const getToggleNestedType = inject('getToggleNestedType', () => 'expand')
const textline = inject('textline', '')

const nestedOpen = ref(props.open)
const rootEl = ref(null)

const nestedLevel = computed(() => getNestedLevel())
const nestedIndent = computed(() => getNestedIndent())
const toggleNested = computed(() => getToggleNested())
const toggleNestedType = computed(() => getToggleNestedType())

const listValue = computed(() => getListValue())

const nestedPadding = computed(() => {
  return nestedIndent.value && toggleNestedType.value === 'expand' ? 18 * nestedLevel.value + 'px' : ''
})

const itemClass = computed(() => {
  return [
    'mu-item',
    nestedOpen.value && props.nested ? 'mu-item__open' : '',
    props.avatar ? 'has-avatar' : '',
    textline,
    isNotNull(listValue.value) && isNotNull(props.value) && listValue.value === props.value ? 'is-selected' : ''
  ].filter(Boolean).join(' ')
})

const itemRef = { get value() { return props.value } }

if (toggleNestedType.value === 'popover' && nestedOpen.value) {
  nestedOpen.value = false
}

function handleClick(e) {
  emit('click', e)
  listItemClick(itemRef)
  if (toggleNested.value) handleToggleNested()
}

function handleKeyboardFocus(isFocus) { emit('keyboard-focus', isFocus) }
function handleHover(event) { emit('hover', event) }
function handleHoverExit(event) { emit('hover-exit', event) }
function handleToggleNested() {
  nestedOpen.value = !nestedOpen.value
  emit('toggle-nested', nestedOpen.value)
}
function handleNestedClick(item) { listItemClick(item) }
</script>
