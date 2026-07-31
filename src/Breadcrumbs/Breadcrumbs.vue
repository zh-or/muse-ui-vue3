<script>
import { h } from 'vue'

export default {
  name: 'mu-breadcrumbs',
  props: {
    divider: {
      type: String,
      default: '/'
    }
  },
  setup(props, { slots }) {
    function createChildren() {
      if (!slots.default) return
      const dividerSlot = slots.divider
      const dividerContent = dividerSlot ? dividerSlot() : props.divider
      const children = []
      const slotNodes = slots.default()
      const length = slotNodes.length
      const dividerData = { class: 'mu-breadcrumbs-divider' }

      slotNodes.forEach((el, i) => {
        children.push(el)
        const isBreadcrumbItem = el.type && (el.type.name === 'mu-breadcrumbs-item' || (typeof el.type === 'object' && el.type.name === 'mu-breadcrumbs-item'))
        if (!isBreadcrumbItem || i === length - 1) return
        children.push(h('li', dividerData, dividerContent))
      })
      return children
    }

    return () => h('ul', {
      class: 'mu-breadcrumbs'
    }, createChildren())
  }
}
</script>
