import { h } from 'vue';
export default {
  methods: {
    createFooter () {
      return this.$slots.footer ? h('div', {
        class: 'mu-table-footer-wrapper',
        ref: 'footer'
      }, [
        h('table', {
          class: 'mu-table-footer',
          style: {
            width: this.tableWidth
          }
        }, [
          this.createColGroup(),
          h('tbody', {}, this.$slots.footer({
            columns: this.columns
          }))
        ])
      ]) : undefined;
    }
  }
};
