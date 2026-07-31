<template>
  <Transition name="mu-dialog-transition">
    <div
      v-if="open"
      class="mu-dialog-wrapper"
      :style="{ 'z-index': zIndex }"
      @click="handleWrapperClick"
      v-resize="setMaxDialogContentHeight"
    >
      <div
        ref="dialogRef"
        :class="['mu-dialog', dialogClassArray, {
          'mu-dialog-fullscreen': fullscreen,
          'mu-dialog-scrollable': scrollable,
          ['mu-' + transition]: true
        }]"
        tabindex="-1"
        :style="dialogStyle"
      >
        <div v-if="hasTitle" ref="titleRef" class="mu-dialog-title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div ref="elBodyRef" class="mu-dialog-body">
          <slot />
        </div>
        <div v-if="hasActions" ref="footerRef" class="mu-dialog-actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import resize from '../internal/directives/resize'
export default { directives: { resize } }
</script>

<script setup>
import { ref, computed, nextTick, watch, onMounted, onUpdated, getCurrentInstance } from 'vue'
import { usePopup, popupProps } from '../composables/usePopup'
import { convertClass, getWidth } from '../utils'
import { useSlots } from 'vue'

defineOptions({ name: 'mu-dialog' })

const props = defineProps({
  ...popupProps,
  dialogClass: [String, Array, Object],
  title: String,
  scrollable: Boolean,
  padding: {
    type: Number,
    default: 64
  },
  fullscreen: Boolean,
  width: [String, Number],
  maxWidth: [String, Number],
  lockScroll: {
    type: Boolean,
    default: true
  },
  transition: {
    type: String,
    default: 'scale',
    validator: (val) => ['slide-top', 'slide-bottom', 'slide-left', 'slide-right', 'fade', 'scale'].indexOf(val) !== -1
  }
})

const emit = defineEmits(['update:open'])
const slots = useSlots()
const instance = getCurrentInstance()
const { overlayZIndex, zIndex, overlayClick, escPress } = usePopup(props, { emit }, instance.proxy)

const titleRef = ref(null)
const elBodyRef = ref(null)
const footerRef = ref(null)
const dialogRef = ref(null)

const dialogClassArray = computed(() => convertClass(props.dialogClass))
const hasTitle = computed(() => props.title || (slots.title && slots.title().length > 0))
const hasActions = computed(() => slots.actions && slots.actions().length > 0)

const dialogStyle = computed(() => {
  if (props.fullscreen) return {}
  return {
    'max-width': props.maxWidth === 'auto' ? undefined : getWidth(props.maxWidth),
    'width': props.width === 'auto' ? undefined : getWidth(props.width)
  }
})

function setMaxDialogContentHeight() {
  const dialogEl = dialogRef.value
  if (!dialogEl) return
  if (!props.scrollable) {
    dialogEl.style.maxHeight = ''
    return
  }
  const maxDialogContentHeight = window.innerHeight - 2 * props.padding
  if (elBodyRef.value) {
    let maxBodyHeight = maxDialogContentHeight
    if (footerRef.value) maxBodyHeight -= footerRef.value.offsetHeight
    if (titleRef.value) maxBodyHeight -= titleRef.value.offsetHeight
    elBodyRef.value.style.maxHeight = maxBodyHeight + 'px'
  }
  dialogEl.style.maxHeight = maxDialogContentHeight + 'px'
}

function handleWrapperClick(e) {
  if (e.target !== e.currentTarget) return
  overlayClick(e)
}

onMounted(() => setMaxDialogContentHeight())
onUpdated(() => nextTick(() => setMaxDialogContentHeight()))
watch(() => props.open, (val) => {
  if (!val) return
  nextTick(() => {
    setMaxDialogContentHeight()
    if (dialogRef.value) dialogRef.value.focus()
  })
})
</script>
