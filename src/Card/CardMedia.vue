<template>
  <div class="mu-card-media">
    <slot />
    <div v-if="title || subTitle" class="mu-card-media-title">
      <div class="mu-card-title">{{ title }}</div>
      <div class="mu-card-sub-title">{{ subTitle }}</div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'mu-card-media' })

defineProps({
  title: String,
  subTitle: String
})
</script>
