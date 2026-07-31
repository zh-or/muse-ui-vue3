<template>
  <div class="mu-input" :class="[colorClass, inputClass]" :style="{ color: colorStyle }">
    <Icon v-if="icon" class="mu-input-icon" :value="icon" />
    <div v-if="label && !solo" class="mu-input-label" :class="{ float }">{{ label }}</div>
    <div class="mu-text-field mu-input-content">
      <slot name="prepend" />
      <span v-if="prefix && !float" class="mu-input-prefix-text">{{ prefix }}</span>
      <Textarea
        v-if="multiLine"
        ref="textareaRef"
        v-bind="$attrs"
        :maxlength="maxLength"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        :rows-max="rowsMax"
        :value="String(modelValue || '')"
        @input="(e) => emit('update:modelValue', e.target.value, e)"
        @change="(e) => emit('change', e.target.value, e)"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <input
        v-else
        ref="inputRef"
        class="mu-text-field-input"
        tabindex="0"
        v-bind="$attrs"
        :maxlength="maxLength"
        :disabled="disabled"
        :placeholder="placeholder"
        :value="modelValue"
        @input="(e) => emit('update:modelValue', e.target.value, e)"
        @change="(e) => emit('change', e.target.value, e)"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <slot />
      <span v-if="suffix && !float" class="mu-input-suffix-text">{{ suffix }}</span>
      <Icon v-if="actionIcon" class="mu-input-action-icon" :value="actionIcon" @click="() => !disabled && actionClick && actionClick()" />
      <slot name="append" />
      <div v-if="!solo">
        <div class="mu-input-line" :class="{ disabled }" />
        <div v-if="!disabled" class="mu-input-focus-line" :class="[underlineColorClass, { focus: isFocused }]" :style="{ 'background-color': underlineColorStyle }" />
      </div>
      <div v-if="errorText || helpText || maxLength" class="mu-input-help">
        <div>{{ errorText || helpText || '' }}</div>
        <div v-if="maxLength">{{ (modelValue ? String(modelValue).length : 0) }} / {{ maxLength }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '../styles/components/input.less';
import { ref, computed, inject, watch, useAttrs } from 'vue';
import { useColor } from '../composables/useColor';
import Textarea from './Textarea.vue';
import Icon from '../Icon';

defineOptions({ name: 'mu-text-field', inheritAttrs: false });

const props = defineProps({
  icon: String,
  label: String,
  labelFloat: Boolean,
  actionIcon: String,
  actionClick: Function,
  suffix: String,
  prefix: String,
  errorText: String,
  helpText: String,
  fullWidth: Boolean,
  disabled: Boolean,
  solo: Boolean,
  underlineColor: String,
  modelValue: {},
  rows: {
    type: Number,
    default: 1
  },
  rowsMax: {
    type: Number
  },
  multiLine: Boolean,
  maxLength: [String, Number],
  color: String
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'change']);

const attrs = useAttrs();
const { getNormalColorClass, getColor } = useColor(props);
const muFormItem = inject('muFormItem', null);

const isFocused = ref(false);
const inputRef = ref(null);
const textareaRef = ref(null);

const error = computed(() => !!props.errorText || (muFormItem && muFormItem.errorMessage));

const inputClass = computed(() => ({
  'mu-input__focus': isFocused.value,
  'has-label': props.label,
  'no-empty-state': props.modelValue,
  'has-icon': props.icon,
  'mu-input__error': error.value,
  'multi-line': props.multiLine,
  'disabled': props.disabled,
  'full-width': props.fullWidth,
  'is-solo': props.solo
}));

const float = computed(() =>
  props.labelFloat && !isFocused.value && !props.modelValue && props.modelValue !== 0
);

const isFocus = computed(() => !props.disabled && !props.errorText && isFocused.value);
const colorClass = computed(() => isFocus.value ? getNormalColorClass(props.color, true) : '');
const colorStyle = computed(() => isFocus.value ? getColor(props.color) : '');

const underlineColorClass = computed(() => getNormalColorClass(props.underlineColor, false, false));
const underlineColorStyle = computed(() => getColor(props.underlineColor));

const placeholder = computed(() => !props.labelFloat ? attrs.placeholder : '');

watch(isFocused, (val) => {
  if (!muFormItem) return;
  val ? muFormItem.onFocus() : muFormItem.onBlur();
});

function handleFocus(e) {
  isFocused.value = true;
  emit('focus', e);
}

function handleBlur(e) {
  isFocused.value = false;
  emit('blur', e);
}

function focus() {
  if (props.disabled) return;
  if (inputRef.value) {
    inputRef.value.focus();
  } else if (textareaRef.value) {
    textareaRef.value.textarea.focus();
  }
}

defineExpose({ focus });
</script>
