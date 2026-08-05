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
    <div class="mu-radio-wrapper">
      <div v-if="props.label && props.labelLeft" class="mu-radio-label">{{ props.label }}</div>
      <TouchRipple
        v-if="canRipple"
        ref="rippleRef"
        class="mu-radio-icon"
        ripple-wrapper-class="mu-radio-ripple-wrapper"
        :center-ripple="true"
        :color="props.rippleColor"
        :opacity="props.rippleOpacity"
      >
        <Icon v-if="props.uncheckIcon" class="mu-radio-icon-uncheck" :value="props.uncheckIcon" />
        <svg v-else class="mu-radio-icon-uncheck mu-radio-svg-icon" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        </svg>
        <Icon v-if="props.checkedIcon" class="mu-radio-icon-checked" :value="props.checkedIcon" />
        <svg v-else class="mu-radio-icon-checked mu-radio-svg-icon" viewBox="0 0 24 24">
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        </svg>
      </TouchRipple>
      <div v-else class="mu-radio-icon">
        <Icon v-if="props.uncheckIcon" class="mu-radio-icon-uncheck" :value="props.uncheckIcon" />
        <svg v-else class="mu-radio-icon-uncheck mu-radio-svg-icon" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        </svg>
        <Icon v-if="props.checkedIcon" class="mu-radio-icon-checked" :value="props.checkedIcon" />
        <svg v-else class="mu-radio-icon-checked mu-radio-svg-icon" viewBox="0 0 24 24">
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        </svg>
      </div>
      <div v-if="props.label && !props.labelLeft" class="mu-radio-label">{{ props.label }}</div>
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
import { isNull } from '../utils';

defineOptions({ name: 'mu-radio', inheritAttrs: false });

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
  modelValue: {}
});

const emit = defineEmits(['update:modelValue', 'change', 'click', 'keydown', 'mousedown', 'mouseleave', 'mouseup', 'touchstart', 'touchend', 'touchcancel', 'focus', 'blur']);

const rippleRef = ref(null);
const muFormItem = inject('muFormItem', null);
const attrs = useAttrs();
const { getNormalColorClass, getColor } = useColor(props);

const checked = computed(() => {
  const iv = props.modelValue;
  const value = attrs.value;
  if (isNull(iv)) return false;
  return iv === value;
});

const colorClass = computed(() => getNormalColorClass(props.color, true));

const canRipple = computed(() => !props.disabled && props.ripple);

const tabIndexValue = computed(() => props.disabled ? -1 : props.tabIndex ? props.tabIndex : 0);

const rootClasses = computed(() => [
  'mu-radio',
  checked.value ? colorClass.value : '',
  {
    'label-left': props.labelLeft,
    'disabled': props.disabled,
    'mu-radio-checked': checked.value,
    'no-label': !props.label
  }
]);

const rootStyle = computed(() => ({
  color: checked.value && !props.disabled ? getColor(props.color) : ''
}));

const inputAttrs = computed(() => ({
  ...attrs,
  type: 'radio',
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
  emit('update:modelValue', attrs.value);
  emit('change', attrs.value);
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
