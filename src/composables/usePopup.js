import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import PopupManager from '../internal/mixins/popup/manager';
import { getZIndex } from '../internal/mixins/popup/utils';

export const popupProps = {
  open: Boolean,
  overlay: {
    type: Boolean,
    default: true
  },
  overlayClose: {
    type: Boolean,
    default: true
  },
  overlayOpacity: {
    type: Number,
    default: 0.4
  },
  overlayColor: {
    type: String,
    default: '#000'
  },
  escPressClose: {
    type: Boolean,
    default: true
  },
  lockScroll: {
    type: Boolean,
    default: false
  },
  appendBody: {
    type: Boolean,
    default: true
  }
};

export function usePopup(props, { emit }, vm) {
  const overlayZIndex = ref(getZIndex());
  const zIndex = ref(getZIndex());
  let appened = false;
  let popupInstance = null;

  const overlayClick = () => {
    if (!props.overlay || !props.overlayClose || !props.open) return;
    emit('update:open', false);
    emit('close', 'overlay');
  };

  const escPress = () => {
    if (!props.escPressClose || !props.open) return;
    emit('update:open', false);
    emit('close', 'esc');
  };

  const resetZIndex = () => {
    overlayZIndex.value = getZIndex();
    zIndex.value = getZIndex();
  };

  const popupEl = () => {
    return vm.$el;
  };

  const appendPopupElToBody = () => {
    if (!props.appendBody || appened) return;
    nextTick(() => {
      document.body.appendChild(vm.$el);
      appened = true;
    });
  };

  const popupOpen = () => {
    popupInstance = { overlayClick, escPress, overlayZIndex: overlayZIndex.value, overlay: props.overlay, overlayColor: props.overlayColor, overlayOpacity: props.overlayOpacity, lockScroll: props.lockScroll, $el: vm.$el };
    PopupManager.open(popupInstance);
  };

  const popupClose = () => {
    if (popupInstance) {
      PopupManager.close(popupInstance);
      popupInstance = null;
    }
  };

  onMounted(() => {
    if (props.open) {
      popupOpen();
      appendPopupElToBody();
    }
  });

  onBeforeUnmount(() => {
    popupClose();
    if (props.appendBody) {
      if (!vm.$el) return;
      if (vm.$el.parentNode) vm.$el.parentNode.removeChild(vm.$el);
    }
  });

  watch(() => props.open, (val) => {
    if (val) {
      resetZIndex();
      popupOpen();
      appendPopupElToBody();
    } else {
      popupClose();
    }
  });

  return {
    overlayZIndex,
    zIndex,
    overlayClick,
    escPress
  };
}
