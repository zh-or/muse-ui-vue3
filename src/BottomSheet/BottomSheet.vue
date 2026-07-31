<template>
  <BottomSheetTransition>
    <div v-if="open" class="mu-bottom-sheet" :style="{ 'z-index': zIndex }">
      <slot />
    </div>
  </BottomSheetTransition>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
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

const emit = defineEmits(['update:open'])
const instance = getCurrentInstance()
const { zIndex } = usePopup(props, { emit }, instance.proxy)
</script>
