<template>
  <div :class="['mu-step-content', { last: last }]">
    <div style="position: relative; overflow: hidden; height: 100%">
      <ExpandTransition>
        <div v-if="active" class="mu-step-content-inner" ref="inner">
          <slot />
        </div>
      </ExpandTransition>
    </div>
  </div>
</template>

<script setup>
import { defineOptions } from 'vue'
import ExpandTransition from '../internal/ExpandTransition.vue'

defineOptions({ name: 'mu-step-content' })
defineProps({ active: Boolean, last: Boolean })
</script>
