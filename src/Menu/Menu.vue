<template>
  <div
    ref="trigger"
    class="mu-menu"
    :class="{ 'mu-menu__open': open }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="mu-menu-activator" @click="handleActivatorClick">
      <slot />
    </div>
    <Popover
      :class="popoverClass"
      :style="popoverStyle"
      :cover="cover"
      :placement="placement"
      :open="open"
      :space="space"
      :trigger="trigger"
      @close="handleClose"
    >
      <slot name="content" />
    </Popover>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import Popover from '../Popover'

defineOptions({ name: 'mu-menu' })
const emit = defineEmits(['update:open', 'open', 'close'])
const props = defineProps({
  popoverClass: [String, Object, Array],
  cover: Boolean,
  placement: String,
  space: Number,
  open: Boolean,
  openOnHover: Boolean
})

const trigger = ref(null)
let timer = null

const popoverStyle = computed(() => ({
  'min-width': trigger.value ? trigger.value.offsetWidth + 'px' : ''
}))

function setOpen(val) {
  if (props.open === val) return
  emit('update:open', val)
  emit(val ? 'open' : 'close')
}

function handleActivatorClick(event) {
  if (props.openOnHover) return
  const target = event.target
  if (target && target.closest && target.closest('button, a[href], input, select, textarea, [role="button"], .mu-button')) return
  setOpen(!props.open)
}

function handleMouseEnter() {
  if (!props.openOnHover) return
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => setOpen(true), 100)
}

function handleMouseLeave() {
  if (!props.openOnHover) return
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => setOpen(false), 100)
}

function handleClose() {
  setOpen(false)
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>
