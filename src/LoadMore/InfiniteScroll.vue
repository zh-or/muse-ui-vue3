<template>
  <div ref="rootEl" class="mu-infinite-scroll" v-scroll="{ callback: onScroll, target: rootEl }">
    <Circular v-show="loading" :size="24" />
    <span v-show="loading" class="mu-infinite-scroll-text">{{ loadingText }}</span>
  </div>
</template>

<script>
import scroll from '../internal/directives/scroll'
export default { directives: { scroll } }
</script>

<script setup>
import { ref, defineOptions } from 'vue'
import Circular from '../Progress/Circular'

defineOptions({ name: 'mu-infinite-scroll' })
import { getScrollTop } from '../utils/dom'

const props = defineProps({
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: '正在加载...' }
})
const emit = defineEmits(['load'])

const rootEl = ref(null)

function onScroll(scroller) {
  if (props.loading) return
  const isWindow = scroller === window
  const scrollTop = getScrollTop(scroller)
  const scrollHeight = isWindow ? document.documentElement.scrollHeight || document.body.scrollHeight : scroller.scrollHeight
  const h = scrollHeight - scrollTop - 5
  const sh = isWindow ? window.innerHeight : scroller.offsetHeight
  if (h <= sh) emit('load')
}
</script>
