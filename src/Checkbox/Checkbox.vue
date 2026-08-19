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
    <div class="mu-checkbox-wrapper">
      <div v-if="props.label && props.labelLeft" class="mu-checkbox-label">{{ props.label }}</div>
      <TouchRipple
        v-if="canRipple"
        ref="rippleRef"
        class="mu-checkbox-icon"
        ripple-wrapper-class="mu-checkbox-ripple-wrapper"
        :center-ripple="true"
        :color="props.rippleColor"
        :opacity="props.rippleOpacity"
      >
        <Icon v-if="props.uncheckIcon" class="mu-checkbox-icon-uncheck" :value="props.uncheckIcon" />
        <svg v-else class="mu-checkbox-icon-uncheck mu-checkbox-svg-icon" viewBox="0 0 24 24">
          <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        </svg>
        <Icon v-if="props.checkedIcon" class="mu-checkbox-icon-checked" :value="props.checkedIcon" />
        <svg v-else class="mu-checkbox-icon-checked mu-checkbox-svg-icon" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </TouchRipple>
      <div v-else class="mu-checkbox-icon">
        <Icon v-if="props.uncheckIcon" class="mu-checkbox-icon-uncheck" :value="props.uncheckIcon" />
        <svg v-else class="mu-checkbox-icon-uncheck mu-checkbox-svg-icon" viewBox="0 0 24 24">
          <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        </svg>
        <Icon v-if="props.checkedIcon" class="mu-checkbox-icon-checked" :value="props.checkedIcon" />
        <svg v-else class="mu-checkbox-icon-checked mu-checkbox-svg-icon" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>
      <div v-if="props.label && !props.labelLeft" class="mu-checkbox-label">{{ props.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, useAttrs } from 'vue';
import { useColor } from '../composables/useColor';
import { rippleProps } from '../composables/useRipple';
import Icon from '../Icon';
import TouchRipple from '../internal/TouchRipple.vue';
import keycode from 'keycode';

defineOptions({ name: 'mu-checkbox', inheritAttrs: false });

const props = defineProps({
  label: String,
  labelLeft: Boolean,
  readonly: Boolean,
  uncheckIcon: String,
  checkedIcon: String,
  disabled: Boolean,
  tabIndex: [Number, String],
  ...rippleProps,
  color: String,
  modelValue: [Boolean, Array]
});

const emit = defineEmits(['update:modelValue', 'change', 'click', 'keydown', 'mousedown', 'mouseleave', 'mouseup', 'touchstart', 'touchend', 'touchcancel', 'focus', 'blur']);

const rippleRef = ref(null);
const muFormItem = inject('muFormItem', null);
const attrs = useAttrs();
const { getNormalColorClass, getColor } = useColor(props);

const checked = computed(() => {
  if (!props.modelValue) return false;
  const iv = props.modelValue;
  const value = attrs.value;
  if (iv instanceof Array) return iv.indexOf(value) !== -1;
  return iv;
});

const colorClass = computed(() => getNormalColorClass(props.color, true));

const canRipple = computed(() => !props.disabled && props.ripple);

const tabIndexValue = computed(() => props.disabled ? -1 : props.tabIndex ? props.tabIndex : 0);

const rootClasses = computed(() => [
  'mu-checkbox',
  checked.value ? colorClass.value : '',
  {
    'label-left': props.labelLeft,
    'disabled': props.disabled,
    'mu-checkbox-checked': checked.value,
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
  const iv = props.modelValue;
  const value = attrs.value;
  if (!iv || typeof iv === 'boolean') {
    const val = !iv;
    emit('update:modelValue', val);
    emit('change', val);
    return;
  }
  if (checked.value) {
    const val = [...iv]
    val.splice(val.indexOf(value), 1)
    emit('update:modelValue', val)
    emit('change', val)
  } else {
    const val = [...iv, value];
    emit('update:modelValue', val);
    emit('change', val);
  }
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
