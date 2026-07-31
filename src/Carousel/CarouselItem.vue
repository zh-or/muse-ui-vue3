<template>
  <Transition :name="'mu-carousel-' + transitionName">
    <div v-show="active" :class="['mu-carousel-item', ...classes]">
      <slot />
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, inject, onBeforeUnmount } from 'vue'

defineOptions({ name: 'mu-carousel-item' })

const addCarouselItem = inject('addCarouselItem')
const removeCarouselItem = inject('removeCarouselItem')
const isCarouselActive = inject('isCarouselActive')
const getCarouselTransition = inject('getCarouselTransition')

const classes = ref([])

const itemId = Symbol('carousel-item')
addCarouselItem(itemId)
onBeforeUnmount(() => removeCarouselItem(itemId))

const active = computed(() => isCarouselActive(itemId))
const transitionName = computed(() => getCarouselTransition())
</script>
