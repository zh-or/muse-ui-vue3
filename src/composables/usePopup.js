import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import PopupManager from '../internal/mixins/popup/manager';
import { getZIndex } from '../internal/mixins/popup/utils';

export const popupProps = {
  modelValue: {
    type: Boolean,
    default: undefined
  },
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

export const popupOpenProps = {
  ...popupProps,
  open: Boolean
};

export function usePopup(props, { emit }, rootRef) {
  const overlayZIndex = ref(getZIndex());
  const zIndex = ref(getZIndex());
  let appened = false;
  let popupInstance = null;

  const isModelValue = computed(() => props.modelValue !== undefined);
  const hasOpen = computed(() => 'open' in props);
  const isOpen = computed(() => isModelValue.value ? props.modelValue : (hasOpen.value ? props.open : false));

  const emitClose = (reason) => {
    if (isModelValue.value) emit('update:modelValue', false);
    if (hasOpen.value) emit('update:open', false);
    emit('close', reason);
  };

  const overlayClick = () => {
    if (!props.overlay || !props.overlayClose || !isOpen.value) return;
    emitClose('overlay');
  };

  const escPress = () => {
    if (!props.escPressClose || !isOpen.value) return;
    emitClose('esc');
  };

  const resetZIndex = () => {
    overlayZIndex.value = getZIndex();
    zIndex.value = getZIndex();
  };

  const appendPopupElToBody = () => {
    if (!props.appendBody || appened) return;
    nextTick(() => {
      document.body.appendChild(rootRef.value);
      appened = true;
    });
  };

  const popupOpen = () => {
    popupInstance = { overlayClick, escPress, overlayZIndex: overlayZIndex.value, overlay: props.overlay, overlayColor: props.overlayColor, overlayOpacity: props.overlayOpacity, lockScroll: props.lockScroll, $el: rootRef.value };
    PopupManager.open(popupInstance);
  };

  const popupClose = () => {
    if (popupInstance) {
      PopupManager.close(popupInstance);
      popupInstance = null;
    }
  };

  onMounted(() => {
    if (isOpen.value) {
      popupOpen();
      appendPopupElToBody();
    }
  });

  onBeforeUnmount(() => {
    popupClose();
    if (props.appendBody) {
      const el = rootRef.value;
      if (!el) return;
      if (el.parentNode) el.parentNode.removeChild(el);
    }
  });

  watch(isOpen, (val) => {
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
    escPress,
    isOpen
  };
}
