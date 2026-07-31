<template>
  <div class="mu-text-field-multiline">
    <textarea class="mu-text-field-textarea-hide mu-text-field-input" ref="textareaHidden" rows="1" :value="value || ' '" />
    <textarea class="mu-text-field-input mu-text-field-textarea" ref="textarea" tabindex="0" v-bind="$attrs" :disabled="disabled" :value="value || ''" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, useAttrs } from 'vue';

defineOptions({ name: 'mu-textarea', inheritAttrs: false });

const props = defineProps({
  disabled: Boolean,
  rows: {
    type: Number,
    default: 1
  },
  rowsMax: {
    type: Number
  },
  value: {
    type: String,
    default: ''
  }
});

useAttrs();

const textarea = ref(null);
const textareaHidden = ref(null);

defineExpose({ textarea });

function resizeTextarea() {
  const element = textarea.value;
  if (!element) return;
  const hiddenEl = textareaHidden.value;
  let lineHeight = window.getComputedStyle(element, null).getPropertyValue('line-height');
  lineHeight = Number(lineHeight.substring(0, lineHeight.indexOf('px')));
  let pt = window.getComputedStyle(element, null).getPropertyValue('padding-top');
  pt = Number(pt.substring(0, pt.indexOf('px')));
  let pd = window.getComputedStyle(element, null).getPropertyValue('padding-bottom');
  pd = Number(pd.substring(0, pd.indexOf('px')));
  const minHeight = pd + pt + lineHeight * props.rows;
  const maxHeight = pd + pt + lineHeight * (props.rowsMax || props.rows);
  const height = hiddenEl.scrollHeight;
  element.style.height = (height < minHeight ? minHeight : height > maxHeight && maxHeight > 0 ? maxHeight : height) + 'px';
}

onMounted(() => {
  resizeTextarea();
});

watch(() => props.value, () => {
  nextTick(() => {
    resizeTextarea();
  });
});
</script>
