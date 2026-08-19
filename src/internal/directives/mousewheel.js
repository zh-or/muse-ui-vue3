import normalizeWheel from 'normalize-wheel';

const isFirefox =
  typeof navigator !== 'undefined' &&
  navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

export default {
  name: 'mousewheel',
  mounted(el, binding) {
    const handler = function (event) {
      const normalized = normalizeWheel(event);
      binding.value && binding.value.apply(this, [event, normalized]);
    };
    el._wheelEventName = isFirefox ? 'DOMMouseScroll' : 'mousewheel';
    el._wheelHandler = handler;
    if (el.addEventListener) {
      el.addEventListener(el._wheelEventName, handler);
    }
  },
  unmounted(el) {
    if (el._wheelHandler && el.removeEventListener) {
      el.removeEventListener(el._wheelEventName, el._wheelHandler);
    }
    el._wheelHandler = null;
  }
};