<template>
  <div ref="trigger" :class="['mu-menu', { 'mu-menu__open': active }]">
    <div
      class="mu-menu-activator"
      @click="handleActivatorClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <slot />
    </div>
    <Popover
      :class="popoverClass"
      :style="popoverStyle"
      :cover="cover"
      :placement="placement"
      :open="active"
      :space="space"
      :trigger="trigger"
      @close="hide"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <slot name="content" />
    </Popover>
  </div>
</template>

<script setup>
import { ref, watch, computed, onBeforeUnmount } from 'vue'
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

const active = ref(props.open)
const trigger = ref(null)
let timer = null

watch(() => props.open, (val) => { active.value = val })
watch(active, (val) => { emit('update:open', val) })

const popoverStyle = computed(() => ({
  'min-width': trigger.value ? trigger.value.offsetWidth + 'px' : ''
}))

function handleMouseEnter() {
  if (!props.openOnHover) return
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => show(), 100)
}

function handleMouseLeave() {
  if (!props.openOnHover) return
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => hide(), 100)
}

function handleActivatorClick() {
  if (props.openOnHover) return
  active.value ? hide() : show()
}

function show() { active.value = true; emit('open') }
function hide() { active.value = false; emit('close') }

onBeforeUnmount(() => hide())
</script>
