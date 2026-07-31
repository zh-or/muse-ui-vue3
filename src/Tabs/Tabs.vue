<template>
  <div
    :class="tabsClass"
    :style="tabsStyle"
    v-resize="setTabHighLineStyle"
  >
    <slot />
    <span
      ref="lineRef"
      :class="['mu-tab-link-highlight', indicatorColorClass]"
      :style="{ 'background-color': indicatorColor }"
    />
  </div>
</template>

<script>
import resize from '../internal/directives/resize'
export default { directives: { resize } }
</script>

<script setup>
import { ref, computed, reactive, onMounted, onUpdated, watch, provide, defineOptions } from 'vue'
import { isNotNull } from '../utils'
import { useColor } from '../composables/useColor'
import translateUtils from '../utils/translate'

defineOptions({ name: 'mu-tabs', inheritAttrs: false })

const emit = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
  inverse: Boolean, indicatorColor: String, fullWidth: Boolean, center: Boolean, modelValue: {}, color: String
})

const { getNormalColorClass, getColorClass, getColor } = useColor(props)
const tabs = reactive([])
const tabIndexCounter = ref(0)
const activeValue = ref(isNotNull(props.modelValue) ? props.modelValue : 0)
const lineRef = ref(null)

provide('tabClick', handleTabClick)
provide('getActiveValue', getActiveValue)
provide('getDefaultVal', getDefaultVal)
provide('addTab', addTab)
provide('removeTab', removeTab)
provide('setTabHighLineStyle', setTabHighLineStyle)
provide('getActiveColor', getActiveColor)
provide('getTabsInverse', getInverse)

function handleTabClick(value, tab) {
  if (activeValue.value !== value) {
    activeValue.value = value
    emit('update:modelValue', value)
    emit('change', value)
  }
}

function getActiveValue() { return activeValue.value }
function getDefaultVal() { return tabIndexCounter.value++ }
function getActiveColor() {
  return props.inverse
    ? { className: getNormalColorClass(props.color, true), color: getColor(props.color) }
    : { className: '', color: '' }
}
function getInverse() { return props.inverse }

function addTab(tab) {
  const index = tabs.indexOf(tab)
  return index === -1 ? tabs.push(tab) : tabs.splice(index, 0, tab)
}
function removeTab(tab) {
  const index = tabs.indexOf(tab)
  if (index === -1) return
  tabs.splice(index, 1)
}

function getActiveTab() { return tabs.filter(tab => tab.active)[0] }

function setTabHighLineStyle() {
  const activeTab = getActiveTab()
  if (!activeTab || !lineRef.value || !activeTab.root) return
  const el = activeTab.root
  const lineEl = lineRef.value
  const rect = el.getBoundingClientRect()
  const tabsRect = lineEl.parentElement.getBoundingClientRect()
  lineEl.style.width = rect.width + 'px'
  translateUtils.translateElement(lineEl, rect.left - tabsRect.left, 0)
}

onMounted(() => setTabHighLineStyle())
onUpdated(() => setTabHighLineStyle())
watch(() => props.modelValue, (val) => { activeValue.value = val })
watch(activeValue, () => { setTabHighLineStyle() })

const tabsClass = computed(() => [
  `mu-tabs ${!props.inverse ? getColorClass(false) : ''}`,
  { 'mu-tabs-full-width': props.fullWidth, 'mu-tabs-center': props.center, 'mu-tabs-inverse': props.inverse }
])

const tabsStyle = computed(() => ({
  'background-color': !props.inverse ? getColor(props.color) : ''
}))

const indicatorColorClass = computed(() => getNormalColorClass(props.indicatorColor, false, false))
const indicatorColor = computed(() => getColor(props.indicatorColor))
</script>
