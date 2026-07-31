<template>
  <AbstractButton
    :class="['mu-button', buttonClass, colorClass, textColorClass]"
    :style="buttonStyle"
    wrapperClass="mu-button-wrapper"
    :disabled="disabled"
    :keyboardFocused="keyboardFocused"
    :type="type"
    :centerRipple="icon"
    :ripple="ripple"
    :rippleOpacity="rippleOpacity"
    :rippleColor="rippleColor"
    :href="href"
    :target="target"
    :to="to"
    :tag="tag"
    :activeClass="activeClass"
    :event="event"
    :exact="exact"
    :exactActiveClass="exactActiveClass"
    :append="append"
    :replace="replace"
    @click="handleClick"
    @keydown="handleKeyboardFocus"
    @hover="handleHover"
    @hover-exit="handleHoverExit"
  >
    <slot />
  </AbstractButton>
</template>

<script setup>
import { computed, defineOptions } from 'vue';
defineOptions({ name: 'mu-button' });
import { useRoute, routeProps } from '../composables/useRoute';
import { useRipple, rippleProps } from '../composables/useRipple';
import { useButton, buttonProps } from '../composables/useButton';
import { useColor } from '../composables/useColor';
import AbstractButton from '../internal/AbstractButton';

const props = defineProps({
  ...routeProps,
  ...rippleProps,
  ...buttonProps,
  color: String,
  fab: Boolean,
  flat: Boolean,
  icon: Boolean,
  small: Boolean,
  large: Boolean,
  round: Boolean,
  textColor: String,
  fullWidth: Boolean
});

const emit = defineEmits(['click', 'hover', 'hover-exit', 'keyboard-focus']);

const { generateRouteProps } = useRoute(props);
useRipple();
const { handleClick, handleKeyboardFocus, handleHover, handleHoverExit } = useButton(props, { emit });
const { getNormalColorClass, getTextColorClass, getColor } = useColor(props);

const colorClass = computed(() => getNormalColorClass(props.color, props.icon || props.flat))
const textColorClass = computed(() => getTextColorClass())

const buttonClass = computed(() => ({
  'mu-fab-button': props.fab,
  'mu-flat-button': props.flat,
  'mu-icon-button': props.icon,
  'mu-raised-button': !props.icon && !props.flat && !props.fab,
  'mu-button-small': props.small,
  'mu-button-large': props.large,
  'mu-button-full-width': !props.fab && !props.icon && props.fullWidth,
  'mu-button-round': props.round,
  'is-focus': props.keyboardFocused
}))

const buttonStyle = computed(() => {
  const flat = props.flat || props.icon;
  let color = getColor(props.textColor);
  if (!color && flat) color = getColor(props.color);
  return {
    'background-color': !flat ? getColor(props.color) : '',
    color
  };
});
</script>
