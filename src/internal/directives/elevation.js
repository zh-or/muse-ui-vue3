import '../../styles/components/elevation.less';
import { hasClass, addClass, removeClass } from '../../utils/dom';

function getElevationClass(depth) {
  return 'mu-elevation-' + depth;
}

export default {
  name: 'elevation',
  mounted(el, { value }) {
    addClass(el, getElevationClass(value));
  },
  updated(el, { value, oldValue }) {
    if (value === oldValue && hasClass(el, getElevationClass(oldValue))) return;
    removeClass(el, getElevationClass(oldValue));
    addClass(el, getElevationClass(value));
  },
  unmounted(el, { value }) {
    removeClass(el, getElevationClass(value));
  }
};
