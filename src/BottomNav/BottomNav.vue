<template>
  <AbstractButton
    :class="navClass"
    :style="navStyle"
    :ripple="shift"
    wrapper-class="mu-bottom-nav-shift-wrapper"
    container-element="div"
    :ripple-opacity="0.3"
  >
    <slot />
  </AbstractButton>
</template>

<script setup>
import { ref, watch, provide, computed } from 'vue'
import { useColor } from '../composables/useColor'
import AbstractButton from '../internal/AbstractButton.vue'

defineOptions({ name: 'mu-bottom-nav' })

const props = defineProps({
  color: String,
  shift: Boolean,
  modelValue: {}
})

const emit = defineEmits(['update:modelValue', 'change'])

const { getColorClass, getNormalColorClass, getColor } = useColor(props)
const activeValue = ref(props.modelValue || 0)
let index = 0

provide('getBottomNavValue', () => activeValue.value)
provide('getBottomNavShift', () => props.shift)
provide('bottomNavItemClick', (value) => { activeValue.value = value })
provide('getDefaultVal', () => index++)
provide('getActiveColor', () => ({
  className: getNormalColorClass(props.color, true),
  color: getColor(props.color)
}))

watch(() => props.modelValue, (val) => {
  activeValue.value = val
})

watch(activeValue, (val) => {
  if (val === props.modelValue) return
  emit('update:modelValue', val)
  emit('change', val)
})

const navClass = computed(() => ({
  'mu-bottom-nav': true,
  'mu-bottom-nav-shift': props.shift,
  [getColorClass(false)]: props.shift
}))

const navStyle = computed(() => ({
  'background-color': props.shift ? getColor(props.color) : ''
}))
</script>
