import { h } from 'vue';
import Checkbox from '../../Checkbox';
import Tooltip from '../../Tooltip';

export default {
  methods: {
    toggleSelectAll (val) {
      this.isSelectAll = val;
      const selects = [];
      if (this.isSelectAll) {
        let i = 0;
        while (i < this.data.length) {
          selects.push(i++);
        }
      }
      this.$emit('update:selects', selects);
    },
    handleSortChange (column) {
      const sort = {
        ...this.sort
      };

      if (this.sort && this.sort.name === column.name) {
        sort.order = sort.order === 'desc' ? 'asc' : 'desc';
      } else {
        sort.name = column.name;
        sort.order = 'desc';
      }

      this.$emit('update:sort', sort);
      this.$emit('sort-change', sort);
    },
    createSlotHeader () {
      return this.$slots.header({
        columns: this.columns
      });
    },
    createSlotTh (column) {
      return this.$slots.th({
        ...column
      });
    },
    createDefaultTh (column) {
      return [
        column.sortable ? h('svg', {
          class: 'mu-table-sort-icon',
          viewBox: '0 0 24 24'
        }, [
          h('path', {
            d: 'M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z'
          })
        ]) : undefined,
        column.title
      ];
    },
    createTh (column) {
      return this.$slots.th ? this.createSlotTh(column) : this.createDefaultTh (column);
    },
    createCheckboxTh () {
      const isEnable = this.selectable && this.selectAll;
      return h('th', {
        class: 'mu-checkbox-col'
      }, [
        h(Checkbox, {
          modelValue: this.isSelectAll,
          disabled: !isEnable,
          onChange: this.toggleSelectAll
        })
      ]);
    },
    createTHeader () {
      const arr = this.columns.map((column) => {
        const th = h('th', {
          class: [
            column.align ? `is-${column.align}` : '',
            column.class || '',
            column.sortable ? 'is-sortable' : '',
            column.sortable && this.sort && this.sort.name === column.name ? 'is-sorting' : '',
            column.sortable && this.sort && this.sort.name === column.name && this.sort.order === 'asc' ? 'sort-asc' : ''
          ],
          onClick: () => column.sortable && this.handleSortChange(column)
        }, this.createTh (column));

        return column.tooltip ? h(Tooltip, {
          content: column.tooltip
        }, () => [th]) : th;
      });

      if (this.checkbox) arr.unshift(this.createCheckboxTh());
      return h('tr', {}, arr);
    },
    createHeader () {
      return h('div', {
        class: 'mu-table-header-wrapper',
        ref: 'header',
        vMousewheel: this.handleHeaderFooterMousewheel
      }, [
        h('table', {
          class: 'mu-table-header',
          style: {
            width: this.tableWidth
          }
        }, [
          this.createColGroup(),
          h('thead', {}, [
            this.$slots.header ? this.createSlotHeader() : this.createTHeader()
          ])
        ])
      ]);
    }
  }
};