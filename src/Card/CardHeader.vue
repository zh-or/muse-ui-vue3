<template>
  <div class="mu-card-header">
    <slot name="avatar" />
    <div v-if="title || subTitle" class="mu-card-header-title">
      <div class="mu-card-title">{{ title }}</div>
      <div class="mu-card-sub-title">{{ subTitle }}</div>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'mu-card-header' })

defineProps({
  title: String,
  subTitle: String
})
</script>
