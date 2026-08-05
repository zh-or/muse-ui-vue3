<template>
  <Paper
    ref="rootEl"
    :class="['mu-drawer', { 'is-open': open, 'is-right': right }]"
    :style="drawerStyle"
    :z-depth="zDepth"
  >
    <slot />
  </Paper>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, getCurrentInstance } from 'vue'
import PopupManager from '../internal/mixins/popup/manager'
import { getZIndex } from '../internal/mixins/popup/utils'
import { getWidth } from '../utils'
import Paper from '../Paper'

defineOptions({ name: 'mu-drawer' })

const props = defineProps({
  right: Boolean,
  open: Boolean,
  docked: {
    type: Boolean,
    default: true
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  width: [Number, String],
  zDepth: {
    type: Number,
    default: 16
  }
})

const emit = defineEmits(['update:open', 'close', 'show', 'hide'])
const instance = getCurrentInstance()
const rootEl = ref(null)
const overlayZIndex = ref(getZIndex())
const zIndex = ref(getZIndex())
let handleTransition = null
let popupInstance = null

const drawerStyle = computed(() => ({
  width: getWidth(props.width),
  'z-index': props.docked ? '' : zIndex.value
}))

function close(reason) {
  emit('update:open', false)
  emit('close', reason)
}

function overlayClick() {
  close('overlay')
}

function escPress() {
  if (props.docked) return
  close('esc')
}

function resetZIndex() {
  overlayZIndex.value = getZIndex()
  zIndex.value = getZIndex()
}

function popupOpen() {
  popupInstance = {
    overlayClick,
    escPress,
    overlayZIndex: overlayZIndex.value,
    overlay: !props.docked,
    overlayColor: '#000',
    overlayOpacity: 0.4,
    lockScroll: props.lockScroll,
    $el: rootEl.value.$el
  }
  PopupManager.open(popupInstance)
}

function popupClose() {
  if (popupInstance) {
    PopupManager.close(popupInstance)
    popupInstance = null
  }
}

const transitionEvents = ['msTransitionEnd', 'mozTransitionEnd', 'oTransitionEnd', 'webkitTransitionEnd', 'transitionend']

function bindTransition() {
  handleTransition = (e) => {
    if (e.propertyName !== 'transform') return
    emit(props.open ? 'show' : 'hide')
  }
  transitionEvents.forEach((eventName) => {
    rootEl.value.$el.addEventListener(eventName, handleTransition)
  })
}

function unBindTransition() {
  if (!handleTransition) return
  transitionEvents.forEach((eventName) => {
    rootEl.value.$el.removeEventListener(eventName, handleTransition)
  })
}

onMounted(() => {
  if (props.open && !props.docked) popupOpen()
  bindTransition()
})

onBeforeUnmount(() => {
  popupClose()
  unBindTransition()
})

watch(() => props.open, (val) => {
  if (val && !props.docked) {
    popupOpen()
  } else {
    popupClose()
  }
})

watch(() => props.docked, (val, oldVal) => {
  if (val && !oldVal) {
    popupClose()
  }
})
</script>
