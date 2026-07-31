<template>
  <Transition
    name="mu-expand"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot />
  </Transition>
</template>

<script setup>
import { Transition } from 'vue'

function getSize(size) {
  if (!size) return 0
  const index = size.indexOf('px')
  if (index === -1) return 0
  return Number(size.substring(0, index))
}

function beforeEnter(el) {
  el.dataset.oldPaddingTop = el.style.paddingTop
  el.dataset.oldPaddingBottom = el.style.paddingBottom
  el.dataset.oldOverflow = el.style.overflow
  el.style.paddingTop = '0'
  el.style.paddingBottom = '0'
  el.style.height = '0'
}

function enter(el) {
  el.style.display = 'block'
  el.style.overflow = 'hidden'
  el.style.height = el.scrollHeight + getSize(el.dataset.oldPaddingTop) + getSize(el.dataset.oldPaddingBottom) + 'px'
  el.style.paddingTop = el.dataset.oldPaddingTop
  el.style.paddingBottom = el.dataset.oldPaddingBottom
}

function afterEnter(el) {
  el.style.display = ''
  el.style.height = ''
  el.style.overflow = el.dataset.oldOverflow
  el.style.paddingTop = el.dataset.oldPaddingTop
  el.style.paddingBottom = el.dataset.oldPaddingBottom
}

function beforeLeave(el) {
  el.dataset.oldPaddingTop = el.style.paddingTop
  el.dataset.oldPaddingBottom = el.style.paddingBottom
  el.dataset.oldOverflow = el.style.overflow

  el.style.display = 'block'
  if (el.scrollHeight !== 0) {
    el.style.height = el.scrollHeight + 'px'
  }
  el.style.overflow = 'hidden'
}

function leave(el) {
  if (el.scrollHeight !== 0) {
    setTimeout(() => {
      el.style.height = 0
      el.style.paddingTop = 0
      el.style.paddingBottom = 0
    })
  }
}

function afterLeave(el) {
  el.style.display = 'none'
  el.style.height = ''
  el.style.overflow = el.dataset.oldOverflow
  el.style.paddingTop = el.dataset.oldPaddingTop
  el.style.paddingBottom = el.dataset.oldPaddingBottom
}
</script>

<style lang="less">
@import '../styles/components/expand-transition.less';
</style>
