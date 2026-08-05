<template>
  <Popover v-if="container === 'popover'" :open="open" cover lazy :trigger="trigger" @close="$emit('close')">
    <slot />
  </Popover>
  <Dialog v-else-if="container === 'dialog'" v-model="model" dialogClass="mu-picker-dialog" transition="slide-top">
    <slot />
  </Dialog>
  <BottomSheet v-else-if="container === 'bottomSheet'" v-model="model">
    <slot />
  </BottomSheet>
</template>

<script setup>
import { computed, defineOptions } from 'vue'
import Popover from '../Popover'
import Dialog from '../Dialog'
import BottomSheet from '../BottomSheet'

defineOptions({ name: 'mu-date-input-container' })

const props = defineProps({
  container: { type: String, default: 'popover' },
  trigger: {},
  open: Boolean
})

const emit = defineEmits(['close'])

const model = computed({
  get: () => props.open,
  set: (val) => {
    if (!val) emit('close')
  }
})
</script>
