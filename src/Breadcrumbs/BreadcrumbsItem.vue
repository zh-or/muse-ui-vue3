<template>
  <li :class="['mu-breadcrumbs-item', { 'is-disabled': disabled }]">
    <component :is="tagName" v-bind="routeAttrs">
      <slot />
    </component>
  </li>
</template>

<script setup>
import { computed, defineOptions } from 'vue'
import { useRoute, routeProps } from '../composables/useRoute'

const props = defineProps({
  ...routeProps,
  disabled: Boolean
})

defineOptions({ name: 'mu-breadcrumbs-item' })

const { generateRouteProps } = useRoute(props)

const tagName = computed(() => props.to ? 'router-link' : 'a')
const routeAttrs = computed(() => props.to ? generateRouteProps() : { href: props.href })
</script>
