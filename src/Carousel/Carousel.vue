<template>
  <div
    :class="['mu-carousel', { 'mu-carousel__transition_inverse': inverse }]"
    v-swipe="{ left: next, right: prev, touch: true }"
  >
    <Button v-if="!hideControls" class="mu-carousel-button mu-carousel-button__left" icon @click="prev">
      <slot name="left">
        <svg class="mu-carousel-svg-icon" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </slot>
    </Button>
    <Button v-if="!hideControls" class="mu-carousel-button mu-carousel-button__right" icon @click="next">
      <slot name="right">
        <svg class="mu-carousel-svg-icon" viewBox="0 0 24 24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </slot>
    </Button>
    <div v-if="!hideIndicators" class="mu-carousel-indicators">
      <template v-for="(item, index) in items" :key="index">
        <slot name="indicator" :index="index" :active="index === activeIndex">
          <Button
            :class="['mu-carousel-indicator-button', { 'mu-carousel-indicator-button__active': index === activeIndex }]"
            icon
            @click="changeActiveIndex(index)"
          >
            <span class="mu-carousel-indicator-icon" />
          </Button>
        </slot>
      </template>
    </div>
    <slot />
  </div>
</template>

<script>
import swipe from '../internal/directives/swipe'
export default { directives: { swipe } }
</script>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, provide } from 'vue'
import Button from '../Button'

defineOptions({ name: 'mu-carousel' })

const props = defineProps({
  active: { type: Number, default: 0 },
  cycle: { type: Boolean, default: true },
  interval: { type: [Number, String], default: 6000, validator: (v) => v > 0 },
  transition: { type: String, default: 'slide', validator: (v) => ['slide', 'fade'].indexOf(v) !== -1 },
  hideIndicators: Boolean,
  hideControls: Boolean
})

const emit = defineEmits(['change', 'update:active'])
const items = ref([])
const inverse = ref(false)
const activeIndex = ref(props.active)
const timer = ref(null)

provide('addCarouselItem', (item) => {
  const index = items.value.indexOf(item)
  if (index === -1) return items.value.push(item)
  items.value.splice(index, 0, item)
})
provide('removeCarouselItem', (item) => {
  const index = items.value.indexOf(item)
  if (index === -1) return
  items.value.splice(index, 1)
})
provide('isCarouselActive', (item) => items.value.indexOf(item) === activeIndex.value)
provide('getCarouselTransition', () => props.transition)

onMounted(() => startAutoNext())
onBeforeUnmount(() => { if (timer.value) clearInterval(timer.value) })

function startAutoNext() {
  if (timer.value) clearInterval(timer.value)
  if (!props.cycle) return
  timer.value = setInterval(() => next(), props.interval > 0 ? props.interval : 6000)
}

function next() {
  const maxIndex = items.value.length - 1
  if (maxIndex < 0) return
  let index = activeIndex.value + 1
  if (index > maxIndex) {
    if (!props.cycle) return
    index = 0
  }
  activeIndex.value = index
  inverse.value = false
}

function prev() {
  if (items.value.length === 0) return
  let index = activeIndex.value - 1
  if (index < 0) {
    if (!props.cycle) return
    index = items.value.length - 1
  }
  activeIndex.value = index
  inverse.value = true
}

function changeActiveIndex(index) {
  if (index !== activeIndex.value) {
    inverse.value = activeIndex.value > index
    activeIndex.value = index
  }
}

watch(activeIndex, (val) => {
  startAutoNext()
  emit('change', val)
  emit('update:active', val)
})
watch(() => props.active, (val) => changeActiveIndex(val))
watch(() => props.cycle, () => startAutoNext())
watch(() => props.interval, () => startAutoNext())
</script>
