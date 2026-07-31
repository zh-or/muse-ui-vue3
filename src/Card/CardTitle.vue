<template>
  <div class="mu-card-title-container">
    <div class="mu-card-title">{{ title }}</div>
    <div class="mu-card-sub-title">{{ subTitle }}</div>
  </div>
</template>

<script setup>
defineOptions({ name: 'mu-card-title' })

defineProps({
  title: String,
  subTitle: String
})
</script>
