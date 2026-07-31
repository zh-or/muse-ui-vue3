<template>
  <Popover v-if="container === 'popover'" :open="open" cover lazy :trigger="trigger" @close="$emit('close')">
    <slot />
  </Popover>
  <Dialog v-else-if="container === 'dialog'" :open="open" dialogClass="mu-picker-dialog" transition="slide-top" @close="$emit('close')">
    <slot />
  </Dialog>
  <BottomSheet v-else-if="container === 'bottomSheet'" :open="open" @close="$emit('close')">
    <slot />
  </BottomSheet>
</template>

<script setup>
import { defineOptions } from 'vue'
import Popover from '../Popover'
import Dialog from '../Dialog'
import BottomSheet from '../BottomSheet'

defineOptions({ name: 'mu-date-input-container' })

defineProps({
  container: { type: String, default: 'popover' },
  trigger: {},
  open: Boolean
})

defineEmits(['close'])
</script>
