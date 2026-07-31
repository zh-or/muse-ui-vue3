<script setup>
import { Transition, defineOptions } from 'vue';
defineOptions({ name: 'mu-alert' });
import { useColor } from '../composables/useColor';
import Button from '../Button';

const props = defineProps({
  delete: Boolean,
  transition: String,
  mode: String,
  color: String
});

const emit = defineEmits(['delete']);

const { getColorClass, getColor } = useColor(props);

const handleDelete = (e) => {
  e.stopPropagation();
  emit('delete');
};
</script>

<template>
  <Transition v-if="transition" :name="transition" :mode="mode">
    <div
      :class="`mu-alert ${getColorClass()}`"
      :style="{ 'background-color': getColor(color) }"
    >
      <slot />
      <Button
        v-if="delete"
        class="mu-alert-delete-btn"
        icon
        @click="handleDelete"
      >
        <svg class="mu-alert-delete-icon" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </Button>
    </div>
  </Transition>
  <div
    v-else
    :class="`mu-alert ${getColorClass()}`"
    :style="{ 'background-color': getColor(color) }"
  >
    <slot />
    <Button
      v-if="delete"
      class="mu-alert-delete-btn"
      icon
      @click="handleDelete"
    >
      <svg class="mu-alert-delete-icon" viewBox="0 0 24 24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    </Button>
  </div>
</template>
