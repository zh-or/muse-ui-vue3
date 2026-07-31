<template>
  <div :class="['mu-pagination', { 'mu-pagination__raised': raised, 'mu-pagination__circle': circle }]">
    <Button class="mu-pagination-btn" flat :disabled="modelValue <= 1" @click="changePage(modelValue - 1)">
      <svg class="mu-pagination-svg-icon" viewBox="0 0 24 24">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </Button>
    <ul>
      <li v-for="item in items" :key="item.value">
        <Button :class="['mu-pagination-item', { 'is-current': modelValue === item.value }]" flat @click="changePage(item.value)">
          <template v-if="item.text === '...'">
            <svg class="mu-pagination-svg-icon" viewBox="0 0 24 24">
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </template>
          <template v-else>{{ item.text }}</template>
        </Button>
      </li>
    </ul>
    <Button class="mu-pagination-btn" flat :disabled="modelValue >= totalPage" @click="changePage(modelValue + 1)">
      <svg class="mu-pagination-svg-icon" viewBox="0 0 24 24">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
    </Button>
  </div>
</template>

<script setup>
import { computed, defineOptions } from 'vue'
import Button from '../Button'

defineOptions({ name: 'mu-pagination' })

const props = defineProps({
  total: { type: Number, default: 0, validator: (v) => v >= 0 },
  modelValue: { type: Number, default: 1, validator: (v) => v >= 1 },
  pageCount: { type: Number, default: 7, validator: (v) => v >= 5 && v <= 21 && v % 2 !== 0 },
  pageSize: { type: Number, default: 10 },
  raised: Boolean, circle: Boolean
})

const emit = defineEmits(['update:modelValue', 'change'])

const showPageCount = computed(() => props.pageCount - 2)
const totalPage = computed(() => Math.ceil(props.total / props.pageSize))

const items = computed(() => {
  if (props.total === 0) return []
  const spc = showPageCount.value
  const arr = []
  const start = 1
  const end = totalPage.value

  if (end <= spc + 2) {
    for (let i = start; i <= end; i++) arr.push({ text: i, value: i })
    return arr
  }

  arr.push({ text: start, value: start })
  if (props.modelValue - start >= spc - 1) {
    const go = props.modelValue - spc
    arr.push({ text: '...', value: go < 1 ? 1 : go })
  }

  let listStart = props.modelValue - Math.floor(spc / 2)
  if (listStart <= 1) listStart = 2
  let listEnd = listStart + spc - 1
  if (listEnd >= end) listEnd = end - 1
  listStart = listEnd - spc + 1

  for (let i = listStart; i <= listEnd; i++) arr.push({ text: i, value: i })

  if (end - props.modelValue >= spc - 1) {
    const go = props.modelValue + spc
    arr.push({ text: '...', value: go > end ? end : go })
  }
  arr.push({ text: end, value: end })
  return arr
})

function changePage(page) { emit('update:modelValue', page); emit('change', page) }
</script>
