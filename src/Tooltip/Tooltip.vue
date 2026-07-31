<template>
  <span ref="trigger" style="display: inline-block;" @mouseenter="show" @mouseleave="hide">
    <slot />
    <TooltipContent
      :class="tooltipClass"
      :placement="placement"
      :open="active"
      :trigger="trigger"
      @mouseenter="show"
      @mouseleave="hide"
    >
      <slot name="content">{{ content }}</slot>
    </TooltipContent>
  </span>
</template>

<script setup>
import { ref, watch, defineOptions } from 'vue'
import TooltipContent from './TooltipContent.vue'

defineOptions({ name: 'mu-tooltip' })

const props = defineProps({
  content: String,
  placement: {
    type: String,
    default: 'bottom'
  },
  open: Boolean,
  tooltipClass: [String, Object, Array]
})

const emit = defineEmits(['update:open'])
const active = ref(props.open)
const trigger = ref(null)
let timer = null

watch(active, (val) => emit('update:open', val))
watch(() => props.open, (val) => { active.value = val })

function show() {
  if (timer) clearTimeout(timer)
  active.value = true
}

function hide() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => { active.value = false }, 200)
}
</script>
