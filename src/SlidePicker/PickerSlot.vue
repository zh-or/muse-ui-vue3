<template>
  <div
    ref="root"
    :class="['mu-slide-picker-slot', { 'mu-slide-picker-slot-divider': divider }]"
    :style="{ width }"
    @touchmove.prevent
  >
    <div v-if="divider">{{ content }}</div>
    <div
      v-else
      ref="wrapper"
      :class="['mu-slide-picker-slot-wrapper', { animate }]"
      :style="{ height: contentHeight + 'px' }"
      v-swipe="swipeBindings"
    >
      <div
        v-for="(item, index) in values"
        :key="'pick-slot-' + index"
        :class="['mu-slide-picker-item', { selected: item === value }]"
        :style="{ 'text-align': textAlign }"
      >{{ item.text || item }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import swipe from '../internal/directives/swipe'
import translateUtil from '../utils/translate'
import { transitionEnd } from '../utils/dom'

const vSwipe = swipe

const props = defineProps({
  divider: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    default: ''
  },
  values: {
    type: Array,
    default() {
      return []
    }
  },
  itemHeight: {
    type: Number,
    default: 36
  },
  value: {},
  textAlign: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: ''
  },
  visibleItemCount: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['change'])

const root = ref(null)
const wrapper = ref(null)
const animate = ref(false)
const startTop = ref(0)
const velocityTranslate = ref(0)
const prevTranslate = ref(0)

const contentHeight = computed(() => props.itemHeight * props.visibleItemCount)
const valueIndex = computed(() => props.values.indexOf(props.value))
const dragRange = computed(() => {
  const values = props.values
  const visibleItemCount = props.visibleItemCount
  return [-props.itemHeight * (values.length - Math.ceil(visibleItemCount / 2)), props.itemHeight * Math.floor(visibleItemCount / 2)]
})

const swipeBindings = {
  start: handleStart,
  move: handleMove,
  end: handleEnd
}

onMounted(() => {
  if (!props.divider) {
    doOnValueChange()
  }
})

watch(() => props.values, (newVal) => {
  if (newVal.indexOf(props.value) === -1) {
    emit('change', (newVal || [])[0])
  }
})

watch(() => props.value, () => {
  doOnValueChange()
})

function value2Translate(value) {
  const values = props.values
  const valueIndex = values.indexOf(value)
  const offset = Math.floor(props.visibleItemCount / 2)
  if (valueIndex !== -1) {
    return (valueIndex - offset) * -props.itemHeight
  }
}

function translate2Value(translate) {
  translate = Math.round(translate / props.itemHeight) * props.itemHeight
  const index = -(translate - Math.floor(props.visibleItemCount / 2) * props.itemHeight) / props.itemHeight
  return props.values[index]
}

function doOnValueChange() {
  const value = props.value
  translateUtil.translateElement(wrapper.value, null, value2Translate(value))
}

function doOnValuesChange() {
  const items = root.value.querySelectorAll('.mu-slide-picker-item')
  Array.prototype.forEach.call(items, (item, index) => {
    translateUtil.translateElement(item, null, props.itemHeight * index)
  })
}

function handleStart() {
  startTop.value = translateUtil.getElementTranslate(wrapper.value).top
}

function handleMove(pos) {
  const el = wrapper.value
  const translate = startTop.value + pos.y
  translateUtil.translateElement(el, 0, translate)
  velocityTranslate.value = translate - prevTranslate.value || translate
  prevTranslate.value = translate
}

function handleEnd(pos) {
  const el = wrapper.value
  const momentumRatio = 7
  const currentTranslate = translateUtil.getElementTranslate(el).top
  let momentumTranslate
  if (pos.time < 300) {
    momentumTranslate = currentTranslate + velocityTranslate.value * momentumRatio
  }
  const dragRangeVal = dragRange.value
  animate.value = true
  transitionEnd(el, () => {
    animate.value = false
  })
  nextTick(() => {
    let translate
    if (momentumTranslate) {
      translate = Math.round(momentumTranslate / props.itemHeight) * props.itemHeight
    } else {
      translate = Math.round(currentTranslate / props.itemHeight) * props.itemHeight
    }
    translate = Math.max(Math.min(translate, dragRangeVal[1]), dragRangeVal[0])
    translateUtil.translateElement(el, null, translate)
    emit('change', translate2Value(translate))
  })
}
</script>
