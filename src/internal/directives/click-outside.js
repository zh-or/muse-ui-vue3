const clickoutsideContext = '@@clickoutsideContext';

export default {
  name: 'click-outside',
  mounted(el, binding) {
    const documentHandler = function (e) {
      if (!binding.instance || el.contains(e.target)) return;
      el[clickoutsideContext].bindingFn(e);
    };
    el[clickoutsideContext] = {
      documentHandler,
      bindingFn: binding.value
    };
    setTimeout(() => {
      document.addEventListener('click', documentHandler);
    }, 0);
  },

  updated(el, binding) {
    el[clickoutsideContext].bindingFn = binding.value;
  },

  unmounted(el) {
    document.removeEventListener('click', el[clickoutsideContext].documentHandler);
  }
};
