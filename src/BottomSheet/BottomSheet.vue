<template>
  <BottomSheetTransition>
    <div ref="rootRef" v-if="isOpen" class="mu-bottom-sheet" :style="{ 'z-index': zIndex }">
      <slot />
    </div>
  </BottomSheetTransition>
</template>

<script setup>
import { ref } from 'vue'
import { usePopup, popupProps } from '../composables/usePopup'
import { BottomSheetTransition } from '../internal/transitions'

defineOptions({ name: 'mu-bottom-sheet' })

const props = defineProps({
  ...popupProps,
  lockScroll: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])
const rootRef = ref(null)
const { zIndex, isOpen } = usePopup(props, { emit }, rootRef)
</script>
