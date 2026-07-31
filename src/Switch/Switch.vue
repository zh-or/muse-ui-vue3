<template>
  <div
    :class="rootClasses"
    :tabindex="tabIndexValue"
    :style="rootStyle"
    @click="handleClick"
    @keydown="handleKeydown"
    @mousedown="start"
    @mouseleave="end"
    @mouseup="end"
    @touchstart="start"
    @touchend="end"
    @touchcancel="end"
    @focus="start"
    @blur="end"
  >
    <input v-bind="inputAttrs">
    <div class="mu-switch-wrapper">
      <div v-if="props.label && props.labelLeft" class="mu-switch-label">{{ props.label }}</div>
      <div class="mu-switch-container">
        <div class="mu-switch-track" />
        <TouchRipple
          v-if="canRipple"
          ref="rippleRef"
          class="mu-switch-thumb"
          ripple-wrapper-class="mu-switch-ripple-wrapper"
          :center-ripple="true"
          :color="props.rippleColor"
          :opacity="props.rippleOpacity"
        />
        <div v-else class="mu-switch-thumb" />
      </div>
      <div v-if="props.label && !props.labelLeft" class="mu-switch-label">{{ props.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, useAttrs } from 'vue';
import { useColor } from '../composables/useColor';
import { rippleProps } from '../composables/useRipple';
import TouchRipple from '../internal/TouchRipple.vue';
import keycode from 'keycode';

defineOptions({ name: 'mu-switch', inheritAttrs: false });

const props = defineProps({
  color: String,
  label: String,
  labelLeft: Boolean,
  readonly: Boolean,
  disabled: Boolean,
  tabIndex: [Number, String],
  ...rippleProps,
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue', 'change', 'click', 'keydown', 'mousedown', 'mouseleave', 'mouseup', 'touchstart', 'touchend', 'touchcancel', 'focus', 'blur']);

const rippleRef = ref(null);
const muFormItem = inject('muFormItem', null);
const attrs = useAttrs();
const { getNormalColorClass, getColor } = useColor(props);

const checked = computed(() => props.modelValue);

const colorClass = computed(() => getNormalColorClass(props.color, true));

const canRipple = computed(() => !props.disabled && props.ripple);

const tabIndexValue = computed(() => props.disabled ? -1 : props.tabIndex ? props.tabIndex : 0);

const rootClasses = computed(() => [
  'mu-switch',
  checked.value ? colorClass.value : '',
  {
    'label-left': props.labelLeft,
    'disabled': props.disabled,
    'mu-switch-checked': checked.value,
    'no-label': !props.label
  }
]);

const rootStyle = computed(() => ({
  color: checked.value && !props.disabled ? getColor(props.color) : ''
}));

const inputAttrs = computed(() => ({
  ...attrs,
  type: 'checkbox',
  disabled: props.disabled,
  checked: checked.value,
  readonly: props.readonly,
  tabindex: -1
}));

function start(event) {
  if (props.disabled) return;
  if (props.ripple && (event.type !== 'mousedown' || event.button === 0)) {
    rippleRef.value?.start(event);
  }
  emit(event.type, event);
}

function end(event) {
  if (props.disabled) return;
  if (props.ripple) rippleRef.value?.end();
  if (event) emit(event.type, event);
}

function toggle() {
  const val = !props.modelValue;
  emit('update:modelValue', val);
  emit('change', val);
}

function handleClick(e) {
  if (props.disabled || props.readonly) return;
  end();
  toggle();
  if (muFormItem) muFormItem.onBlur();
  emit('click', e);
}

function handleKeydown(e) {
  if (props.disabled) return;
  end(e);
  if (keycode(e) === 'enter' && !props.readonly) handleClick(e);
}
</script>
