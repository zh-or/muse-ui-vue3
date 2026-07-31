<template>
  <div class="mu-slide-picker">
    <PickerSlot
      v-for="(slot, index) in slots"
      :key="'picker-slot-item-' + index"
      :divider="slot.divider"
      :content="slot.content"
      :textAlign="slot.textAlign"
      :width="slot.width"
      :value="values[index]"
      :values="slot.values"
      :visibleItemCount="visibleItemCount"
      @change="(value) => change(index, value)"
    />
    <div class="mu-slide-picker-center-highlight"></div>
  </div>
</template>

<script setup>
import { defineOptions } from 'vue'
import PickerSlot from './PickerSlot'

defineOptions({ name: 'mu-slide-picker' })

const props = defineProps({
  visibleItemCount: {
    type: Number,
    default: 5
  },
  values: {
    type: Array,
    default() {
      return []
    }
  },
  slots: {
    type: Array,
    default() {
      return []
    }
  }
})

const emit = defineEmits(['change'])

function change(index, value) {
  emit('change', value, index)
}
</script>
