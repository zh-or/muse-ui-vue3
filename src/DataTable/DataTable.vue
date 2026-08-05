<template>
  <div ref="rootRef" :class="['mu-table', { 'mu-table-border': border, 'mu-table-flex': maxHeight || height }]" :style="{ maxHeight: computeWidth(maxHeight), height: computeWidth(height) }">
    <div style="display: contents">
      <div v-if="!hideHeader" ref="headerRef" class="mu-table-header-wrapper" v-mousewheel="handleHeaderFooterMousewheel">
        <table class="mu-table-header" :style="{ width: tableWidth }">
          <colgroup>
            <col v-for="(colWidth, i) in cols" :key="i" :width="colWidth" />
          </colgroup>
          <thead>
            <slot v-if="$slots.header" name="header" :columns="columns" />
            <tr v-else>
              <th v-if="checkbox" class="mu-checkbox-col">
                <Checkbox :model-value="isSelectAll" :disabled="!(selectable && selectAll)" @change="toggleSelectAll" />
              </th>
              <th
                v-for="column in columns"
                :key="column.name"
                :class="getThClasses(column)"
                @click="column.sortable && handleSortChange(column)"
              >
                <Tooltip v-if="column.tooltip" :content="column.tooltip">
                  <template v-if="$slots.th">
                    <slot name="th" v-bind="column" />
                  </template>
                  <template v-else>
                    <svg v-if="column.sortable" class="mu-table-sort-icon" viewBox="0 0 24 24">
                      <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
                    </svg>
                    {{ column.title }}
                  </template>
                </Tooltip>
                <template v-else>
                  <template v-if="$slots.th">
                    <slot name="th" v-bind="column" />
                  </template>
                  <template v-else>
                    <svg v-if="column.sortable" class="mu-table-sort-icon" viewBox="0 0 24 24">
                      <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
                    </svg>
                    {{ column.title }}
                  </template>
                </template>
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <FadeTransition>
        <LinearProgress v-if="loading" class="mu-table-progress" :style="{ top: headerHeight }" />
      </FadeTransition>

      <div v-if="data && data.length > 0" ref="bodyRef" class="mu-table-body-wrapper" @scroll="handleScroll">
        <table class="mu-table-body" :style="{ width: tableWidth }">
          <colgroup>
            <col v-for="(colWidth, i) in cols" :key="i" :width="colWidth" />
          </colgroup>
          <tbody>
            <template v-for="(row, index) in data" :key="row[rowKey]">
              <tr
                :class="getRowClasses(index, row)"
                :style="getRowStyle(index, row)"
                @mouseenter="handleRowMouseEnter(index, row, $event)"
                @mouseleave="handleRowMouseLeave(index, row, $event)"
                @contextmenu="handleRowContextMenu(index, row, $event)"
                @click="handleRowClick(index, row, $event)"
                @dblclick="(e) => emit('row-dblclick', index, row, e)"
              >
                <td v-if="checkbox" class="mu-checkbox-col">
                  <Checkbox :model-value="isSelected(index)" :disabled="!selectable" @change="toggleSelect(index)" @click.stop />
                </td>
                <template v-if="$slots.default">
                  <slot :row="row" :$index="index" />
                </template>
                <template v-else>
                  <td
                    v-for="column in columns"
                    :key="column.name"
                    :class="[column.align || column.cellAlign ? 'is-' + (column.cellAlign || column.align) : '']"
                  >
                    {{ column.formatter ? column.formatter(row[column.name], row) : row[column.name] }}
                  </td>
                </template>
              </tr>
              <tr v-if="$slots.expand" class="mu-table-expand-row">
                <td
                  :colspan="columns.length + (checkbox ? 1 : 0)"
                  :class="{ 'is-expand': expandIndex === index }"
                >
                  <ExpandTransition>
                    <div v-if="expandIndex === index" class="mu-table-expand-content">
                      <slot name="expand" :row="row" :$index="index" />
                    </div>
                  </ExpandTransition>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div v-else>
        <slot v-if="$slots.empty" name="empty" />
        <div v-else class="mu-table-empty">{{ noDataText }}</div>
      </div>

      <div v-if="$slots.footer" ref="footerRef" class="mu-table-footer-wrapper">
        <table class="mu-table-footer" :style="{ width: tableWidth }">
          <colgroup>
            <col v-for="(colWidth, i) in cols" :key="i" :width="colWidth" />
          </colgroup>
          <tbody>
            <slot name="footer" :columns="columns" />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import mousewheel from '../internal/directives/mousewheel'
export default { directives: { mousewheel } }
</script>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Checkbox from '../Checkbox'
import Tooltip from '../Tooltip'
import { ExpandTransition, FadeTransition } from '../internal/transitions'
import { LinearProgress } from '../Progress'
import { addResizeListener, removeResizeListener } from '../utils/resize-event'
import { getWidth } from '../utils'

defineOptions({ name: 'mu-data-table' })

const props = defineProps({
  data: Array, columns: Array,
  noDataText: { type: String, default: '暂无数据' },
  height: [String, Number], maxHeight: [String, Number],
  selectAll: Boolean, selectable: Boolean,
  selects: { type: Array, default: () => [] },
  sort: { type: Object }, checkbox: Boolean, stripe: Boolean,
  border: Boolean, loading: Boolean, hideHeader: Boolean,
  rowClassName: [String, Function], rowStyle: [Object, Function],
  rowKey: { type: String, default: 'id' },
  fit: { type: Boolean, default: true }, hover: { type: Boolean, default: true },
  minColWidth: { type: Number, default: 128 },
  checkboxColWidth: { type: Number, default: 75 },
  expandRowIndex: { type: Number, default: -1 },
  autoExpand: { type: Boolean, default: true }
})

const emit = defineEmits([
  'update:selects', 'update:sort', 'update:expandRowIndex',
  'select-change', 'sort-change', 'change-expand',
  'row-click', 'row-dblclick', 'row-mouseenter', 'row-mouseleave', 'row-contextmenu'
])

const isSelectAll = ref(false)
const expandIndex = ref(props.expandRowIndex)
const hoverIndex = ref(-1)
const cols = ref([])
const tableWidth = ref('')

const headerRef = ref(null)
const bodyRef = ref(null)
const footerRef = ref(null)
const rootRef = ref(null)

onMounted(() => {
  if (props.fit) {
    if (rootRef.value) addResizeListener(rootRef.value, setCols)
  }
  setCols()
})

onBeforeUnmount(() => {
  if (rootRef.value) removeResizeListener(rootRef.value, setCols)
})

watch(() => props.selects, (val) => {
  isSelectAll.value = val && val.length >= (props.data ? props.data.length : 0)
})

watch(() => props.expandRowIndex, (val) => {
  if (expandIndex.value === val) return
  expandIndex.value = val
})

watch(expandIndex, (val) => {
  emit('update:expandRowIndex', val)
  emit('change-expand', val)
})

watch(() => props.columns, () => {
  setCols()
})

function setCols() {
  const el = rootRef.value
  let tableElWidth = el ? el.offsetWidth - (props.border ? 2 : 0) : 0
  const widthArr = (props.columns || []).filter((column) => column.width).map((column) => Number(column.width))
  widthArr.forEach((width) => (tableElWidth -= width))
  if (props.checkbox) tableElWidth -= props.checkboxColWidth

  const columnCount = props.columns ? props.columns.length : 0
  let otherWidth = Math.floor(tableElWidth / (columnCount - widthArr.length)) || props.minColWidth
  if (otherWidth < props.minColWidth) otherWidth = props.minColWidth
  cols.value = (props.columns || []).map((column) => {
    return column.width ? column.width : props.fit ? otherWidth : props.minColWidth
  })
  if (props.checkbox) cols.value.unshift(props.checkboxColWidth)
  let totalWidth = 0
  cols.value.forEach((width) => (totalWidth += Number(width)))
  tableWidth.value = totalWidth + 'px'
}

function toggleSelectAll(val) {
  isSelectAll.value = val
  const selected = []
  if (isSelectAll.value && props.data) {
    let i = 0
    while (i < props.data.length) {
      selected.push(i++)
    }
  }
  emit('update:selects', selected)
}

function handleSortChange(column) {
  const sort = { ...props.sort }
  if (props.sort && props.sort.name === column.name) {
    sort.order = sort.order === 'desc' ? 'asc' : 'desc'
  } else {
    sort.name = column.name
    sort.order = 'desc'
  }
  emit('update:sort', sort)
  emit('sort-change', sort)
}

function handleScroll(e) {
  const scrollLeft = e.target.scrollLeft
  if (headerRef.value) headerRef.value.scrollLeft = scrollLeft
  if (footerRef.value) footerRef.value.scrollLeft = scrollLeft
}

function isSelected(index) {
  return props.selects.indexOf(index) !== -1
}

function toggleSelect(index) {
  if (!props.selectable) return
  const selected = [...props.selects]
  const selectIndex = selected.indexOf(index)
  if (selectIndex !== -1) {
    selected.splice(selectIndex, 1)
  } else {
    selected.push(index)
  }
  selected.sort((a, b) => a - b)
  emit('update:selects', selected)
  emit('select-change', index, selected)
}

function toggleExpand(index) {
  expandIndex.value = expandIndex.value === index ? -1 : index
}

function getThClasses(column) {
  return [
    column.align ? `is-${column.align}` : '',
    column.class || '',
    column.sortable ? 'is-sortable' : '',
    column.sortable && props.sort && props.sort.name === column.name ? 'is-sorting' : '',
    column.sortable && props.sort && props.sort.name === column.name && props.sort.order === 'asc' ? 'sort-asc' : ''
  ].filter(Boolean).join(' ')
}

function getRowClasses(index, row) {
  const className = typeof props.rowClassName === 'function' ? props.rowClassName(index, row) : props.rowClassName
  return [
    className,
    { 'is-hover': props.hover && hoverIndex.value === index },
    { 'is-stripe': props.stripe && index % 2 !== 0 },
    { 'is-selected': isSelected(index) }
  ]
}

function getRowStyle(index, row) {
  return typeof props.rowStyle === 'function' ? props.rowStyle(index, row) : props.rowStyle
}

function handleRowMouseEnter(index, row, e) {
  hoverIndex.value = index
  emit('row-mouseenter', index, row, e)
}

function handleRowMouseLeave(index, row, e) {
  hoverIndex.value = -1
  emit('row-mouseleave', index, row, e)
}

function handleRowContextMenu(index, row, e) {
  emit('row-contextmenu', index, row, e)
}

function handleRowClick(index, row, e) {
  if (!props.checkbox) toggleSelect(index)
  if (props.autoExpand) toggleExpand(index)
  emit('row-click', index, row, e)
}

function computeWidth(w) {
  return getWidth(w)
}

const headerHeight = computed(() => {
  return headerRef.value ? headerRef.value.offsetHeight + 'px' : ''
})

function handleHeaderFooterMousewheel(event, data) {
  const { pixelX, pixelY } = data
  if (Math.abs(pixelX) >= Math.abs(pixelY)) {
    event.preventDefault()
    if (!bodyRef.value) return
    bodyRef.value.scrollLeft += data.pixelX / 5
  }
}
</script>
