<template>
  <component :is="transitionComp">
    <div
      v-if="open"
      :class="['mu-snackbar', colorClass, textColorClass, snackbarPositionClass]"
      :style="{ 'z-index': zIndex, 'background-color': bgColor, 'color': textColor }"
    >
      <div class="mu-snackbar-message">
        <slot>{{ message }}</slot>
      </div>
      <div v-if="hasAction" class="mu-snackbar-action">
        <slot name="action" />
      </div>
    </div>
  </component>
</template>

<script setup>
import { computed, useSlots, getCurrentInstance } from 'vue'
import { usePopup, popupProps } from '../composables/usePopup'
import { useColor } from '../composables/useColor'
import { SlideTopTransition, SlideBottomTransition } from '../internal/transitions'

defineOptions({ name: 'mu-snackbar' })
const emit = defineEmits(['update:open'])
const instance = getCurrentInstance()
const props = defineProps({
  ...popupProps,
  overlay: { default: false },
  escPressClose: { default: false },
  textColor: String,
  message: String,
  position: {
    type: String,
    default: 'bottom',
    validator: (val) => ['top-start','top','top-end','bottom-start','bottom','bottom-end'].indexOf(val) !== -1
  }
})
const slots = useSlots()
const { zIndex } = usePopup(props, { emit }, instance.proxy)
const { getColorClass, getTextColorClass, getColor } = useColor(props)

const colorClass = computed(() => getColorClass())
const textColorClass = computed(() => getTextColorClass())
const bgColor = computed(() => getColor(props.color))
const textColor = computed(() => getColor(props.textColor))
const hasAction = computed(() => slots.action && slots.action().length > 0)
const snackbarPositionClass = computed(() => {
  if (!props.position) return ''
  return 'mu-snackbar-' + props.position
})
const transitionComp = computed(() => props.position.indexOf('top') !== -1 ? SlideTopTransition : SlideBottomTransition)
</script>
