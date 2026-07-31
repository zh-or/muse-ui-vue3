<template>
  <AbstractButton
    ref="rootEl"
    class="mu-tab"
    :class="tabClasses"
    :style="{ color: active ? activeColor.color : '' }"
    container-element="div"
    wrapper-class="mu-tab-wrapper"
    :disabled="disabled"
    :ripple="ripple"
    :ripple-opacity="rippleOpacity"
    :ripple-color="rippleColor"
    :to="to"
    :href="href"
    :target="target"
    :tag="tag"
    :active-class="activeClass"
    :event="event"
    :exact="exact"
    :exact-active-class="exactActiveClass"
    :append="append"
    :replace="replace"
    @click="handleClick"
  >
    <slot />
    <span v-if="title" class="mu-tab-title">{{ title }}</span>
  </AbstractButton>
</template>

<script setup>
import { ref, computed, inject, onBeforeUnmount, onMounted } from 'vue'
import { useRoute, routeProps } from '../composables/useRoute'
import { useRipple, rippleProps } from '../composables/useRipple'
import { isNotNull } from '../utils'
import AbstractButton from '../internal/AbstractButton.vue'

defineOptions({ name: 'mu-tab', inheritAttrs: false })
const emit = defineEmits(['click'])
const props = defineProps({ ...routeProps, ...rippleProps, disabled: Boolean, value: {}, title: String })

const tabClick = inject('tabClick')
const getActiveValue = inject('getActiveValue')
const getDefaultVal = inject('getDefaultVal')
const addTab = inject('addTab')
const removeTab = inject('removeTab')
const setTabHighLineStyle = inject('setTabHighLineStyle')
const getActiveColor = inject('getActiveColor')
const getTabsInverse = inject('getTabsInverse')

const { generateRouteProps } = useRoute(props)
useRipple()
const rootEl = ref(null)

const tabVal = ref(isNotNull(props.value) ? props.value : getDefaultVal())
const active = computed(() => !props.disabled && getActiveValue() === tabVal.value)
const activeColor = computed(() => getActiveColor())

const tabRef = { get root() { return rootEl.value?.$el }, get active() { return active.value } }

onMounted(() => addTab(tabRef))
onBeforeUnmount(() => removeTab(tabRef))

defineExpose({ root: rootEl })

const tabClasses = computed(() => ({
  'mu-tab-active': active.value,
  'is-inverse': active.value && getTabsInverse() && !activeColor.value.className && !activeColor.value.color,
  [activeColor.value.className]: active.value
}))

function handleClick(e) {
  tabClick(tabVal.value, tabRef)
  emit('click', e)
}
</script>
