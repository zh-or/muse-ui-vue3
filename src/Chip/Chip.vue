<script setup>
import { defineOptions } from 'vue';
import { useColor } from '../composables/useColor';
defineOptions({ name: 'mu-chip' });

const props = defineProps({
  delete: Boolean,
  selected: Boolean,
  textColor: String,
  color: String
});

const emit = defineEmits(['delete']);

const { getColorClass, getTextColorClass, getColor } = useColor(props);

const handleDelete = (e) => {
  e.stopPropagation();
  emit('delete');
};
</script>

<template>
  <span
    :class="[
      'mu-chip',
      getColorClass(),
      getTextColorClass(),
      { 'is-deletable': selected }
    ]"
    tabindex="0"
    :style="{
      color: getColor(textColor),
      backgroundColor: getColor(color)
    }"
  >
    <slot />
    <svg
      v-if="delete"
      class="mu-chip-delete-icon"
      viewBox="0 0 24 24"
      @click="handleDelete"
    >
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
    </svg>
  </span>
</template>
