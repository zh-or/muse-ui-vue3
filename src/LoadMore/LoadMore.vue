<template>
  <div ref="elRef" class="mu-load-more">
    <RefreshControl v-if="hasRefresh" :refreshing="refreshing" :trigger="elRef" @refresh="$emit('refresh')" />
    <slot />
    <InfiniteScroll v-if="hasLoad && !loadedAll" :loading="loading" :loading-text="loadingText" @load="$emit('load')" />
  </div>
</template>

<script setup>
import { ref, computed, useAttrs, defineOptions } from 'vue'

defineOptions({ name: 'mu-load-more' })
import RefreshControl from './RefreshControl'
import InfiniteScroll from './InfiniteScroll'
import { isNotNull } from '../utils'

const props = defineProps({
  refreshing: Boolean, loadedAll: Boolean,
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: '正在加载...' }
})

const attrs = useAttrs()
const elRef = ref(null)
const hasRefresh = computed(() => isNotNull(attrs.onRefresh))
const hasLoad = computed(() => isNotNull(attrs.onLoad))
</script>
