import { createApp } from 'vue';
import keycode from 'keycode';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import OverlayComp from './Overlay';

const PopupManager = {
  instances: [],
  overlay: null,
  overlayApp: null,

  open(instance) {
    if (!instance || this.instances.indexOf(instance) !== -1) return;
    if (!this.overlay && instance.overlay) {
      this.showOverlay(instance);
    }
    this.instances.push(instance);
    this.changeOverlayStyle();
  },

  close(instance) {
    const index = this.instances.indexOf(instance);
    if (index === -1) return;
    this.instances.splice(index, 1);
    this.changeOverlayStyle();
  },

  showOverlay(instance) {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const overlayApp = createApp(OverlayComp, {
      fixed: true,
      color: instance.overlayColor,
      opacity: instance.overlayOpacity,
      zIndex: instance.overlayZIndex,
      onClick: () => this.handleOverlayClick()
    });
    const overlayInstance = overlayApp.mount(container);
    overlayInstance.open();

    this.overlay = {
      $el: container,
      app: overlayApp,
      instance: overlayInstance,
      show: true,
      color: instance.overlayColor,
      opacity: instance.overlayOpacity,
      zIndex: instance.overlayZIndex
    };
    this.overlayApp = overlayApp;

    if (instance.lockScroll) this.preventScrolling();
  },

  preventScrolling() {
    if (this.locked) return;
    const body = document.getElementsByTagName('body')[0];
    disableBodyScroll(body, {
      reserveScrollBarGap: true,
      allowTouchMove: (el) => {
        for (let i = 0; i < this.instances.length; i++) {
          if (
            this.instances[i] &&
            this.instances[i].$el &&
            this.instances[i].$el.contains(el)
          ) {
            return true;
          }
        }
        return false;
      }
    });
    this.locked = true;
  },

  allowScrolling() {
    const body = document.getElementsByTagName('body')[0];
    enableBodyScroll(body, {
      reserveScrollBarGap: true
    });
    clearAllBodyScrollLocks();
    this.locked = false;
  },

  closeOverlay() {
    if (!this.overlay) return;
    this.allowScrolling();
    const overlay = this.overlay;
    this.overlay = null;
    if (overlay.instance) overlay.instance.close();
    setTimeout(() => {
      overlay.app.unmount();
      if (overlay.$el && overlay.$el.parentNode) {
        overlay.$el.parentNode.removeChild(overlay.$el);
      }
    }, 450);
  },

  changeOverlayStyle() {
    if (!this.overlay) return;
    let instance;
    for (let i = 1; i <= this.instances.length; i++) {
      instance = this.instances[this.instances.length - i];
      if (instance && instance.overlay) {
        break;
      }
      instance = null;
    }

    if (!instance) return this.closeOverlay();

    if (instance && instance.overlay) {
      this.overlay.color = instance.overlayColor;
      this.overlay.opacity = instance.overlayOpacity;
      this.overlay.zIndex = instance.overlayZIndex;
    }
  },

  handleOverlayClick() {
    if (this.instances.length === 0) return;
    const instance = this.instances[this.instances.length - 1];
    if (instance.overlayClick) {
      instance.overlayClick();
    }
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (PopupManager.instances.length === 0 || keycode(e) !== 'esc') return;
    const instance = PopupManager.instances[PopupManager.instances.length - 1];
    if (instance.escPress) {
      instance.escPress();
    }
  });
}

export default PopupManager;
