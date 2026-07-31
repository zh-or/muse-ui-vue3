<template>
  <AbstractButton
    :class="itemClass"
    :style="itemStyle"
    :ripple="computedRipple"
    container-element="div"
    wrapper-class="mu-bottom-item-wrapper"
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
    <Icon v-if="icon" class="mu-bottom-item-icon" :value="icon" />
    <span v-if="title" class="mu-bottom-item-text">{{ title }}</span>
  </AbstractButton>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue'
import AbstractButton from '../internal/AbstractButton.vue'
import Icon from '../Icon/Icon.vue'
import { useRoute, routeProps } from '../composables/useRoute'
import { rippleProps } from '../composables/useRipple'
import { isNotNull } from '../utils'

defineOptions({ name: 'mu-bottom-nav-item' })

const props = defineProps({
  ...routeProps,
  ...rippleProps,
  icon: String,
  title: String,
  value: {}
})

const { generateRouteProps } = useRoute(props)

const getBottomNavValue = inject('getBottomNavValue')
const getBottomNavShift = inject('getBottomNavShift')
const getDefaultVal = inject('getDefaultVal')
const bottomNavItemClick = inject('bottomNavItemClick')
const getActiveColor = inject('getActiveColor')

const itemVal = ref(isNotNull(props.value) ? props.value : getDefaultVal())

watch(() => props.value, (val) => {
  itemVal.value = val
})

const active = computed(() => getBottomNavValue() === itemVal.value)
const activeClassName = computed(() => getActiveColor().className)
const activeColor = computed(() => getActiveColor().color)
const shift = computed(() => getBottomNavShift())
const computedRipple = computed(() => !shift.value && props.ripple)

const itemClass = computed(() => ['mu-bottom-item', {
  'mu-bottom-item-active': active.value,
  'is-shift': active.value && shift.value,
  [activeClassName.value]: !shift.value && active.value
}])

const itemStyle = computed(() => ({
  color: !shift.value && active.value ? activeColor.value : ''
}))

function handleClick() {
  bottomNavItemClick(itemVal.value)
}
</script>
