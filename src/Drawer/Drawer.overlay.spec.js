import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Drawer from './Drawer.vue'

describe('Drawer mask (overlay) behavior', () => {
  let wrapper

  beforeEach(() => {
    document.body.innerHTML = ''
  })
  afterEach(() => {
    if (wrapper) wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('shows the mask and closes when the mask is clicked', async () => {
    wrapper = mount(Drawer, {
      props: { open: true, docked: false }
    })
    await nextTick()
    await nextTick()

    const overlay = document.querySelector('.mu-overlay')
    expect(overlay).toBeTruthy()
    expect(wrapper.emitted('update:open')).toBeFalsy()

    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('update:open')[0][0]).toBe(false)
  })

  it('closes on ESC key press', async () => {
    wrapper = mount(Drawer, {
      props: { open: true, docked: false }
    })
    await nextTick()
    await nextTick()

    window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }))
    await nextTick()

    expect(wrapper.emitted('update:open')).toBeTruthy()
  })
})