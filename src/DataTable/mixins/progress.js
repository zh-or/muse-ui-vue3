import { h } from 'vue';
import { LinearProgress } from '../../Progress';
import { FadeTransition } from '../../internal/transitions';

export default {
  mounted () {
  },
  methods: {
    createProgress () {
      const headerHeight = this.$refs.header ? this.$refs.header.offsetHeight + 'px' : '';
      return h(FadeTransition, {}, () => [
        this.loading ? h(LinearProgress, {
          class: 'mu-table-progress',
          style: {
            top: headerHeight
          }
        }) : undefined
      ]);
    }
  }
};
