import { h } from 'vue';
import Checkbox from '../../Checkbox';
import { ExpandTransition } from '../../internal/transitions';

export default {
  props: {
    expandRowIndex: {
      type: Number,
      default: -1
    },
    autoExpand: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      hoverIndex: -1,
      expandIndex: this.expandRowIndex,
      isSelectAll: false
    };
  },
  methods: {
    handleScroll (e) {
      const scrollLeft = e.target.scrollLeft;
      const theader = this.$refs.header;
      const tfooter = this.$refs.tfooter;
      if (theader) theader.scrollLeft = scrollLeft;
      if (tfooter) tfooter.scrollLeft = scrollLeft;
    },
    isSelected (index) {
      return this.selects.indexOf(index) !== -1;
    },
    toggleSelect (index) {
      if (!this.selectable) return;
      const selects = [...this.selects];
      const selectIndex = selects.indexOf(index);
      if (selectIndex !== -1) {
        selects.splice(selectIndex, 1);
      } else {
        selects.push(index);
      }
      selects.sort((a, b) => a - b);
      this.$emit('update:selects', selects);
      this.$emit('select-change', index, selects);
    },
    toggleExpand (index) {
      this.expandIndex = this.expandIndex === index ? -1 : index;
    },
    createEmpty () {
      return [
        this.$slots.empty
          ? this.$slots.empty()
          : h('div', { class: 'mu-table-empty' }, this.noDataText)
      ];
    },
    createSlotContent (row, index) {
      return this.$slots.default({
        row,
        $index: index
      });
    },
    createCheckboxTd (index) {
      return h('td', {
        class: 'mu-checkbox-col'
      }, [
        h(Checkbox, {
          modelValue: this.isSelected(index),
          disabled: !this.selectable,
          onChange: () => this.toggleSelect(index), onClick: (e) => {
          }
        })
      ]);
    },
    createContent () {
      const contents = [];
      for (let index = 0; index < this.data.length; index++) {
        const row = this.data[index];
        const arr = this.$slots.default
          ? this.createSlotContent(row, index)
          : this.columns.map((column) => {
            const text = column.formatter && typeof column.formatter === 'function'
              ? column.formatter(row[column.name], row)
              : row[column.name];
            return h('td', {
              class: [
                column.align || column.cellAlign ? `is-${column.cellAlign || column.align}` : ''
              ]
            }, text);
          }) || [];
        if (this.checkbox) arr.unshift(this.createCheckboxTd (index));

        const rowClassName = typeof this.rowClassName === 'function' ? this.rowClassName(index, row) : this.rowClassName;
        contents.push(
          h('tr', {
            class: [rowClassName, {
              'is-hover': this.hover && this.hoverIndex === index,
              'is-stripe': this.stripe && index % 2 !== 0,
              'is-selected': this.isSelected(index)
            }],
            style: typeof this.rowStyle === 'function' ? this.rowStyle(index, row) : this.rowStyle,
            onMouseenter: (e) => {
              this.hoverIndex = index;
              this.$emit('row-mouseenter', index, row, e);
            },
            onMouseleave: (e) => {
              this.hoverIndex = -1;
              this.$emit('row-mouseleave', index, row, e);
            },
            onContextmenu: (e) => {
              this.$emit('row-contextmenu', index, row, e);
            },
            onClick: (e) => {
              if (!this.checkbox) this.toggleSelect(index);
              if (this.autoExpand) this.toggleExpand(index);
              this.$emit('row-click', index, row, e);
            },
            onDblclick: (e) => this.$emit('row-dblclick', index, row, e),
            key: row[this.rowKey],
          }, arr)
        );

        if (this.$slots.expand) {
          contents.push(
            h('tr', {
              class: 'mu-table-expand-row'
            }, [
              h('td', {
                colspan: this.columns.length + (this.checkbox ? 1 : 0),
                class: {
                  'is-expand': this.expandIndex === index
                }
              }, this.expandIndex === index ? [
                h(ExpandTransition, {}, () => this.$slots.expand({
                  row,
                  $index: index
                }))
              ] : undefined)
            ])
          );
        }
      }
      return contents;
    },
    createBody () {
      return this.data && this.data.length > 0 ? h('div', {
        class: 'mu-table-body-wrapper',
        onScroll: this.handleScroll,
        ref: 'body'
      }, [
        h('table', {
          class: 'mu-table-body',
          style: {
            width: this.tableWidth
          }
        }, [
          this.createColGroup(),
          h('tbody', {}, this.createContent())
        ])
      ]) : this.createEmpty();
    }
  },
  watch: {
    selects (val) {
      this.isSelectAll = val && val.length >= this.data.length;
    },
    expandRowIndex (val) {
      if (this.expandIndex === val) return;
      this.expandIndex = val;
    },
    expandIndex (val) {
      this.$emit('update:expandRowIndex', val);
      this.$emit('change-expand', val);
    }
  }
};