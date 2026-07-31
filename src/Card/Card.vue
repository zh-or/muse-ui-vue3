<template>
  <div :class="['mu-card', { 'mu-card__raised': raised }]">
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'mu-card' })

defineProps({
  raised: Boolean
})
</script>
