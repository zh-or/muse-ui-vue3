<script>
import keycode from 'keycode'

let tabPressed = false
let listening = false

function listenForTabPresses() {
  if (!listening) {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (event) => {
        tabPressed = keycode(event) === 'tab'
      })
    }
    listening = true
  }
}
</script>

<template>
  <component
    :is="tagName"
    v-bind="mergedBindings"
    @mouseup="handleMouseUp"
    @mousedown="handleMouseDown"
    @mouseenter="handleHover"
    @mouseleave="handleMouseLeave"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchCancel"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeydown"
  >
    <FocusRipple
      v-if="isKeyboardFocused && !disableKeyboardFocus && !disabled && ripple"
      :color="rippleColor"
      :opacity="rippleOpacity"
    />
    <TouchRipple
      v-if="!disabled && ripple"
      ref="rippleRef"
      :class="wrapperClass"
      :style="wrapperStyle"
      :auto-bind="false"
      :color="rippleColor"
      :center-ripple="centerRipple"
      :opacity="rippleOpacity"
    >
      <slot />
    </TouchRipple>
    <div v-else :class="wrapperClass" :style="wrapperStyle">
      <slot />
    </div>
  </component>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, useAttrs } from 'vue'
import TouchRipple from './TouchRipple.vue'
import FocusRipple from './FocusRipple.vue'
import { routeProps } from '../composables/useRoute'
import { rippleProps } from '../composables/useRipple'
import { isPc } from '../utils'

defineOptions({ inheritAttrs: false })

const emit = defineEmits(['click', 'hover', 'hoverExit', 'keydown', 'focus', 'blur',
  'mouseenter', 'mouseleave', 'mousedown', 'mouseup',
  'touchstart', 'touchend', 'touchcancel', 'keyboardFocus', 'KeyboardFocus'])

const props = defineProps({
  ...routeProps,
  ...rippleProps,
  disabled: Boolean,
  centerRipple: Boolean,
  containerElement: String,
  disableKeyboardFocus: Boolean,
  wrapperClass: String,
  wrapperStyle: [String, Object],
  type: {
    type: String,
    default: 'button'
  },
  keyboardFocused: Boolean
})

const attrs = useAttrs()

const hover = ref(false)
const isKeyboardFocused = ref(false)
const rippleRef = ref(null)
let focusTimeout = null

const buttonClass = computed(() => {
  const classNames = []
  if (props.disabled) classNames.push('disabled')
  if (!props.disabled && (hover.value || isKeyboardFocused.value)) classNames.push('hover')
  return classNames.join(' ')
})

if (!props.disabled && props.keyboardFocused && !props.disableKeyboardFocus) {
  isKeyboardFocused.value = true
}

onMounted(() => {
  listenForTabPresses()
  if (isKeyboardFocused.value) {
    const el = rippleRef.value?.root?.parentElement
    if (el) el.focus()
    emit('keyboardFocus', true)
  }
})

onBeforeUnmount(() => {
  cancelFocusTimeout()
})

watch(() => props.disabled, (val) => {
  if (!val) hover.value = false
})

watch(() => props.disabled || props.disableKeyboardFocus, () => {
  if ((props.disabled || props.disableKeyboardFocus) && isKeyboardFocused.value) {
    isKeyboardFocused.value = false
    emit('keyboardFocus', false)
  }
})

const tagName = computed(() => {
  const defaultTag = 'button'
  switch (true) {
    case !!props.to:
      return 'router-link'
    case !!props.href:
      return 'a'
    case !!props.containerElement:
      return props.containerElement
    default:
      return defaultTag
  }
})

const tagAttrs = computed(() => {
  const result = {
    target: props.target,
    tabindex: !props.disabled ? (attrs.tabindex || 0) : -1
  }
  if (tagName.value === 'button') {
    result.disabled = props.disabled
    result.type = props.type
  }
  if (props.href && !props.disabled) {
    result.href = props.href
  }
  return result
})

const routePropsObj = computed(() => props.to && !props.disabled ? {
  to: props.to,
  tag: props.tag,
  activeClass: props.activeClass,
  event: props.event,
  exact: props.exact,
  append: props.append,
  replace: props.replace,
  exactActiveClass: props.exactActiveClass
} : {})

const buttonStyle = computed(() => tagName.value === 'button' ? {
  'user-select': props.disabled ? '' : 'none',
  '-webkit-user-select': props.disabled ? '' : 'none',
  'outline': 'none',
  'appearance': 'none'
} : {})

const mergedBindings = computed(() => ({
  class: buttonClass.value,
  ...attrs,
  ...tagAttrs.value,
  ...routePropsObj.value,
  style: buttonStyle.value
}))

function handleHover(event) {
  if (!props.disabled && isPc()) {
    hover.value = true
    emit('hover', event)
    emit('mouseenter', event)
  }
}

function handleOut(event) {
  if (!props.disabled && isPc()) {
    hover.value = false
    emit('hoverExit', event)
    emit(event.type, event)
  }
}

function removeKeyboardFocus(event) {
  if (isKeyboardFocused.value) {
    isKeyboardFocused.value = false
    emit('KeyboardFocus', false)
  }
}

function setKeyboardFocus(event) {
  if (!isKeyboardFocused.value) {
    isKeyboardFocused.value = true
    emit('KeyboardFocus', true)
  }
}

function cancelFocusTimeout() {
  if (focusTimeout) {
    clearTimeout(focusTimeout)
    focusTimeout = null
  }
}

function handleKeydown(event) {
  if (!props.disabled && !props.disableKeyboardFocus) {
    if (keycode(event) === 'enter' && isKeyboardFocused.value) {
      event.target?.click()
      event.preventDefault()
    }
    if (keycode(event) === 'esc' && isKeyboardFocused.value) {
      removeKeyboardFocus(event)
    }
  }
  emit('keydown', event)
}

function handleFocus(event) {
  if (!props.disabled && !props.disableKeyboardFocus) {
    focusTimeout = setTimeout(() => {
      if (tabPressed) {
        setKeyboardFocus(event)
        tabPressed = false
      }
    }, 150)
    emit('focus', event)
  }
}

function handleBlur(event) {
  cancelFocusTimeout()
  removeKeyboardFocus(event)
  emit('blur', event)
}

function handleClick(event) {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  tabPressed = false
  removeKeyboardFocus(event)
  emit('click', event)
}

function handleMouseUp(event) {
  rippleRef.value?.end(event)
  emit('mouseup', event)
}

function handleMouseDown(event) {
  rippleRef.value?.handleMouseDown(event)
  emit('mousedown', event)
}

function handleMouseLeave(event) {
  rippleRef.value?.end(event)
  handleOut(event)
}

function handleTouchStart(event) {
  rippleRef.value?.handleTouchStart(event)
  emit('touchstart', event)
}

function handleTouchEnd(event) {
  rippleRef.value?.end(event)
  handleOut(event)
}

function handleTouchCancel(event) {
  rippleRef.value?.end(event)
  handleOut(event)
}
</script>
